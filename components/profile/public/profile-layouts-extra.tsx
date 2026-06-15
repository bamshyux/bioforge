"use client";

import { BadgeRow } from "@/components/badges/badge-ui";
import { TypingBio } from "./profile-effects";
import {
  ProfileAvatar,
  ProfileHandle,
  ProfileMainContent,
  ProfileMeta,
  Username,
  bannerTopRadius,
  buildCardStyle,
  getDisplayName,
  getLayoutBadges,
  getUsernameEffectClass,
  type LayoutProps,
} from "./layout-primitives";

function VaporwaveLayout(props: LayoutProps) {
  const { profile, settings, badges, viewCount } = props;
  const displayName = getDisplayName(profile);
  const { displayBadges, styleOptions } = getLayoutBadges(badges, settings);

  return (
    <div className="bf-layout-vaporwave w-full overflow-hidden" style={buildCardStyle(settings)}>
      <div
        className="relative px-6 py-8"
        style={{
          background: `linear-gradient(180deg, ${settings.accent_color}22 0%, transparent 55%), repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 40px)`,
        }}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#ff71ce]">Ａｅｓｔｈｅｔｉｃ</p>
        <div className="-skew-x-6 mt-3 bf-profile-name-row">
          <h1 className="text-4xl font-black italic tracking-tight text-white sm:text-5xl">{displayName}</h1>
          <BadgeRow badges={displayBadges} compact styleOptions={styleOptions} />
        </div>
        <ProfileHandle profile={profile} className="mt-2 skew-x-6" />
      </div>
      <div className="h-1 bg-gradient-to-r from-[#ff71ce] via-[#01cdfe] to-[#05ffa1]" />
      <div className="px-6 py-6">
        <ProfileMeta profile={profile} settings={settings} viewCount={viewCount} />
        <ProfileMainContent {...props} />
      </div>
    </div>
  );
}

function BrutalistLayout(props: LayoutProps) {
  const { profile, settings, badges, viewCount } = props;
  const displayName = getDisplayName(profile);
  const { displayBadges, styleOptions } = getLayoutBadges(badges, settings);

  return (
    <div
      className="w-full border-4 border-white bg-[#090909] p-0"
      style={{ borderRadius: Math.min(settings.border_radius, 4) }}
    >
      <div className="border-b-4 border-white px-6 py-8">
        <h1 className="text-5xl font-black uppercase leading-[0.85] tracking-tighter text-white sm:text-6xl">{displayName}</h1>
        <ProfileHandle profile={profile} className="mt-3 text-white/60" />
        <BadgeRow badges={displayBadges} compact styleOptions={styleOptions} />
      </div>
      <div className="px-6 py-6">
        <ProfileMeta profile={profile} settings={settings} viewCount={viewCount} />
        <ProfileMainContent {...props} />
      </div>
    </div>
  );
}

function NewspaperLayout(props: LayoutProps) {
  const { profile, settings, badges, viewCount } = props;
  const displayName = getDisplayName(profile);
  const { displayBadges, styleOptions } = getLayoutBadges(badges, settings);
  const date = new Date(profile.created_at).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="w-full border border-white/20 bg-[#0c0c0c] p-6 sm:p-8" style={{ borderRadius: settings.border_radius }}>
      <div className="border-b-2 border-white pb-3">
        <p className="text-center text-[10px] uppercase tracking-[0.35em] text-neutral-500">The Daily Profile · {date}</p>
        <h1 className="mt-3 text-center font-serif text-4xl font-bold leading-tight text-white sm:text-5xl">{displayName}</h1>
        <ProfileHandle profile={profile} className="mt-2 text-center" />
        <BadgeRow badges={displayBadges} compact styleOptions={styleOptions} />
      </div>
      <div className="mt-6 columns-1 gap-8 sm:columns-2">
        <ProfileMeta profile={profile} settings={settings} viewCount={viewCount} />
        {profile.bio && (
          <p className="mb-4 text-sm leading-relaxed text-neutral-300 first-letter:float-left first-letter:mr-2 first-letter:text-4xl first-letter:font-serif first-letter:leading-none">
            <TypingBio text={profile.bio} enabled={settings.typing_bio} />
          </p>
        )}
      </div>
      <div className="mt-4 border-t border-white/10 pt-6">
        <ProfileMainContent {...props} hideBio />
      </div>
    </div>
  );
}

function TicketLayout(props: LayoutProps) {
  const { profile, settings, badges, viewCount } = props;
  const displayName = getDisplayName(profile);
  const { displayBadges, styleOptions } = getLayoutBadges(badges, settings);

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden" style={buildCardStyle(settings)}>
      <div className="flex">
        <div className="flex flex-1 flex-col p-6">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-neutral-500">Admit One</p>
          <h1 className="mt-2 text-2xl font-bold text-white">{displayName}</h1>
          <ProfileHandle profile={profile} className="mt-1" />
          <BadgeRow badges={displayBadges} compact styleOptions={styleOptions} />
          <ProfileMeta profile={profile} settings={settings} viewCount={viewCount} className="mb-0 mt-4" />
        </div>
        <div className="relative w-16 shrink-0 border-l border-dashed border-white/20 bg-[#0f0f0f]">
          <div className="absolute -left-2 top-6 h-4 w-4 rounded-full bg-[#090909]" />
          <div className="absolute -left-2 bottom-6 h-4 w-4 rounded-full bg-[#090909]" />
          <div className="flex h-full rotate-180 items-center justify-center [writing-mode:vertical-rl]">
            <span className="text-[9px] font-mono tracking-widest text-neutral-600">#{profile.uid ?? "0000"}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-dashed border-white/15 px-6 py-5">
        <ProfileMainContent {...props} hideBio />
      </div>
    </div>
  );
}

function VinylLayout(props: LayoutProps) {
  const { profile, settings, badges, viewCount } = props;
  const displayName = getDisplayName(profile);
  const { displayBadges, styleOptions } = getLayoutBadges(badges, settings);
  const coverStyle = profile.banner_url
    ? { backgroundImage: `url(${profile.banner_url})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: `linear-gradient(135deg, ${settings.gradient_colors.join(", ")})` };

  return (
    <div className="w-full p-6" style={buildCardStyle(settings)}>
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="relative mx-auto aspect-square w-full max-w-[220px] shrink-0 sm:mx-0" style={coverStyle}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 rounded-full border-4 border-black/30 bg-black/40 backdrop-blur-sm" />
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <p className="truncate text-xs font-bold uppercase text-white drop-shadow">{displayName}</p>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">Side A</p>
          <div className="bf-profile-name-row mt-1">
            <Username name={displayName} settings={settings} profile={profile} />
            <BadgeRow badges={displayBadges} compact styleOptions={styleOptions} />
          </div>
          <ProfileHandle profile={profile} className="mt-1" />
          <ProfileMeta profile={profile} settings={settings} viewCount={viewCount} />
          <ProfileMainContent {...props} />
        </div>
      </div>
    </div>
  );
}

function DiscordLayout(props: LayoutProps) {
  const { profile, settings, badges, viewCount } = props;
  const displayName = getDisplayName(profile);
  const { displayBadges, styleOptions } = getLayoutBadges(badges, settings);
  const bannerStyle = profile.banner_url
    ? { backgroundImage: `url(${profile.banner_url})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: settings.accent_color };

  return (
    <div className="w-full overflow-hidden" style={buildCardStyle(settings)}>
      <div className="relative h-28 sm:h-32" style={bannerStyle}>
        <div className="absolute inset-0 bg-black/20" />
      </div>
      <div className="relative px-5 pb-6">
        <div className="-mt-10 mb-3 bf-profile-avatar-row flex items-end gap-3">
          <div className="relative">
            <ProfileAvatar profile={profile} displayName={displayName} accentColor={settings.accent_color} className="h-20 w-20 ring-4 ring-[#141414]" />
            <span className="absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full border-[3px] border-[#141414] bg-emerald-500" />
          </div>
          <div className="pb-1">
            <div className="bf-profile-name-row">
              <h1 className="text-xl font-bold text-white">{displayName}</h1>
              <BadgeRow badges={displayBadges} compact styleOptions={styleOptions} />
            </div>
            <ProfileHandle profile={profile} />
          </div>
        </div>
        {profile.bio && (
          <div className="mb-4 rounded-lg bg-[#0f0f0f] px-3 py-2 text-sm text-neutral-300">
            <TypingBio text={profile.bio} enabled={settings.typing_bio} />
          </div>
        )}
        <ProfileMeta profile={profile} settings={settings} viewCount={viewCount} />
        <ProfileMainContent {...props} hideBio />
      </div>
    </div>
  );
}

function TwitchLayout(props: LayoutProps) {
  const { profile, settings, badges, viewCount } = props;
  const displayName = getDisplayName(profile);
  const { displayBadges, styleOptions } = getLayoutBadges(badges, settings);

  return (
    <div className="w-full overflow-hidden" style={buildCardStyle(settings)}>
      <div className="flex items-center gap-2 bg-[#9146ff]/20 px-4 py-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#bf94ff]">Live</span>
      </div>
      <div className="flex gap-4 p-5 bf-profile-avatar-row">
        <ProfileAvatar profile={profile} displayName={displayName} accentColor="#9146ff" className="h-16 w-16 shrink-0" />
        <div>
          <div className="bf-profile-name-row">
            <h1 className="text-xl font-bold text-white">{displayName}</h1>
            <BadgeRow badges={displayBadges} compact styleOptions={styleOptions} />
          </div>
          <ProfileHandle profile={profile} className="text-[#adadb8]" />
          <ProfileMeta profile={profile} settings={settings} viewCount={viewCount} className="mb-0 mt-2" />
        </div>
      </div>
      <div className="border-t border-[#9146ff]/20 px-5 py-5">
        <ProfileMainContent {...props} />
      </div>
    </div>
  );
}

function IdcardLayout(props: LayoutProps) {
  const { profile, settings, badges, viewCount } = props;
  const displayName = getDisplayName(profile);
  const { displayBadges, styleOptions } = getLayoutBadges(badges, settings);

  return (
    <div
      className="mx-auto w-full max-w-lg overflow-hidden border border-white/10"
      style={{ ...buildCardStyle(settings), borderRadius: Math.max(settings.border_radius, 8) }}
    >
      <div className="flex gap-4 p-5">
        <ProfileAvatar profile={profile} displayName={displayName} accentColor={settings.accent_color} className="h-24 w-20 shrink-0" rounded="rounded-md" />
        <div className="min-w-0 flex-1 font-mono text-xs">
          <p className="text-[9px] uppercase tracking-widest text-neutral-500">Official ID</p>
          <h1 className="mt-1 text-lg font-bold text-white">{displayName}</h1>
          <ProfileHandle profile={profile} className="font-sans" />
          <BadgeRow badges={displayBadges} compact styleOptions={styleOptions} />
          <ProfileMeta profile={profile} settings={settings} viewCount={viewCount} className="mb-0 mt-2 font-sans" />
        </div>
      </div>
      <div className="flex h-8 items-end gap-px bg-[#0a0a0a] px-5 pb-2">
        {Array.from({ length: 32 }).map((_, i) => (
          <div key={i} className="w-px bg-white/30" style={{ height: `${8 + (i % 5) * 4}px` }} />
        ))}
      </div>
      <div className="px-5 py-5">
        <ProfileMainContent {...props} hideBio />
      </div>
    </div>
  );
}

function BlueprintLayout(props: LayoutProps) {
  const { profile, settings, badges, viewCount } = props;
  const displayName = getDisplayName(profile);
  const { displayBadges, styleOptions } = getLayoutBadges(badges, settings);

  return (
    <div
      className="bf-layout-blueprint w-full border border-[#4a9eff]/40 p-6 font-mono text-[#b8d4ff]"
      style={{
        borderRadius: settings.border_radius,
        background: "#0a1628",
        backgroundImage: "linear-gradient(rgba(74,158,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(74,158,255,0.08) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <p className="text-[9px] uppercase tracking-[0.3em] text-[#4a9eff]">Rev. {profile.uid ?? "001"} · cried.bio</p>
      <div className="mt-4 flex flex-wrap items-start gap-4 bf-profile-avatar-row">
        <ProfileAvatar profile={profile} displayName={displayName} accentColor="#4a9eff" className="h-16 w-16 shrink-0" />
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wide text-white">{displayName}</h1>
          <ProfileHandle profile={profile} className="text-[#4a9eff]/70" />
          <BadgeRow badges={displayBadges} compact styleOptions={styleOptions} />
        </div>
      </div>
      <div className="mt-5 border border-dashed border-[#4a9eff]/30 p-4">
        <ProfileMeta profile={profile} settings={settings} viewCount={viewCount} />
        <ProfileMainContent {...props} />
      </div>
    </div>
  );
}

function ComicLayout(props: LayoutProps) {
  const { profile, settings, badges, viewCount } = props;
  const displayName = getDisplayName(profile);
  const { displayBadges, styleOptions } = getLayoutBadges(badges, settings);

  return (
    <div className="w-full border-4 border-white bg-[#fef08a] p-1 text-black" style={{ borderRadius: settings.border_radius }}>
      <div className="border-2 border-black bg-white p-5">
        <div className="flex flex-wrap items-start gap-4 bf-profile-avatar-row">
          <ProfileAvatar profile={profile} displayName={displayName} accentColor={settings.accent_color} className="h-20 w-20 shrink-0 ring-2 ring-black" />
          <div>
            <h1 className="text-3xl font-black uppercase italic leading-none text-black">{displayName}!</h1>
            <ProfileHandle profile={profile} className="text-neutral-600" />
            <BadgeRow badges={displayBadges} compact styleOptions={styleOptions} />
          </div>
        </div>
        {profile.bio && (
          <div className="relative mt-5 rounded-2xl border-2 border-black bg-white px-4 py-3 after:absolute after:-bottom-2 after:left-8 after:h-4 after:w-4 after:rotate-45 after:border-b-2 after:border-r-2 after:border-black after:bg-white">
            <p className="text-sm font-medium text-black">
              <TypingBio text={profile.bio} enabled={settings.typing_bio} />
            </p>
          </div>
        )}
        <div className="mt-6 border-t-2 border-dashed border-black/20 pt-5 text-black [&_*]:text-inherit">
          <ProfileMeta profile={profile} settings={settings} viewCount={viewCount} />
          <ProfileMainContent {...props} hideBio />
        </div>
      </div>
    </div>
  );
}

function CyberpunkLayout(props: LayoutProps) {
  const { profile, settings, badges, viewCount } = props;
  const displayName = getDisplayName(profile);
  const { displayBadges, styleOptions } = getLayoutBadges(badges, settings);

  return (
    <div className="bf-layout-cyberpunk relative w-full overflow-hidden p-6" style={buildCardStyle(settings)}>
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] bf-cyber-scanlines" />
      <div className="relative">
        <div className="flex items-start gap-1">
          <div className="h-8 w-1 shrink-0" style={{ background: settings.accent_color }} />
          <div>
            <p className="text-[9px] font-mono uppercase tracking-[0.4em] text-neutral-500">// netrunner</p>
            <h1
              className={`mt-1 text-3xl font-black uppercase tracking-tight ${getUsernameEffectClass(settings.username_effect)}`}
              style={{ color: settings.accent_color, textShadow: `0 0 20px ${settings.accent_color}80` }}
            >
              {displayName}
            </h1>
            <ProfileHandle profile={profile} className="font-mono" />
            <BadgeRow badges={displayBadges} compact styleOptions={styleOptions} />
          </div>
        </div>
        <ProfileMeta profile={profile} settings={settings} viewCount={viewCount} />
        <ProfileMainContent {...props} />
      </div>
    </div>
  );
}

function LuxuryLayout(props: LayoutProps) {
  const { profile, settings, badges, viewCount } = props;
  const displayName = getDisplayName(profile);
  const { displayBadges, styleOptions } = getLayoutBadges(badges, settings);

  return (
    <div className="w-full px-8 py-10 text-center" style={buildCardStyle(settings)}>
      <div className="mx-auto mb-6 h-px w-16" style={{ background: `linear-gradient(90deg, transparent, ${settings.accent_color}, transparent)` }} />
      <p className="text-[10px] font-medium uppercase tracking-[0.45em] text-neutral-500">Curated Profile</p>
      <div className="bf-profile-avatar-row mt-6 flex justify-center">
        <ProfileAvatar profile={profile} displayName={displayName} accentColor={settings.accent_color} className="h-20 w-20" />
      </div>
      <div className="bf-profile-name-row mt-5">
        <h1 className="font-serif text-3xl font-light tracking-wide text-white sm:text-4xl">{displayName}</h1>
        <BadgeRow badges={displayBadges} compact styleOptions={styleOptions} />
      </div>
      <ProfileHandle profile={profile} className="mt-2" />
      <div className="mx-auto mb-6 mt-6 h-px w-24 bg-white/10" />
      <ProfileMeta profile={profile} settings={settings} viewCount={viewCount} className="justify-center" />
      <div className="bf-profile-block mx-auto mt-2 max-w-md text-left">
        <ProfileMainContent {...props} />
      </div>
    </div>
  );
}

function ReceiptLayout(props: LayoutProps) {
  const { profile, settings, badges, viewCount } = props;
  const displayName = getDisplayName(profile);
  const { displayBadges, styleOptions } = getLayoutBadges(badges, settings);
  const now = new Date().toLocaleString();

  return (
    <div className="mx-auto w-full max-w-xs bg-[#f5f0e6] px-5 py-6 font-mono text-[11px] text-[#1a1a1a] shadow-xl" style={{ borderRadius: 2 }}>
      <p className="text-center text-[10px] uppercase">cried.bio</p>
      <p className="mt-1 text-center text-[9px] text-neutral-500">{now}</p>
      <div className="my-3 border-t border-dashed border-neutral-400" />
      <p className="font-bold uppercase">{displayName}</p>
      <ProfileHandle profile={profile} className="text-neutral-600" />
      <BadgeRow badges={displayBadges} compact styleOptions={styleOptions} />
      <div className="my-3 border-t border-dashed border-neutral-400" />
      <ProfileMeta profile={profile} settings={settings} viewCount={viewCount} className="mb-3 text-neutral-600" />
      <div className="text-neutral-800 [&_*]:text-inherit">
        <ProfileMainContent {...props} />
      </div>
      <div className="my-3 border-t border-dashed border-neutral-400" />
      <p className="text-center text-[9px] uppercase">Thank you for visiting</p>
    </div>
  );
}

function ZineLayout(props: LayoutProps) {
  const { profile, settings, badges, viewCount } = props;
  const displayName = getDisplayName(profile);
  const { displayBadges, styleOptions } = getLayoutBadges(badges, settings);

  return (
    <div className="relative w-full rotate-[0.5deg] px-6 py-8" style={{ ...buildCardStyle(settings), background: "#141414" }}>
      <div className="absolute -right-2 top-8 h-12 w-6 rotate-12 bg-white/10 opacity-60" />
      <p className="text-xs font-bold uppercase tracking-widest text-[#fafafa]">Issue #{profile.uid ?? "01"}</p>
      <h1 className="mt-2 text-4xl font-black uppercase leading-none text-white mix-blend-difference">{displayName}</h1>
      <ProfileHandle profile={profile} className="mt-2" />
      <BadgeRow badges={displayBadges} compact styleOptions={styleOptions} />
      <div className="mt-4 inline-block -rotate-1 border-2 border-white px-3 py-1 text-xs font-bold uppercase text-white">Featured</div>
      <ProfileMeta profile={profile} settings={settings} viewCount={viewCount} />
      <ProfileMainContent {...props} />
    </div>
  );
}

function OrbitLayout(props: LayoutProps) {
  const { profile, settings, badges, viewCount } = props;
  const displayName = getDisplayName(profile);
  const { displayBadges, styleOptions } = getLayoutBadges(badges, settings);

  return (
    <div className="w-full px-6 py-12 text-center" style={buildCardStyle(settings)}>
      <div className="bf-profile-avatar-row relative mx-auto mb-8 flex h-44 w-44 items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-dashed border-white/10 bf-orbit-spin" />
        <div className="absolute inset-4 rounded-full border border-white/5" style={{ borderColor: `${settings.accent_color}40` }} />
        <ProfileAvatar profile={profile} displayName={displayName} accentColor={settings.accent_color} className="relative h-24 w-24" />
      </div>
      <div className="bf-profile-name-row">
        <Username name={displayName} settings={settings} profile={profile} />
        <BadgeRow badges={displayBadges} compact styleOptions={styleOptions} />
      </div>
      <ProfileHandle profile={profile} className="mt-1" />
      <ProfileMeta profile={profile} settings={settings} viewCount={viewCount} className="justify-center" />
      <div className="bf-profile-block mx-auto mt-2 max-w-md text-left">
        <ProfileMainContent {...props} />
      </div>
    </div>
  );
}

function WaveLayout(props: LayoutProps) {
  const { profile, settings, badges, viewCount } = props;
  const displayName = getDisplayName(profile);
  const { displayBadges, styleOptions } = getLayoutBadges(badges, settings);
  const headerStyle = profile.banner_url
    ? { backgroundImage: `url(${profile.banner_url})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: `linear-gradient(135deg, ${settings.gradient_colors.join(", ")})` };

  return (
    <div className="w-full overflow-hidden" style={buildCardStyle(settings)}>
      <div className="relative px-6 pb-12 pt-8" style={headerStyle}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative bf-profile-name-row">
          <h1 className="text-3xl font-bold text-white">{displayName}</h1>
          <BadgeRow badges={displayBadges} compact styleOptions={styleOptions} />
        </div>
        <ProfileHandle profile={profile} className="relative mt-1 text-neutral-300" />
        <svg className="absolute -bottom-px left-0 w-full text-[#141414]" viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden>
          <path d="M0,40 C300,100 900,0 1200,50 L1200,80 L0,80 Z" fill="currentColor" />
        </svg>
      </div>
      <div className="px-6 py-6">
        <ProfileMeta profile={profile} settings={settings} viewCount={viewCount} />
        <ProfileMainContent {...props} />
      </div>
    </div>
  );
}

function MosaicLayout(props: LayoutProps) {
  const { profile, settings, badges, viewCount } = props;
  const displayName = getDisplayName(profile);
  const { displayBadges, styleOptions } = getLayoutBadges(badges, settings);
  const colors = settings.gradient_colors.length >= 4 ? settings.gradient_colors : [...settings.gradient_colors, settings.accent_color, "#1a1a1a"];

  return (
    <div className="w-full overflow-hidden" style={buildCardStyle(settings)}>
      <div className="relative">
        <div className="grid grid-cols-6 grid-rows-2 gap-0.5 p-0.5">
          {colors.slice(0, 12).map((color, i) => (
            <div key={i} className="aspect-square" style={{ background: color, opacity: i === 5 ? 0 : 1 }} />
          ))}
        </div>
        <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center bf-profile-avatar-row">
          <ProfileAvatar profile={profile} displayName={displayName} accentColor={settings.accent_color} className="h-20 w-20 ring-4 ring-[#141414]" />
        </div>
      </div>
      <div className="relative px-6 py-6 pt-14">
        <div className="bf-profile-name-row">
          <Username name={displayName} settings={settings} profile={profile} />
          <BadgeRow badges={displayBadges} compact styleOptions={styleOptions} />
        </div>
        <ProfileHandle profile={profile} className="mt-1" />
        <ProfileMeta profile={profile} settings={settings} viewCount={viewCount} />
        <ProfileMainContent {...props} />
      </div>
    </div>
  );
}

function AuroraLayout(props: LayoutProps) {
  const { profile, settings, badges, viewCount } = props;
  const displayName = getDisplayName(profile);
  const { displayBadges, styleOptions } = getLayoutBadges(badges, settings);

  return (
    <div className="w-full overflow-hidden" style={buildCardStyle(settings)}>
      <div className="bf-layout-aurora relative px-6 py-10">
        <div className="bf-profile-avatar-row mb-4 flex justify-center">
          <ProfileAvatar profile={profile} displayName={displayName} accentColor={settings.accent_color} className="h-20 w-20" />
        </div>
        <div className="bf-profile-name-row text-center">
          <Username name={displayName} settings={settings} profile={profile} />
          <BadgeRow badges={displayBadges} compact styleOptions={styleOptions} />
        </div>
        <ProfileHandle profile={profile} className="mt-1 text-center" />
      </div>
      <div className="px-6 pb-8">
        <ProfileMeta profile={profile} settings={settings} viewCount={viewCount} />
        <ProfileMainContent {...props} />
      </div>
    </div>
  );
}

function HologramLayout(props: LayoutProps) {
  const { profile, settings, badges, viewCount } = props;
  const displayName = getDisplayName(profile);
  const { displayBadges, styleOptions } = getLayoutBadges(badges, settings);

  return (
    <div className="bf-layout-hologram w-full overflow-hidden p-[2px]" style={{ borderRadius: settings.border_radius }}>
      <div className="bg-[#0a0a0a]/95 px-6 py-8" style={{ borderRadius: Math.max(settings.border_radius - 2, 0) }}>
        <div className="bf-profile-avatar-row mb-4 flex justify-center">
          <ProfileAvatar profile={profile} displayName={displayName} accentColor={settings.accent_color} className="h-24 w-24" />
        </div>
        <div className="bf-profile-name-row text-center">
          <h1 className="bg-gradient-to-r from-[#ff71ce] via-[#01cdfe] to-[#05ffa1] bg-clip-text text-3xl font-bold text-transparent">{displayName}</h1>
          <BadgeRow badges={displayBadges} compact styleOptions={styleOptions} />
        </div>
        <ProfileHandle profile={profile} className="mt-1 text-center" />
        <ProfileMeta profile={profile} settings={settings} viewCount={viewCount} className="justify-center" />
        <ProfileMainContent {...props} />
      </div>
    </div>
  );
}

function SpotifyLayout(props: LayoutProps) {
  const { profile, settings, badges, viewCount } = props;
  const displayName = getDisplayName(profile);
  const { displayBadges, styleOptions } = getLayoutBadges(badges, settings);
  const heroStyle = profile.banner_url
    ? { backgroundImage: `linear-gradient(to bottom, transparent 0%, #141414 100%), url(${profile.banner_url})`, backgroundSize: "cover", backgroundPosition: "center top" }
    : { background: `linear-gradient(to bottom, ${settings.accent_color}55 0%, #141414 70%)` };

  return (
    <div className="w-full overflow-hidden" style={buildCardStyle(settings)}>
      <div className="relative px-6 pb-8 pt-16" style={heroStyle}>
        <div className="bf-profile-avatar-row absolute bottom-4 left-6">
          <ProfileAvatar profile={profile} displayName={displayName} accentColor={settings.accent_color} className="h-36 w-36 shadow-2xl ring-4 ring-[#141414] sm:h-44 sm:w-44" />
        </div>
      </div>
      <div className="px-6 pb-8 pt-4">
        <div className="bf-profile-name-row">
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">{displayName}</h1>
          <BadgeRow badges={displayBadges} compact styleOptions={styleOptions} />
        </div>
        <ProfileHandle profile={profile} className="mt-2 text-neutral-400" />
        <ProfileMeta profile={profile} settings={settings} viewCount={viewCount} />
        <ProfileMainContent {...props} />
      </div>
    </div>
  );
}

function SpotlightLayout(props: LayoutProps) {
  const { profile, settings, badges, viewCount } = props;
  const displayName = getDisplayName(profile);
  const { displayBadges, styleOptions } = getLayoutBadges(badges, settings);

  return (
    <div className="relative w-full overflow-hidden bg-black px-6 py-16" style={{ borderRadius: settings.border_radius }}>
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: `radial-gradient(circle, ${settings.accent_color}, transparent 70%)` }}
      />
      <div className="relative text-center">
        <div className="bf-profile-avatar-row mb-6 flex justify-center">
          <ProfileAvatar profile={profile} displayName={displayName} accentColor={settings.accent_color} className="h-28 w-28" />
        </div>
        <div className="bf-profile-name-row">
          <Username name={displayName} settings={settings} profile={profile} />
          <BadgeRow badges={displayBadges} compact styleOptions={styleOptions} />
        </div>
        <ProfileHandle profile={profile} className="mt-1" />
        <ProfileMeta profile={profile} settings={settings} viewCount={viewCount} className="justify-center" />
        <div className="bf-profile-block mx-auto mt-4 max-w-md text-left">
          <ProfileMainContent {...props} />
        </div>
      </div>
    </div>
  );
}

export const EXTENDED_LAYOUTS = {
  vaporwave: VaporwaveLayout,
  brutalist: BrutalistLayout,
  newspaper: NewspaperLayout,
  ticket: TicketLayout,
  vinyl: VinylLayout,
  discord: DiscordLayout,
  twitch: TwitchLayout,
  idcard: IdcardLayout,
  blueprint: BlueprintLayout,
  comic: ComicLayout,
  cyberpunk: CyberpunkLayout,
  luxury: LuxuryLayout,
  receipt: ReceiptLayout,
  zine: ZineLayout,
  orbit: OrbitLayout,
  wave: WaveLayout,
  mosaic: MosaicLayout,
  aurora: AuroraLayout,
  hologram: HologramLayout,
  spotify: SpotifyLayout,
  spotlight: SpotlightLayout,
} as const;
