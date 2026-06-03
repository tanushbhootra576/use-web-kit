import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CalloutType = "info" | "warning" | "performance" | "danger";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

export default function Callout({ type = "info", title, children }: CalloutProps) {
  const styles = {
    info: {
      border: "border-l-blue-400/50",
      bg: "bg-blue-500/[0.05]",
      iconColor: "text-blue-400",
      titleColor: "text-blue-400",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      )
    },
    performance: {
      border: "border-l-accent/50",
      bg: "bg-accent/[0.04]",
      iconColor: "text-accent",
      titleColor: "text-accent",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      )
    },
    warning: {
      border: "border-l-orange-400/50",
      bg: "bg-orange-500/[0.05]",
      iconColor: "text-orange-400",
      titleColor: "text-orange-400",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )
    },
    danger: {
      border: "border-l-red-400/50",
      bg: "bg-red-500/[0.05]",
      iconColor: "text-red-400",
      titleColor: "text-red-400",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      )
    }
  };

  const current = styles[type];

  return (
    <div className={cn("my-4 p-4 flex items-start gap-3 border-l-2 border border-white/[0.04]", current.bg, current.border)}>
      <div className={cn("shrink-0 mt-0.5", current.iconColor)}>
        {current.icon}
      </div>
      <div className="text-sm leading-relaxed flex-1 text-zinc-400">
        {title && (
          <h4 className={cn("font-semibold text-[10px] mb-1 tracking-[0.15em] font-mono uppercase", current.titleColor)}>
            {title}
          </h4>
        )}
        <div className="text-[13px]">{children}</div>
      </div>
    </div>
  );
}
