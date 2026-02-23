import { useEffect, useState } from "react";

export type PageLifecycle = {
  visible: boolean;
  focused: boolean;
  frozen: boolean;
};

export function usePageLifecycle(): PageLifecycle {
  const getVisible = () =>
    typeof document !== "undefined"
      ? document.visibilityState === "visible"
      : true;
  const getFocused = () =>
    typeof document !== "undefined" &&
    typeof (document as any).hasFocus === "function"
      ? document.hasFocus()
      : true;
  const getFrozen = () =>
    typeof document !== "undefined"
      ? (document as any).visibilityState === "frozen"
      : false;

  const [visible, setVisible] = useState<boolean>(getVisible);
  const [focused, setFocused] = useState<boolean>(getFocused);
  const [frozen, setFrozen] = useState<boolean>(getFrozen);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;

    const onVisibility = () =>
      setVisible(document.visibilityState === "visible");
    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);
    const onFreeze = () => setFrozen(true);
    const onPageHide = () => {
      setVisible(false);
      setFrozen(true);
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);

    if (typeof (document as any).addEventListener === "function") {
      try {
        document.addEventListener("freeze", onFreeze);
      } catch (e) {
        // ignore if unsupported
      }
    }

    window.addEventListener("pagehide", onPageHide);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
      try {
        document.removeEventListener("freeze", onFreeze);
      } catch (e) {}
      window.removeEventListener("pagehide", onPageHide);
    };
  }, []);

  return { visible, focused, frozen };
}

export default usePageLifecycle;
