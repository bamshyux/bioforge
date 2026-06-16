"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  IconAnalytics,
  IconBackground,
  IconBadges,
  IconCustomize,
  IconEffects,
  IconLayout,
  IconLinks,
  IconMusic,
  IconOverview,
  IconProfile,
  IconSettings,
} from "@/components/icons/dashboard-icons";

type NavItem = {
  href: string;
  label: string;
  Icon: ComponentType<{ size?: number; className?: string }>;
};

type NavGroup = {
  id: string;
  label: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    id: "design",
    label: "Design",
    items: [
      { href: "/dashboard/profile", label: "Profile", Icon: IconProfile },
      { href: "/dashboard/customize", label: "Customize", Icon: IconCustomize },
      { href: "/dashboard/background", label: "Background", Icon: IconBackground },
      { href: "/dashboard/themes", label: "Layouts", Icon: IconLayout },
      { href: "/dashboard/custom-theme", label: "Custom Theme", Icon: IconEffects },
      { href: "/dashboard/effects", label: "Effects", Icon: IconEffects },
    ],
  },
  {
    id: "content",
    label: "Content",
    items: [
      { href: "/dashboard/links", label: "Links", Icon: IconLinks },
      { href: "/dashboard/embeds", label: "Embeds", Icon: IconLayout },
      { href: "/dashboard/widgets", label: "Widgets", Icon: IconEffects },
      { href: "/dashboard/featured", label: "Featured", Icon: IconBadges },
      { href: "/dashboard/music", label: "Music", Icon: IconMusic },
      { href: "/dashboard/guestbook", label: "Guestbook", Icon: IconProfile },
    ],
  },
  {
    id: "grow",
    label: "Grow",
    items: [
      { href: "/dashboard/social", label: "Social", Icon: IconLinks },
      { href: "/dashboard/badges", label: "Badges", Icon: IconBadges },
      { href: "/dashboard/premium", label: "Premium", Icon: IconBadges },
      { href: "/dashboard/analytics", label: "Analytics", Icon: IconAnalytics },
    ],
  },
];

function isActive(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
}

function NavLink({ href, label, Icon, active }: NavItem & { active: boolean }) {
  return (
    <Link
      href={href}
      className={`bf-dash-nav-link flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium ${
        active ? "bf-dash-nav-link--active" : ""
      }`}
    >
      <Icon size={15} className={active ? "text-white" : "text-neutral-500"} />
      <span className="truncate">{label}</span>
    </Link>
  );
}

function NavGroupSection({
  group,
  pathname,
  open,
  onToggle,
}: {
  group: NavGroup;
  pathname: string;
  open: boolean;
  onToggle: () => void;
}) {
  const hasActive = group.items.some((item) => isActive(pathname, item.href));

  return (
    <div className="bf-dash-nav-group">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-600 transition-colors hover:text-neutral-400"
        aria-expanded={open}
      >
        {group.label}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="M3 4.5 6 7.5 9 4.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
      </button>

      {open ? (
        <div className="mt-0.5 space-y-0.5 pl-1">
          {group.items.map((item) => (
            <NavLink key={item.href} {...item} active={isActive(pathname, item.href)} />
          ))}
        </div>
      ) : hasActive ? (
        <div className="mt-1 px-2.5">
          {group.items
            .filter((item) => isActive(pathname, item.href))
            .map((item) => (
              <NavLink key={item.href} {...item} active />
            ))}
        </div>
      ) : null}
    </div>
  );
}

export function DashboardSidebar({
  showAdminPanel = false,
  adminRole,
}: {
  showAdminPanel?: boolean;
  adminRole?: "owner" | "admin";
}) {
  const pathname = usePathname();

  const defaultOpen = useMemo(() => {
    const open: Record<string, boolean> = {};
    for (const group of NAV_GROUPS) {
      open[group.id] = group.items.some((item) => isActive(pathname, item.href));
    }
    if (!Object.values(open).some(Boolean)) {
      open.design = true;
    }
    return open;
  }, [pathname]);

  const [openGroups, setOpenGroups] = useState(defaultOpen);

  useEffect(() => {
    setOpenGroups((prev) => {
      const next = { ...prev };
      for (const group of NAV_GROUPS) {
        if (group.items.some((item) => isActive(pathname, item.href))) {
          next[group.id] = true;
        }
      }
      return next;
    });
  }, [pathname]);

  function toggleGroup(id: string) {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <aside className="bf-dash-sidebar flex w-full flex-col lg:sticky lg:top-[4.25rem] lg:max-h-[calc(100vh-4.25rem)] lg:w-[240px] lg:shrink-0">
      <nav className="bf-dash-nav flex min-h-0 flex-1 flex-col gap-3 lg:overflow-y-auto lg:pr-1">
        <NavLink href="/dashboard" label="Overview" Icon={IconOverview} active={pathname === "/dashboard"} />

        {NAV_GROUPS.map((group) => (
          <NavGroupSection
            key={group.id}
            group={group}
            pathname={pathname}
            open={!!openGroups[group.id]}
            onToggle={() => toggleGroup(group.id)}
          />
        ))}

        <div className="bf-dash-nav-group border-t border-white/[0.06] pt-3">
          <NavLink
            href="/dashboard/settings"
            label="Settings"
            Icon={IconSettings}
            active={pathname.startsWith("/dashboard/settings")}
          />
        </div>

        {showAdminPanel ? (
          <div className="bf-dash-nav-group space-y-1 border-t border-white/[0.06] pt-3">
            <p className="px-2.5 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-600">
              Admin
            </p>
            <NavLink href="/dashboard/admin" label="Dashboard" Icon={IconAnalytics} active={pathname === "/dashboard/admin"} />
            <NavLink href="/dashboard/admin/users" label="Users" Icon={IconProfile} active={pathname.startsWith("/dashboard/admin/users")} />
            <NavLink href="/dashboard/admin/badges" label="Badges" Icon={IconBadges} active={pathname.startsWith("/dashboard/admin/badges")} />
            <NavLink href="/dashboard/admin/moderation" label="Moderation" Icon={IconSettings} active={pathname.startsWith("/dashboard/admin/moderation")} />
            <NavLink href="/dashboard/admin/announcements" label="Announcements" Icon={IconEffects} active={pathname.startsWith("/dashboard/admin/announcements")} />
            <NavLink href="/dashboard/admin/notifications" label="Notifications" Icon={IconLinks} active={pathname.startsWith("/dashboard/admin/notifications")} />
            <NavLink href="/dashboard/admin/security" label="Security" Icon={IconSettings} active={pathname.startsWith("/dashboard/admin/security")} />
            <NavLink href="/dashboard/admin/premium" label="Premium" Icon={IconBadges} active={pathname.startsWith("/dashboard/admin/premium")} />
            <NavLink href="/dashboard/admin/analytics" label="Analytics" Icon={IconAnalytics} active={pathname.startsWith("/dashboard/admin/analytics")} />
            <NavLink href="/dashboard/admin/audit" label="Audit Logs" Icon={IconOverview} active={pathname.startsWith("/dashboard/admin/audit")} />
            {adminRole === "owner" ? (
              <NavLink href="/dashboard/admin/owner" label="Owner Tools" Icon={IconSettings} active={pathname.startsWith("/dashboard/admin/owner")} />
            ) : null}
          </div>
        ) : null}
      </nav>
    </aside>
  );
}
