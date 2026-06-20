import { ogBackgroundCss } from "@/lib/og/resolve-background";
import type { OgProfileSnapshot } from "@/lib/og/types";
import { SITE_HOST } from "@/lib/site";

function formatCount(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return value.toLocaleString("en-US");
}

function BrandMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M16 3C16 3 7 14.5 7 20.5C7 25.194 10.806 29 16 29C21.194 29 25 25.194 25 20.5C25 14.5 16 3 16 3Z"
        fill="#fafafa"
      />
    </svg>
  );
}

function DefaultAvatar({ name, accent }: { name: string; accent: string }) {
  const initial = (name.trim().charAt(0) || "?").toUpperCase();
  return (
    <div
      style={{
        width: 112,
        height: 112,
        borderRadius: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(145deg, ${accent}, #090909)`,
        color: "#fafafa",
        fontSize: 42,
        fontWeight: 700,
        border: "4px solid rgba(255,255,255,0.18)",
      }}
    >
      <span>{initial}</span>
    </div>
  );
}

export function DefaultOgCard() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(145deg, #111111 0%, #090909 55%, #050505 100%)",
        color: "#fafafa",
        fontFamily: "Inter",
      }}
    >
      <BrandMark size={72} />
      <div style={{ display: "flex", marginTop: 28, fontSize: 56, fontWeight: 700, letterSpacing: "-0.03em" }}>
        <span>cried.bio</span>
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 14,
          fontSize: 28,
          color: "rgba(250,250,250,0.72)",
        }}
      >
        <span>Your bio link, your way</span>
      </div>
    </div>
  );
}

export function OgProfileCard({ profile }: { profile: OgProfileSnapshot }) {
  const backgroundCss = ogBackgroundCss(profile.background);
  const cardBg = `rgba(9, 9, 9, ${profile.cardOpacity / 100})`;
  const stats: string[] = [`${formatCount(profile.followers)} followers`];
  if (profile.showViews && profile.views != null) {
    stats.push(`${formatCount(profile.views)} views`);
  }

  const visibleBadges = profile.badges.slice(0, 6);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: backgroundCss,
        fontFamily: "Inter",
        color: profile.textColor,
      }}
    >
      {profile.background.kind === "image" ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.background.url}
            alt=""
            width={1200}
            height={630}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              background: "linear-gradient(135deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 100%)",
            }}
          />
        </div>
      ) : null}

      <div
        style={{
          position: "relative",
          display: "flex",
          flex: 1,
          alignItems: "center",
          padding: "56px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 920,
            padding: "34px 38px",
            borderRadius: 28,
            background: cardBg,
            border: `2px solid ${profile.accentColor}`,
            boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt=""
                width={112}
                height={112}
                style={{
                  width: 112,
                  height: 112,
                  borderRadius: 9999,
                  objectFit: "cover",
                  border: `4px solid ${profile.accentColor}`,
                }}
              />
            ) : (
              <DefaultAvatar name={profile.displayName} accent={profile.accentColor} />
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  fontSize: 48,
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                }}
              >
                <span>{profile.displayName}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 26,
                  color: "rgba(250,250,250,0.62)",
                }}
              >
                <span>
                  {SITE_HOST}/{profile.username}
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 28,
              lineHeight: 1.45,
              color: "rgba(250,250,250,0.84)",
              maxHeight: 120,
              overflow: "hidden",
            }}
          >
            <span>{profile.bio}</span>
          </div>

          {visibleBadges.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "row", gap: 10, marginTop: 22 }}>
              {visibleBadges.map((badge) => (
                <div
                  key={badge.slug}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 14px",
                    borderRadius: 9999,
                    background: "rgba(255,255,255,0.06)",
                    border: `1px solid ${badge.color}`,
                    color: profile.textColor,
                    fontSize: 20,
                    fontWeight: 600,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: 12,
                      height: 12,
                      borderRadius: 9999,
                      background: badge.color,
                    }}
                  />
                  <span>{badge.name}</span>
                </div>
              ))}
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              gap: 18,
              marginTop: 24,
              fontSize: 22,
              color: "rgba(250,250,250,0.58)",
            }}
          >
            {stats.map((stat) => (
              <div key={stat} style={{ display: "flex" }}>
                <span>{stat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 40,
          bottom: 34,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 16px",
          borderRadius: 9999,
          background: "rgba(0,0,0,0.42)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#fafafa",
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        <BrandMark size={20} />
        <span>cried.bio</span>
      </div>
    </div>
  );
}
