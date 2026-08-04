import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Howler.js — audio is not available in jsdom
vi.mock('howler', () => ({
    Howl: vi.fn().mockImplementation(() => ({
        play: vi.fn(),
        stop: vi.fn(),
        unload: vi.fn(),
    })),
}));

// Mock window.AudioContext
class MockAudioContext {
    createOscillator() {
        return { type: '', frequency: { setValueAtTime: vi.fn() }, connect: vi.fn(), start: vi.fn(), stop: vi.fn() };
    }
    createGain() {
        return { gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }, connect: vi.fn() };
    }
    get currentTime() { return 0; }
    get destination() { return {}; }
}
global.AudioContext = MockAudioContext;
global.webkitAudioContext = MockAudioContext;

// Mock navigator.geolocation
global.navigator.geolocation = {
    getCurrentPosition: vi.fn(),
};

// Mock navigator.vibrate
global.navigator.vibrate = vi.fn();

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
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

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = vi.fn();

// Mock indexedDB with a simple in-memory stub (the real modules mock it per-test if needed)
if (!global.indexedDB) {
    global.indexedDB = {
        open: vi.fn().mockReturnValue({
            onupgradeneeded: null,
            onsuccess: null,
            onerror: null,
        }),
    };
}
