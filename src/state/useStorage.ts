import { useCallback, useState, useEffect } from "react";
import type { UseStorageOptions, UseStorageReturn, StorageType } from "../core/types";

function getStorageObject(type: StorageType): Storage | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    return type === "localStorage" ? window.localStorage : window.sessionStorage;
  } catch {
    return undefined;
  }
}

function defaultSerializer() {
  return {
    read: (value: string): unknown => {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    },
    write: (value: unknown): string => JSON.stringify(value),
  };
}

export function useStorage<T>(
  key: string,
  initialValue: T,
  type: StorageType = "localStorage",
  options: UseStorageOptions = {}
): UseStorageReturn<T> {
  const serializer = options.serializer || defaultSerializer();

  // Lazy initializer reads from storage on the client.
  // On SSR, getStorageObject returns undefined so initialValue is used.
  const [value, setValue] = useState<T>(() => {
    const storage = getStorageObject(type);
    if (!storage) return initialValue;

    try {
      const item = storage.getItem(key);
      if (item === null) return initialValue;
      return serializer.read(item) as T;
    } catch (error) {
      console.warn(`Failed to parse ${key} from ${type}:`, error);
      return initialValue;
    }
  });

  // Listen for cross-tab storage changes (localStorage only).
  useEffect(() => {
    const storage = getStorageObject(type);
    if (!storage) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        try {
          const item = storage.getItem(key);
          if (item === null) {
            setValue(initialValue);
          } else {
            setValue(serializer.read(item) as T);
          }
        } catch (error) {
          console.warn(`Failed to parse ${key} from ${type}:`, error);
          setValue(initialValue);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key, type, initialValue, serializer]);

  // FIX: Use functional update in setStoredValue to avoid stale `value` closure.
  // The previous implementation captured `value` from the render scope, which
  // meant rapid calls to setStoredValue would use the same stale base value.
  const setStoredValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue((currentValue) => {
      try {
        const storage = getStorageObject(type);
        const valueToStore = newValue instanceof Function ? newValue(currentValue) : newValue;
        if (storage) {
          storage.setItem(key, serializer.write(valueToStore));
        }
        return valueToStore;
      } catch (error) {
        console.warn(`Failed to set ${key} in ${type}:`, error);
        return currentValue;
      }
    });
  }, [key, type, serializer]);

  const removeStoredValue = useCallback(() => {
    try {
      const storage = getStorageObject(type);
      if (!storage) return;

      storage.removeItem(key);
      setValue(initialValue);
    } catch (error) {
      console.warn(`Failed to remove ${key} from ${type}:`, error);
    }
  }, [key, type, initialValue]);

  return {
    value,
    setValue: setStoredValue,
    removeValue: removeStoredValue,
  };
}

export default useStorage;
