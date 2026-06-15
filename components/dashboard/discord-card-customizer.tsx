"use client";

import { useState } from "react";
import { DiscordStatusCard } from "@/components/profile/public/discord-status-card";
import { labelClassName, ToggleField } from "@/components/dashboard/form-fields";
import {
  getDiscordCardStyleLabel,
  getDiscordCardThemeLabel,
} from "@/lib/discord/card-config";
import { DEFAULT_DISCORD_CARD_CONFIG } from "@/lib/types/discord-widget";
import type {
  DiscordCardConfig,
  DiscordCardRadius,
  DiscordCardStyle,
  DiscordCardTheme,
  DiscordCardWidth,
} from "@/lib/types/discord-widget";
import type { DiscordPresence } from "@/lib/discord/types";
import type { ProfileSettings } from "@/lib/types/settings";

const STYLES: DiscordCardStyle[] = ["discord", "minimal", "compact", "pill"];
const THEMES: DiscordCardTheme[] = ["discord_dark", "glass", "neon", "accent", "midnight"];
const RADII: DiscordCardRadius[] = ["sharp", "soft", "round", "pill"];
const WIDTHS: DiscordCardWidth[] = ["narrow", "default", "wide", "full"];

function ColorField({
  label,
  value,
  fallback,
  onChange,
}: {
  label: string;
  value: string;
  fallback: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className={labelClassName}>{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || fallback}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 cursor-pointer rounded-lg border border-white/[0.08] bg-[#141414]"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Auto (${fallback})`}
          className="min-w-0 flex-1 rounded-lg border border-white/[0.08] bg-[#0f0f0f] px-3 py-2 text-xs text-white placeholder:text-neutral-600"
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="shrink-0 text-[10px] uppercase tracking-wide text-neutral-500 hover:text-white"
          >
            Auto
          </button>
        ) : null}
      </div>
    </div>
  );
}

function ChipGrid<T extends string>({
  options,
  value,
  label,
  getLabel,
  onChange,
  disabled,
}: {
  options: T[];
  value: T;
  label: string;
  getLabel: (option: T) => string;
  onChange: (value: T) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <p className={labelClassName}>{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option)}
            className={`rounded-full border px-3 py-1.5 text-xs transition-colors disabled:opacity-50 ${
              value === option
                ? "border-[#5865F2]/60 bg-[#5865F2]/15 text-white"
                : "border-white/[0.08] bg-[#0f0f0f] text-neutral-400 hover:border-white/15 hover:text-white"
            }`}
          >
            {getLabel(option)}
          </button>
        ))}
      </div>
    </div>
  );
}

export function DiscordCardCustomizer({
  settings,
  config,
  previewPresence,
  disabled,
  onChange,
}: {
  settings: ProfileSettings;
  config: DiscordCardConfig;
  previewPresence: DiscordPresence;
  disabled?: boolean;
  onChange: (config: DiscordCardConfig) => void;
}) {
  const [previewActivity, setPreviewActivity] = useState(true);

  const patch = (partial: Partial<DiscordCardConfig>) => onChange({ ...config, ...partial });

  return (
    <div className="space-y-5">
      <ChipGrid
        label="Layout"
        options={STYLES}
        value={config.style}
        getLabel={getDiscordCardStyleLabel}
        onChange={(style) => patch({ style })}
        disabled={disabled}
      />

      <ChipGrid
        label="Theme"
        options={THEMES}
        value={config.theme}
        getLabel={getDiscordCardThemeLabel}
        onChange={(theme) => patch({ theme })}
        disabled={disabled}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <ColorField
          label="Accent"
          value={config.accent_color}
          fallback={settings.accent_color || "#5865F2"}
          onChange={(accent_color) => patch({ accent_color })}
        />
        <ColorField
          label="Background"
          value={config.background_color}
          fallback="#2b2d31"
          onChange={(background_color) => patch({ background_color })}
        />
        <ColorField
          label="Border"
          value={config.border_color}
          fallback="#1e1f22"
          onChange={(border_color) => patch({ border_color })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClassName}>
            Background opacity — {config.background_opacity}%
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={config.background_opacity}
            onChange={(e) => patch({ background_opacity: Number(e.target.value) })}
            disabled={disabled}
            className="w-full accent-[#5865F2]"
          />
        </div>
        <div>
          <label className={labelClassName}>Border width — {config.border_width}px</label>
          <input
            type="range"
            min={0}
            max={3}
            value={config.border_width}
            onChange={(e) => patch({ border_width: Number(e.target.value) })}
            disabled={disabled}
            className="w-full accent-[#5865F2]"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ChipGrid
          label="Corner radius"
          options={RADII}
          value={config.border_radius}
          getLabel={(r) => r.charAt(0).toUpperCase() + r.slice(1)}
          onChange={(border_radius) => patch({ border_radius })}
          disabled={disabled}
        />
        <ChipGrid
          label="Card width"
          options={WIDTHS}
          value={config.card_width}
          getLabel={(w) => (w === "default" ? "Default" : w.charAt(0).toUpperCase() + w.slice(1))}
          onChange={(card_width) => patch({ card_width })}
          disabled={disabled}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <ToggleField
          key={`avatar-${String(config.show_avatar)}`}
          name="discord_show_avatar"
          label="Show avatar"
          description="Display your Discord profile picture."
          defaultChecked={config.show_avatar}
          onCheckedChange={(show_avatar) => patch({ show_avatar })}
        />
        <ToggleField
          key={`status-${String(config.show_status_text)}`}
          name="discord_show_status"
          label="Show status text"
          description="Online, idle, DND, or offline label."
          defaultChecked={config.show_status_text}
          onCheckedChange={(show_status_text) => patch({ show_status_text })}
        />
        <ToggleField
          key={`activity-${String(config.show_activity)}`}
          name="discord_show_activity"
          label="Show activity"
          description="Games, Spotify, and custom status blocks."
          defaultChecked={config.show_activity}
          onCheckedChange={(show_activity) => patch({ show_activity })}
        />
        <ToggleField
          key={`hint-${String(config.show_lanyard_hint)}`}
          name="discord_show_lanyard_hint"
          label="Show Lanyard setup hint"
          description="Small note when offline with no activity."
          defaultChecked={config.show_lanyard_hint}
          onCheckedChange={(show_lanyard_hint) => patch({ show_lanyard_hint })}
        />
        <ToggleField
          key={`glow-${String(config.glow)}`}
          name="discord_glow"
          label="Accent glow"
          description="Soft outer glow using your accent color."
          defaultChecked={config.glow}
          onCheckedChange={(glow) => patch({ glow })}
        />
        <ToggleField
          key={`blur-${String(config.backdrop_blur)}`}
          name="discord_blur"
          label="Backdrop blur"
          description="Frosted glass effect behind the card."
          defaultChecked={config.backdrop_blur}
          onCheckedChange={(backdrop_blur) => patch({ backdrop_blur })}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange({ ...DEFAULT_DISCORD_CARD_CONFIG })}
          className="text-xs text-neutral-500 hover:text-white disabled:opacity-50"
        >
          Reset to defaults
        </button>
        <label className="flex cursor-pointer items-center gap-2 text-xs text-neutral-400">
          <input
            type="checkbox"
            checked={previewActivity}
            onChange={(e) => setPreviewActivity(e.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-[#090909] accent-[#5865F2]"
          />
          Preview sample activity
        </label>
      </div>

      <div className="rounded-lg border border-white/[0.06] bg-[#0a0a0a] p-4">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
          Preview
        </p>
        <DiscordStatusCard
          presence={previewPresence}
          settings={settings}
          config={config}
          live={false}
          previewActivity={previewActivity}
        />
      </div>
    </div>
  );
}
