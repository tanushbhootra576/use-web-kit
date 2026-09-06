export interface NavItem {
  label: string;
  href: string;
  badge?: string;
  external?: boolean;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

import { HOOKS_DATA } from "./hooks-data";

const hookDomains = ["DOM", "Concurrency", "State", "Pipelines", "BOM"];

const dynamicHookGroups: NavGroup[] = hookDomains.map(domain => {
  const hooks = HOOKS_DATA.filter(h => h.domain === domain).sort((a, b) => a.name.localeCompare(b.name));
  return {
    title: domain,
    items: hooks.map(hook => ({
      label: hook.name,
      href: `/docs/api#${hook.id}`,
      badge: hook.isNew ? "New" : undefined
    }))
  };
});

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "Getting Started",
    items: [
      { label: "Installation", href: "/docs" },
      { label: "API Reference", href: "/docs/api" },
    ],
  },
  ...dynamicHookGroups,
  {
    title: "Guides",
    items: [
      { label: "Usage Patterns", href: "/docs/usage" },
      { label: "Performance Architecture", href: "/docs/performance" },
      { label: "Migration Guide", href: "/docs/migration" },
    ],
  },
];

export const TOP_NAV_LINKS: NavItem[] = [
  { label: "Docs", href: "/docs" },
  { label: "API", href: "/docs/api" },
  { label: "Architecture", href: "/architecture" },
];

export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}

export const FOOTER_LINKS: FooterLinkGroup[] = [
  {
    title: "Documentation",
    links: [
      { label: "Getting Started", href: "/docs" },
      { label: "API Reference", href: "/docs/api" },
      { label: "Architecture", href: "/architecture" },
      { label: "Use Cases", href: "/use-cases" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Contributing", href: "/contributing" },
      { label: "GitHub", href: "https://github.com/tanushbhootra576/use-web-kit", external: true },
      { label: "Roadmap", href: "/roadmap" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "License", href: "/license" },
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Security", href: "/security" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Support", href: "/support" },
      { label: "Status", href: "/status" },
      { label: "Accessibility", href: "/accessibility" },
      { label: "Guidelines", href: "/guidelines" },
    ],
  },
];
