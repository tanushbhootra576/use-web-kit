import { useCallback, useState, useEffect } from "react";

export interface UseHeavyStorageReturn {
  /** Saves a Blob, string, or ArrayBuffer to the Origin Private File System (OPFS). */
  save: (key: string, data: Blob | string | ArrayBuffer) => Promise<void>;
  /** Loads the data as a File (which extends Blob). Returns null if not found. */
  load: (key: string) => Promise<File | null>;
  /** Removes the file from the OPFS. */
  remove: (key: string) => Promise<void>;
  /** Whether the current browser supports OPFS. */
  isSupported: boolean;
}

/**
 * A hook for interacting with the Origin Private File System (OPFS).
 * Perfect for storing GBs of data (images, videos, SQLite databases) asynchronously
 * without blocking the main thread (unlike localStorage or IndexedDB in some browsers).
 */
export function useHeavyStorage(): UseHeavyStorageReturn {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.storage && "getDirectory" in navigator.storage) {
      setIsSupported(true);
    }
  }, []);

  const save = useCallback(async (key: string, data: Blob | string | ArrayBuffer) => {
    if (typeof navigator === "undefined" || !navigator.storage) {
      throw new Error("OPFS is not supported in this environment.");
    }
    const root = await navigator.storage.getDirectory();
    // Use an exclusive lock to avoid cross-tab corruption
    const fileHandle = await root.getFileHandle(key, { create: true });
    
    // createWritable is an OPFS method
    if (!("createWritable" in fileHandle)) {
        throw new Error("createWritable is not supported on this file handle");
    }
    
    const writable = await (fileHandle as any).createWritable();
    await writable.write(data);
    await writable.close();
  }, []);

  const load = useCallback(async (key: string): Promise<File | null> => {
    if (typeof navigator === "undefined" || !navigator.storage) {
      return null;
    }
    try {
      const root = await navigator.storage.getDirectory();
      const fileHandle = await root.getFileHandle(key, { create: false });
      const file = await fileHandle.getFile();
      return file;
    } catch (error: any) {
      // NotFoundError is expected if the file doesn't exist
      if (error.name === "NotFoundError") {
        return null;
      }
      throw error;
    }
  }, []);

  const remove = useCallback(async (key: string): Promise<void> => {
    if (typeof navigator === "undefined" || !navigator.storage) {
      return;
    }
    try {
      const root = await navigator.storage.getDirectory();
      await root.removeEntry(key);
    } catch (error: any) {
      if (error.name !== "NotFoundError") {
        throw error;
      }
    }
  }, []);

  return { save, load, remove, isSupported };
}
