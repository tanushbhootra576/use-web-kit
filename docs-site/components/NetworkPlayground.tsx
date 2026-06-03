"use client";

import { useEffect, useState } from "react";

interface NetworkInfo {
  isOnline: boolean;
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
  lastChanged: string;
}

function getTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function NetworkPlayground() {
  const [info, setInfo] = useState<NetworkInfo>({
    isOnline: true,
    effectiveType: "4g",
    downlink: 10,
    rtt: 50,
    saveData: false,
    lastChanged: getTime(),
  });

  useEffect(() => {
    const update = () => {
      const connection =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (navigator as any).connection ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (navigator as any).mozConnection ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (navigator as any).webkitConnection;

      setInfo({
        isOnline: navigator.onLine,
        effectiveType: connection?.effectiveType ?? "unknown",
        downlink: connection?.downlink ?? 0,
        rtt: connection?.rtt ?? 0,
        saveData: connection?.saveData ?? false,
        lastChanged: getTime(),
      });
    };

    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    const connection =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigator as any).connection;
    connection?.addEventListener("change", update);

    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
      connection?.removeEventListener("change", update);
    };
  }, []);

  const rows = [
    {
      key: "Network Status",
      value: info.isOnline ? "Online" : "Offline",
      accent: info.isOnline,
    },
    { key: "Connection Type", value: info.effectiveType, accent: false },
    {
      key: "Downlink",
      value: info.downlink ? `${info.downlink} Mbps` : "—",
      accent: false,
    },
    { key: "RTT", value: info.rtt ? `${info.rtt} ms` : "—", accent: false },
    {
      key: "Save Data",
      value: info.saveData ? "Enabled" : "Disabled",
      accent: false,
    },
    { key: "Last Changed", value: info.lastChanged, accent: false },
  ];

  return (
    <div className="rounded-xl border border-[rgba(163,255,18,0.15)] bg-[rgba(0,0,0,0.4)] overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.1)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.1)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.1)]" />
        </div>
        <span
          className="text-[11px] text-[#9ca3af] ml-2"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          useNetworkStatus() — Live
        </span>
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#a3ff12] status-dot" />
      </div>

      {/* Values */}
      <div className="p-4 flex flex-col gap-2">
        {rows.map((row) => (
          <div
            key={row.key}
            className="flex items-center justify-between py-1.5 border-b border-[rgba(255,255,255,0.04)] last:border-0"
          >
            <span
              className="text-xs text-[#9ca3af]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {row.key}
            </span>
            <span
              className={`text-xs font-medium ${row.accent ? "text-[#a3ff12]" : "text-[#f0f0f0]"}`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <div className="px-4 pb-3">
        <p
          className="text-[10px] text-[rgba(255,255,255,0.2)]"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Toggle offline in browser DevTools to see live updates.
        </p>
      </div>
    </div>
  );
}
