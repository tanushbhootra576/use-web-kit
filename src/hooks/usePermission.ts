import { useState, useEffect, useCallback } from "react";

export type PermissionName =
  | "geolocation"
  | "notifications"
  | "persistent-storage"
  | "push"
  | "camera"
  | "microphone"
  | "speaker"
  | "device-info"
  | "background-sync"
  | "background-fetch"
  | "accelerometer"
  | "gyroscope"
  | "magnetometer"
  | "ambient-light-sensor"
  | "clipboard-read"
  | "clipboard-write";

export type PermissionState = "granted" | "denied" | "prompt";

export interface UsePermissionReturn {
  state: PermissionState | "unsupported";
  request: () => Promise<PermissionState>;
}

function getPermissionsAPI(): Permissions | undefined {
  if (typeof navigator === "undefined") return undefined;
  return (navigator as any).permissions ?? undefined;
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
  // For permissions that support request()
  if (typeof navigator !== "undefined" && "permissions" in navigator) {
    const permissions = (navigator as any).permissions;
    if (permissions && "request" in permissions) {
      try {
        return permissions.request({ name } as PermissionDescriptor);
      } catch {
        // Fall back to legacy methods if available
      }
    }
  }

  // Legacy fallbacks for specific permissions
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
      if ("Notification" in window) {
        return Notification.requestPermission().then((permission) => {
          // Convert "default" to "prompt" for consistency
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
          .catch((error) => {
            return error.name === "NotAllowedError" ? "denied" : "prompt";
          });
      }
      break;
  }

  return Promise.resolve("prompt");
}

export function usePermission(name: PermissionName): UsePermissionReturn {
  const [state, setState] = useState<PermissionState | "unsupported">(() =>
    getInitialState(name),
  );

  useEffect(() => {
    const permissions = getPermissionsAPI();
    if (!permissions) return;

    let isActive = true;

    // Re-query on change events fired by the Permissions API object.
    const handleChange = async () => {
      if (!isActive) return;
      try {
        const status = await permissions.query({
          name,
        } as PermissionDescriptor);
        if (isActive) setState(status.state);
      } catch {
        // ignore — keep current state
      }
    };

    // Initial query.  Guard against permissions.query() returning undefined
    // (e.g. jest.fn() with no mockReturnValue set) — calling .then() on
    // undefined would throw synchronously and break React's effect runner.
    try {
      const queryPromise = permissions.query({ name } as PermissionDescriptor);
      if (queryPromise && typeof queryPromise.then === "function") {
        queryPromise
          .then((status) => {
            if (isActive) setState(status.state);
          })
          .catch(() => {
            // Query failed — keep the initial "prompt" / "unsupported" state.
          });
      }
    } catch {
      // permissions.query() threw synchronously — keep current state.
    }

    // Register change listener on the Permissions API object.
    if (
      typeof (permissions as unknown as Record<string, unknown>)
        .addEventListener === "function"
    ) {
      (permissions as unknown as EventTarget).addEventListener(
        "change",
        handleChange as EventListener,
      );
    }

    return () => {
      isActive = false;
      if (
        typeof (permissions as unknown as Record<string, unknown>)
          .removeEventListener === "function"
      ) {
        (permissions as unknown as EventTarget).removeEventListener(
          "change",
          handleChange as EventListener,
        );
      }
    };
  }, [name]);

  const request = useCallback(async (): Promise<PermissionState> => {
    try {
      return await requestPermission(name);
    } catch {
      return "denied";
    }
  }, [name]);

  return { state, request };
}

export default usePermission;
