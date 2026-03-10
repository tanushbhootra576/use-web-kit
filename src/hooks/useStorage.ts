import { useCallback, useState, useEffect } from "react";

export type StorageType = "localStorage" | "sessionStorage";

export interface UseStorageOptions {
  serializer?: {
    read: (value: string) => unknown;
    write: (value: unknown) => string;
  };
}

export interface UseStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
}

function getStorageObject(type: StorageType): Storage | undefined {
  if (typeof window === "undefined") return undefined;
  return type === "localStorage" ? window.localStorage : window.sessionStorage;
}

function defaultSerializer() {
  return {
    read: (value: string) => {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    },
    write: (value: unknown) => JSON.stringify(value),
  };
}

export function useStorage<T>(
  key: string,
  initialValue: T,
  type: StorageType = "localStorage",
  options: UseStorageOptions = {}
): UseStorageReturn<T> {
  const serializer = options.serializer || defaultSerializer();
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

  const setStoredValue = useCallback((newValue: T | ((prev: T) => T)) => {
    try {
      const storage = getStorageObject(type);
      if (!storage) return;

      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      
      storage.setItem(key, serializer.write(valueToStore));
      setValue(valueToStore);
    } catch (error) {
      console.warn(`Failed to set ${key} in ${type}:`, error);
    }
  }, [key, type, serializer, value]);

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
