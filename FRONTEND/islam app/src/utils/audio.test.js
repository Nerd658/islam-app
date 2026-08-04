import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock howler before importing the module under test
vi.mock('howler', () => {
    const play = vi.fn();
    const stop = vi.fn();
    const unload = vi.fn();
    const HowlMock = vi.fn(function () {
        this.play = play;
        this.stop = stop;
        this.unload = unload;
    });
    return { Howl: HowlMock };
});

import { playArabicAudio } from './audio';
import { Howl } from 'howler';

describe('audio utilities', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('playArabicAudio with a valid URL creates a Howl instance with that URL', () => {
        playArabicAudio('test', 'https://example.com/audio.mp3');

        expect(Howl).toHaveBeenCalledTimes(1);
        const howlArgs = Howl.mock.calls[0][0];
        expect(howlArgs.src).toEqual(['https://example.com/audio.mp3']);
        expect(howlArgs.html5).toBe(true);
    });

    it('playArabicAudio with no URL uses backend proxy URL', () => {
        playArabicAudio('\u0645\u0631\u062D\u0628\u0627');

        expect(Howl).toHaveBeenCalledTimes(1);
        const howlArgs = Howl.mock.calls[0][0];
        // It should point to the backend proxy
        expect(howlArgs.src[0]).toMatch(/\/api\/tts\?text=/);
        expect(howlArgs.src[0]).toContain(encodeURIComponent('\u0645\u0631\u062D\u0628\u0627'));
    });

    it('playArabicAudio with null text returns without throwing and without creating Howl', () => {
        expect(() => {
            playArabicAudio(null);
        }).not.toThrow();

        expect(Howl).not.toHaveBeenCalled();
    });
});
