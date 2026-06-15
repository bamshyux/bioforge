"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { resolveMusicPlayerColor } from "@/lib/settings";
import { rangeClassName, rangeFillStyle } from "@/lib/ui/range";
import type { ProfileSettings } from "@/lib/types/settings";

const GESTURE_EVENTS = ["pointerdown", "touchstart", "touchend", "click", "keydown"] as const;
const RETRY_MS = 350;
const MAX_RETRIES = 12;

function formatTitle(settings: ProfileSettings) {
  if (settings.music_title?.trim()) return settings.music_title.trim();
  if (settings.music_url) {
    try {
      const name = settings.music_url.split("/").pop()?.split(".")[0];
      if (name) return decodeURIComponent(name).replace(/[-_]/g, " ");
    } catch {
      /* ignore */
    }
  }
  return "Profile Track";
}

export function MusicPlayer({ settings }: { settings: ProfileSettings }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const settingsRef = useRef(settings);
  const gestureCleanupRef = useRef<(() => void) | null>(null);
  const retryTimerRef = useRef<number | null>(null);
  const bootIdRef = useRef(0);

  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(settings.music_volume);
  const [expanded, setExpanded] = useState(false);
  const [needsUnmute, setNeedsUnmute] = useState(false);

  const title = formatTitle(settings);
  const playerColor = resolveMusicPlayerColor(settings);

  settingsRef.current = settings;

  const clearGestureListeners = useCallback(() => {
    gestureCleanupRef.current?.();
    gestureCleanupRef.current = null;
  }, []);

  const clearRetryTimer = useCallback(() => {
    if (retryTimerRef.current != null) {
      window.clearInterval(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  const applyVolume = useCallback((audio: HTMLAudioElement, value = settingsRef.current.music_volume) => {
    audio.volume = Math.max(0, Math.min(1, value / 100));
  }, []);

  const resetToStart = useCallback((audio: HTMLAudioElement) => {
    try {
      audio.currentTime = 0;
    } catch {
      /* ignore seek before metadata */
    }
  }, []);

  const tryPlay = useCallback(
    async (audio: HTMLAudioElement, withSound: boolean) => {
      const current = settingsRef.current;
      if (!current.music_url || !current.music_autoplay) return false;

      resetToStart(audio);
      audio.loop = current.music_loop;
      applyVolume(audio);
      audio.muted = !withSound;

      try {
        await audio.play();
        if (withSound) {
          audio.muted = false;
          applyVolume(audio);
          setNeedsUnmute(false);
        } else {
          setNeedsUnmute(true);
        }
        setPlaying(true);
        return true;
      } catch {
        audio.muted = false;
        return false;
      }
    },
    [applyVolume, resetToStart],
  );

  const bootstrapAutoplay = useCallback(
    (audio: HTMLAudioElement) => {
      const bootId = ++bootIdRef.current;
      clearGestureListeners();
      clearRetryTimer();

      const current = settingsRef.current;
      audio.loop = current.music_loop;
      applyVolume(audio);

      if (!current.music_url) return;
      if (!current.music_autoplay) {
        resetToStart(audio);
        audio.pause();
        audio.muted = false;
        setPlaying(false);
        setNeedsUnmute(false);
        return;
      }

      const isStale = () => bootId !== bootIdRef.current || audioRef.current !== audio;

      const unlockWithSound = () => {
        if (isStale() || !settingsRef.current.music_autoplay) return;
        void tryPlay(audio, true).then((ok) => {
          if (ok) {
            clearGestureListeners();
            clearRetryTimer();
          }
        });
      };

      const attachGestureUnlock = () => {
        if (gestureCleanupRef.current || isStale()) return;

        const handler = () => unlockWithSound();
        const opts = { capture: true, passive: true } as const;

        for (const eventName of GESTURE_EVENTS) {
          document.addEventListener(eventName, handler, opts);
        }

        gestureCleanupRef.current = () => {
          for (const eventName of GESTURE_EVENTS) {
            document.removeEventListener(eventName, handler, true);
          }
        };
      };

      const attemptAutoplay = async () => {
        if (isStale() || !settingsRef.current.music_autoplay) return false;

        if (await tryPlay(audio, true)) {
          clearGestureListeners();
          clearRetryTimer();
          return true;
        }

        if (await tryPlay(audio, false)) {
          attachGestureUnlock();
          return true;
        }

        attachGestureUnlock();
        return false;
      };

      const onAudioReady = () => {
        if (isStale()) return;
        void attemptAutoplay();
      };

      audio.addEventListener("loadeddata", onAudioReady);
      audio.addEventListener("canplay", onAudioReady);
      audio.addEventListener("canplaythrough", onAudioReady);

      void attemptAutoplay();

      let tries = 0;
      retryTimerRef.current = window.setInterval(() => {
        if (isStale()) {
          clearRetryTimer();
          return;
        }

        tries += 1;
        if (tries > MAX_RETRIES) {
          clearRetryTimer();
          return;
        }

        if (!audio.paused) {
          clearRetryTimer();
          return;
        }

        void attemptAutoplay();
      }, RETRY_MS);

      return () => {
        audio.removeEventListener("loadeddata", onAudioReady);
        audio.removeEventListener("canplay", onAudioReady);
        audio.removeEventListener("canplaythrough", onAudioReady);
      };
    },
    [applyVolume, clearGestureListeners, clearRetryTimer, resetToStart, tryPlay],
  );

  useLayoutEffect(() => {
    const audio = audioRef.current;
    if (!audio || !settings.music_url) return;

    const removeAudioListeners = bootstrapAutoplay(audio);

    return () => {
      removeAudioListeners?.();
      clearGestureListeners();
      clearRetryTimer();
    };
  }, [
    bootstrapAutoplay,
    clearGestureListeners,
    clearRetryTimer,
    settings.music_autoplay,
    settings.music_loop,
    settings.music_url,
  ]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) applyVolume(audio, volume);
  }, [applyVolume, volume]);

  useEffect(() => {
    const unlock = () => {
      const audio = audioRef.current;
      if (!audio || !settingsRef.current.music_autoplay) return;
      void tryPlay(audio, true);
    };

    window.addEventListener("bf-music-unlock", unlock);
    return () => window.removeEventListener("bf-music-unlock", unlock);
  }, [tryPlay]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const syncPlaying = () => setPlaying(!audio.paused);
    audio.addEventListener("play", syncPlaying);
    audio.addEventListener("pause", syncPlaying);
    audio.addEventListener("ended", syncPlaying);

    return () => {
      audio.removeEventListener("play", syncPlaying);
      audio.removeEventListener("pause", syncPlaying);
      audio.removeEventListener("ended", syncPlaying);
    };
  }, [settings.music_url]);

  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted || !audioRef.current || !settingsRef.current.music_autoplay) return;
      bootstrapAutoplay(audioRef.current);
    };

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [bootstrapAutoplay]);

  if (!settings.music_url) return null;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      setPlaying(false);
      return;
    }

    resetToStart(audio);
    applyVolume(audio);
    audio.muted = false;
    setNeedsUnmute(false);
    void audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  };

  return (
    <div
      className="fixed bottom-5 right-5 z-50"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div
        className={`flex items-center rounded-full border border-white/[0.08] bg-[#0a0a0a]/80 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 ease-out ${
          expanded ? "gap-3 px-3 py-2" : "p-1"
        }`}
        style={{
          boxShadow: expanded
            ? `0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px ${playerColor}20`
            : `0 8px 24px rgba(0,0,0,0.45), 0 0 0 1px ${playerColor}12`,
        }}
      >
        <audio
          ref={audioRef}
          src={settings.music_url}
          autoPlay={settings.music_autoplay}
          playsInline
          preload="auto"
        />

        <button
          type="button"
          onClick={toggle}
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95"
          style={{
            backgroundColor: `${playerColor}20`,
            color: playerColor,
            boxShadow: playing ? `0 0 24px ${playerColor}35` : undefined,
          }}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5" aria-hidden>
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
          )}
        </button>

        {expanded && (
          <>
            <div className="min-w-0 max-w-[160px]">
              <p className="truncate text-xs font-medium text-white">{title}</p>
              <p className="text-[10px] text-neutral-500">
                {needsUnmute ? "Tap anywhere for sound" : playing ? "Now playing" : "Paused"}
              </p>
            </div>

            <div className="bf-range-wrap flex items-center pr-1">
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setVolume(v);
                  if (audioRef.current) applyVolume(audioRef.current, v);
                }}
                className={`${rangeClassName} !w-16`}
                style={rangeFillStyle(volume, 0, 100, playerColor)}
                aria-label="Volume"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
