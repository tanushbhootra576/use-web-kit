"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SidebarLink {
  name: string;
  href: string;
  badge?: string;
}

interface SidebarGroup {
  section: string;
  count?: number;
  links: SidebarLink[];
}

const NAVIGATION: SidebarGroup[] = [
  {
    section: 'Getting Started',
    links: [
      { name: 'Introduction', href: '/docs' },
      { name: 'Installation', href: '/docs/installation' },
      { name: 'Quick Start', href: '/docs/quick-start' },
    ]
  },
  {
    section: 'DOM',
    count: 5,
    links: [
      { name: 'useSmartIntersection', href: '/docs/api#useSmartIntersection', badge: 'rec' },
      { name: 'useIntersection', href: '/docs/api#useIntersection' },
      { name: 'useMediaControls', href: '/docs/api#useMediaControls' },
      { name: 'useElementDimensions', href: '/docs/api#useElementDimensions', badge: 'new' },
      { name: 'useIntentObserver', href: '/docs/api#useIntentObserver', badge: 'new' },
    ]
  },
  {
    section: 'Concurrency',
    count: 5,
    links: [
      { name: 'useWorkerPool', href: '/docs/api#useWorkerPool' },
      { name: 'useSharedWorkerPool', href: '/docs/api#useSharedWorkerPool', badge: 'new' },
      { name: 'useChunkedTask', href: '/docs/api#useChunkedTask', badge: 'new' },
      { name: 'useIdleQueue', href: '/docs/api#useIdleQueue' },
      { name: 'useAdaptivePolling', href: '/docs/api#useAdaptivePolling' },
    ]
  },
  {
    section: 'State',
    count: 4,
    links: [
      { name: 'useDebouncedStorage', href: '/docs/api#useDebouncedStorage', badge: 'rec' },
      { name: 'useHeavyStorage', href: '/docs/api#useHeavyStorage', badge: 'new' },
      { name: 'useStorage', href: '/docs/api#useStorage' },
      { name: 'useBroadcastState', href: '/docs/api#useBroadcastState' },
    ]
  },
  {
    section: 'Pipelines',
    count: 2,
    links: [
      { name: 'useEventPipeline', href: '/docs/api#useEventPipeline' },
      { name: 'useActionPipeline', href: '/docs/api#useActionPipeline' },
    ]
  },
  {
    section: 'BOM',
    count: 4,
    links: [
      { name: 'useAdaptivePerformance', href: '/docs/api#useAdaptivePerformance', badge: 'new' },
      { name: 'useNetworkStatus', href: '/docs/api#useNetworkStatus' },
      { name: 'usePageLifecycle', href: '/docs/api#usePageLifecycle' },
      { name: 'usePermission', href: '/docs/api#usePermission' },
    ]
  },
  {
    section: 'Guides',
    links: [
      { name: 'Performance', href: '/docs/performance' },
      { name: 'Usage Patterns', href: '/docs/usage' },
      { name: 'Migration Guide', href: '/docs/migration' },
    ]
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (section: string) => {
    setCollapsed(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <nav className="flex flex-col gap-7">
      {NAVIGATION.map((group) => {
        const isCollapsed = collapsed[group.section];

        return (
          <div key={group.section} className="flex flex-col">
            {/* Section Header */}
            <button
              onClick={() => toggle(group.section)}
              className="flex items-center justify-between mb-2.5 group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-accent/40 group-hover:bg-accent transition-colors" />
                <span className="mono-label !text-[9px] text-zinc-500 group-hover:text-zinc-300 transition-colors">
                  {group.section}
                </span>
                {group.count && (
                  <span className="text-[9px] font-mono text-zinc-700 tabular-nums">{group.count}</span>
                )}
              </div>
              <ChevronDown
                size={12}
                className={cn(
                  "text-zinc-700 transition-transform duration-200",
                  isCollapsed && "-rotate-90"
                )}
              />
            </button>

            {/* Links */}
            {!isCollapsed && (
              <ul className="flex flex-col gap-0.5 border-l border-white/[0.04] ml-[2px]">
                {group.links.map((link) => {
                  const isActive = pathname === link.href ||
                    (link.href.includes('#') && pathname === link.href.split('#')[0]);

                  return (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className={cn(
                          "block py-1.5 pl-4 -ml-px text-[13px] transition-all duration-150 border-l",
                          isActive
                            ? 'text-accent border-accent font-medium bg-accent/[0.06]'
                            : 'text-zinc-500 border-transparent hover:text-zinc-300 hover:border-white/10 hover:bg-white/[0.02]'
                        )}
                      >
                        <span className="flex items-center gap-2">
                          {link.name}
                          {link.badge === 'rec' && (
                            <span className="text-[8px] font-mono uppercase tracking-wider text-accent/60 bg-accent/[0.08] px-1.5 py-0.5 border border-accent/10">rec</span>
                          )}
                          {link.badge === 'new' && (
                            <span className="text-[8px] font-mono uppercase tracking-wider text-green-400/80 bg-green-500/[0.08] px-1.5 py-0.5 border border-green-500/20">new</span>
                          )}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}
