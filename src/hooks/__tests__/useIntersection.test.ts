import { renderHook, act } from "@testing-library/react";
import useIntersection from "../useIntersection";

class MockIO {
  static instances: MockIO[] = [];
  cb: any;
  options: any;
  observed = new Set<Element>();
  constructor(cb: any, options: any) {
    this.cb = cb;
    this.options = options;
    MockIO.instances.push(this);
  }
  observe(el: Element) {
    this.observed.add(el);
  }
  unobserve(el: Element) {
    this.observed.delete(el);
  }
  disconnect() {
    this.observed.clear();
  }
  // helper
  static simulate(entry: IntersectionObserverEntry, instanceIndex = 0) {
    const inst = MockIO.instances[instanceIndex];
    if (inst) inst.cb([entry]);
  }
}

describe("useIntersection", () => {
  beforeEach(() => {
    // @ts-ignore
    global.IntersectionObserver = MockIO as any;
    MockIO.instances = [];
  });

  afterEach(() => {
    // @ts-ignore
    delete (global as any).IntersectionObserver;
  });

  it("creates an observer and observes element", () => {
    const { result } = renderHook(() => useIntersection());
    const el = document.createElement("div");
    act(() => {
      result.current.ref(el);
    });

    expect(MockIO.instances.length).toBe(1);
    expect(MockIO.instances[0].observed.has(el)).toBe(true);
  });

  it("fires callback and updates isIntersecting", () => {
    const { result } = renderHook(() => useIntersection());
    const el = document.createElement("div");
    act(() => result.current.ref(el));

    act(() => {
      MockIO.simulate({ target: el, isIntersecting: true } as any);
    });

    expect(result.current.isIntersecting).toBe(true);
    expect(result.current.entry).toBeDefined();
  });

  it("shares observer between multiple hooks with same options", () => {
    const { result: a } = renderHook(() => useIntersection());
    const { result: b } = renderHook(() => useIntersection());

    const el1 = document.createElement("div");
    const el2 = document.createElement("div");

    act(() => a.current.ref(el1));
    act(() => b.current.ref(el2));

    // single observer instance
    expect(MockIO.instances.length).toBe(1);
    expect(MockIO.instances[0].observed.has(el1)).toBe(true);
    expect(MockIO.instances[0].observed.has(el2)).toBe(true);
  });

  it("cleans up on unmount and disconnects when unused", () => {
    const { result, unmount } = renderHook(() => useIntersection());
    const el = document.createElement("div");
    act(() => result.current.ref(el));

    const inst = MockIO.instances[0];
    expect(inst.observed.has(el)).toBe(true);

    unmount();

    // observer should have no observed elements
    expect(inst.observed.size).toBe(0);
  });

  it("works on SSR (no IntersectionObserver)", () => {
    // remove IntersectionObserver
    // @ts-ignore
    delete (global as any).IntersectionObserver;
    const { result } = renderHook(() => useIntersection());
    const el = document.createElement("div");
    act(() => result.current.ref(el));
    expect(result.current.isIntersecting).toBe(false);
    expect(result.current.entry).toBeUndefined();
  });
});
