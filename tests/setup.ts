import '@testing-library/jest-dom';
import { Window } from 'happy-dom';

// Setup DOM environment for Bun
if (typeof window === 'undefined' || typeof document === 'undefined') {
  const window = new Window();
  const document = window.document;
  
  // @ts-ignore
  global.window = window;
  // @ts-ignore
  global.document = document;
  // @ts-ignore
  global.HTMLElement = window.HTMLElement;
  // @ts-ignore
  global.Element = window.Element;
}

// Use Bun's test API if available, otherwise use Jest
const testAPI = typeof Bun !== 'undefined' ? Bun : { test: globalThis.test || globalThis.jest };
const mockFn = typeof Bun !== 'undefined' ? (() => {}) : jest.fn;

// Mock window.matchMedia
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mockFn.mockImplementation ? mockFn.mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: mockFn(),
      removeListener: mockFn(),
      addEventListener: mockFn(),
      removeEventListener: mockFn(),
      dispatchEvent: mockFn(),
    })) : (() => ({
      matches: false,
      media: '',
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    })),
  });
}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

