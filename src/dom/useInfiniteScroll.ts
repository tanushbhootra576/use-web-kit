"use client";

import { useState, useCallback, useRef } from "react";
import { useSmartIntersection } from "./useSmartIntersection";

export interface UseInfiniteScrollOptions {
  onLoadMore: () => void | Promise<void>;
  hasMore: boolean;
  threshold?: number;
}

export function useInfiniteScroll(options: UseInfiniteScrollOptions): {
  sentinelRef: (el: Element | null) => (() => void) | void;
  isLoading: boolean;
} {
  const { onLoadMore, hasMore, threshold = 0.1 } = options;
  const [isLoading, setIsLoading] = useState(false);
  
  // Use refs for stable callback identity in intersection handler
  const isLoadingRef = useRef(isLoading);
  isLoadingRef.current = isLoading;
  
  const onLoadMoreRef = useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;
  
  const hasMoreRef = useRef(hasMore);
  hasMoreRef.current = hasMore;

  const { ref } = useSmartIntersection({
    onIntersect: useCallback((entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
        if (!isLoadingRef.current && hasMoreRef.current) {
          setIsLoading(true);
          Promise.resolve(onLoadMoreRef.current()).finally(() => {
            setIsLoading(false);
          });
        }
      }
    }, [threshold])
  });

  return { sentinelRef: ref, isLoading };
}
