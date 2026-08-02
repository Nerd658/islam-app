import { Howl } from 'howler';

/**
 * Bulletproof Dual-Tier Arabic Audio Engine
 * Tier 1: Real Human Qari Recitation MP3 (Howler.js) for Quranic words.
 * Tier 2: Instant Zero-Latency Speech Synthesis for Letters and Vocalizations.
 */

let currentHowl = null;

const speakVoice = (text, fallback) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
            window.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ar-SA';
            utterance.rate = 0.8;
            utterance.volume = 1.0;

            const voices = window.speechSynthesis.getVoices();
            const arVoice = voices.find(v => v.lang && (v.lang.startsWith('ar') || v.lang.includes('ar')));

            if (arVoice) {
                utterance.voice = arVoice;
                window.speechSynthesis.speak(utterance);
            } else {
                const spokenText = fallback || text;
                const fallbackUtterance = new SpeechSynthesisUtterance(spokenText);
                fallbackUtterance.rate = 0.8;
                fallbackUtterance.volume = 1.0;
                window.speechSynthesis.speak(fallbackUtterance);
            }
        } catch (err) {
            console.error("SpeechSynthesis error:", err);
        }
    }
};

export const playArabicAudio = (text, directAudioUrl = null, phoneticFallback = "") => {
    if (!text || typeof window === 'undefined') return;

    let url = null;
    let fallback = phoneticFallback || "";

    if (typeof directAudioUrl === 'string') {
        if (directAudioUrl.startsWith('http://') || directAudioUrl.startsWith('https://') || directAudioUrl.startsWith('/')) {
            url = directAudioUrl;
        } else {
            fallback = directAudioUrl;
        }
    }

    if (!fallback) {
        fallback = text;
    }

    try {
        if (currentHowl) {
            currentHowl.stop();
            currentHowl.unload();
            currentHowl = null;
        }

        // Tier 1: Real Human Qari MP3 (Howler.js)
        if (url) {
            currentHowl = new Howl({
                src: [url],
                html5: true,
                format: ['mp3'],
                volume: 1.0,
                onplayerror: () => { speakVoice(text, fallback); },
                onloaderror: () => { speakVoice(text, fallback); }
            });
            currentHowl.play();
            return;
        }

        // Tier 2: Instant Zero-Latency Speech Synthesis for Letters & Vowels
        speakVoice(text, fallback);

    } catch (e) {
        console.error("Audio engine error:", e);
        speakVoice(text, fallback);
    }
};
