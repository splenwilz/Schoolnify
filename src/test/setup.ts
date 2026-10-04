import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";

// jsdom does not implement matchMedia; next-themes calls it when enableSystem is on.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// jsdom does no layout; charts and framer-motion probe ResizeObserver.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
if (!("ResizeObserver" in globalThis)) {
  Object.defineProperty(globalThis, "ResizeObserver", { writable: true, value: ResizeObserverStub });
}

// vi.setSystemTime persists across tests unless restored.
afterEach(() => {
  vi.useRealTimers();
});
