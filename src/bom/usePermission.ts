import { useState, useEffect, useCallback } from "react";
import type { UsePermissionReturn, PermissionName, PermissionState } from "../core/types";

// ── Utilities ────────────────────────────────────────────────────────────────

function getPermissionsAPI(): Permissions | undefined {
  if (typeof navigator === "undefined") return undefined;
  return (navigator as unknown as { permissions?: Permissions }).permissions ?? undefined;
}

function getInitialState(
  name: PermissionName,
): PermissionState | "unsupported" {
  if (typeof navigator === "undefined") return "unsupported";
  if (!getPermissionsAPI()) {
    if (name === "notifications" && typeof Notification !== "undefined") {
      const p = Notification.permission;
      return p === "default" ? "prompt" : (p as PermissionState);
    }
    if (name === "geolocation" && "geolocation" in navigator) {
      return "prompt";
    }
    return "unsupported";
  }
  return "prompt";
}

function requestPermission(name: PermissionName): Promise<PermissionState> {
  if (typeof navigator === "undefined") return Promise.resolve("prompt");

  // Try the modern Permissions.request() API first.
  const permissions = getPermissionsAPI();
  if (permissions && "request" in permissions) {
    try {
      return (permissions as unknown as { request: (d: PermissionDescriptor) => Promise<PermissionStatus> })
        .request({ name } as PermissionDescriptor)
        .then((status) => status.state);
    } catch {
      // Fall through to legacy methods.
    }
  }

  // Legacy fallbacks for specific permissions.
  switch (name) {
    case "geolocation":
      if ("geolocation" in navigator) {
        return new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            () => resolve("granted"),
            (error) => {
              resolve(error.code === 1 ? "denied" : "prompt");
            },
          );
        });
      }
      break;
    case "notifications":
      if (typeof window !== "undefined" && "Notification" in window) {
        return Notification.requestPermission().then((permission) => {
          return permission === "default"
            ? "prompt"
            : (permission as PermissionState);
        });
      }
      break;
    case "camera":
    case "microphone":
      if (
        "mediaDevices" in navigator &&
        "getUserMedia" in navigator.mediaDevices
      ) {
        return navigator.mediaDevices
          .getUserMedia({ [name]: true })
          .then(() => "granted" as PermissionState)
          .catch((error: DOMException) => {
            return error.name === "NotAllowedError" ? "denied" : "prompt";
          });
      }
      break;
  }

  return Promise.resolve("prompt");
}

// ── The Hook ─────────────────────────────────────────────────────────────────

/**
 * Monitors browser permission states using the Permissions API.
 *
 * FIX: The change listener is now registered on the PermissionStatus object
 * returned by permissions.query(), not on the Permissions object itself.
 * The Permissions API specification fires "change" events on PermissionStatus,
 * not on the Permissions object. The previous implementation registered the
 * listener on the wrong target and would never receive change notifications.
 */
export function usePermission(name: PermissionName): UsePermissionReturn {
  const [state, setState] = useState<PermissionState | "unsupported">(() =>
    getInitialState(name),
  );

  useEffect(() => {
    const permissions = getPermissionsAPI();
    if (!permissions) return;

    let isActive = true;
    let permissionStatus: PermissionStatus | null = null;

    // The "change" event listener -- fires when the user grants or denies
    // a permission via the browser UI after the initial query.
    const handleChange = () => {
      if (!isActive || !permissionStatus) return;
      setState(permissionStatus.state);
    };

    // Query the PermissionStatus and register the change listener on it.
    try {
      const queryPromise = permissions.query({ name } as PermissionDescriptor);
      if (queryPromise && typeof queryPromise.then === "function") {
        queryPromise
          .then((status) => {
            if (!isActive) return;
            permissionStatus = status;
            setState(status.state);

            // Register change listener on the PermissionStatus object.
            status.addEventListener("change", handleChange);
          })
          .catch(() => {
            // Query failed -- keep the initial state.
          });
      }
    } catch {
      // permissions.query() threw synchronously -- keep current state.
    }

    return () => {
      isActive = false;
      // Clean up the listener from the PermissionStatus object.
      if (permissionStatus) {
        permissionStatus.removeEventListener("change", handleChange);
      }
    };
  }, [name]);

  const request = useCallback(async (): Promise<PermissionState> => {
    try {
      const result = await requestPermission(name);
      setState(result);
      return result;
    } catch {
      return "denied";
    }
  }, [name]);

  return { state, request };
}

export default usePermission;
