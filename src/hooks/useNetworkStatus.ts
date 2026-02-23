import { useEffect, useState } from "react";

export type NetworkStatus = {
  online: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
};

function getConnection(): any | undefined {
  if (typeof navigator === "undefined") return undefined;
  return (navigator as any).connection;
}

export function useNetworkStatus(): NetworkStatus {
  const initialOnline =
    typeof navigator !== "undefined" && "onLine" in navigator
      ? navigator.onLine
      : true;

  const conn = getConnection();

  const [state, setState] = useState<NetworkStatus>(() => ({
    online: initialOnline,
    effectiveType: conn?.effectiveType,
    downlink: conn?.downlink,
    rtt: conn?.rtt,
  }));

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => setState((s) => ({ ...s, online: true }));
    const handleOffline = () => setState((s) => ({ ...s, online: false }));

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    let connection = getConnection();
    const handleConnectionChange = () => {
      connection = getConnection();
      setState((s) => ({
        ...s,
        effectiveType: connection?.effectiveType,
        downlink: connection?.downlink,
        rtt: connection?.rtt,
      }));
    };

    if (connection) {
      if (typeof connection.addEventListener === "function") {
        connection.addEventListener("change", handleConnectionChange);
      } else if ("onchange" in connection) {
        const prev = connection.onchange;
        connection.onchange = () => {
          handleConnectionChange();
          if (typeof prev === "function") prev();
        };
      }
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (connection) {
        if (typeof connection.removeEventListener === "function") {
          connection.removeEventListener("change", handleConnectionChange);
        } else if ("onchange" in connection) {
          try {
            connection.onchange = null;
          } catch (e) {
            // ignore
          }
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}

export default useNetworkStatus;
