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

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "Getting Started",
    items: [
      { label: "Installation", href: "/docs/installation" },
      { label: "Quick Start", href: "/docs#quickstart" },
    ],
  },
  {
    title: "DOM",
    items: [
      { label: "useSmartIntersection", href: "/docs/api#useSmartIntersection", badge: "Recommended" },
      { label: "useIntersection", href: "/docs/api#useIntersection" },
      { label: "useMediaControls", href: "/docs/api#useMediaControls" },
    ],
  },
  {
    title: "Concurrency",
    items: [
      { label: "useWorkerPool", href: "/docs/api#useWorkerPool" },
      { label: "useIdleQueue", href: "/docs/api#useIdleQueue" },
      { label: "useAdaptivePolling", href: "/docs/api#useAdaptivePolling" },
    ],
  },
  {
    title: "State",
    items: [
      { label: "useDebouncedStorage", href: "/docs/api#useDebouncedStorage", badge: "Recommended" },
      { label: "useStorage", href: "/docs/api#useStorage" },
      { label: "useBroadcastState", href: "/docs/api#useBroadcastState" },
    ],
  },
  {
    title: "Pipelines",
    items: [
      { label: "useEventPipeline", href: "/docs/api#useEventPipeline" },
      { label: "useActionPipeline", href: "/docs/api#useActionPipeline" },
    ],
  },
  {
    title: "BOM",
    items: [
      { label: "useNetworkStatus", href: "/docs/api#useNetworkStatus" },
      { label: "usePageLifecycle", href: "/docs/api#usePageLifecycle" },
      { label: "usePermission", href: "/docs/api#usePermission" },
    ],
  },
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
  { label: "Changelog", href: "/changelog" },
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
      { label: "Changelog", href: "/changelog" },
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
