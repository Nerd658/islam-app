import { Howl } from 'howler';

/**
 * Industrial Howler.js Powered Arabic Audio Engine
 * Prioritizes Authentic Human Recitation MP3 URLs with fallbacks to SpeechSynthesis and Phonetic Reader.
 */

let currentHowl = null;

const fallbackSpeech = (text, phoneticFallback) => {
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
                const spokenText = phoneticFallback || text;
                const fallbackUtterance = new SpeechSynthesisUtterance(spokenText);
                fallbackUtterance.rate = 0.8;
                fallbackUtterance.volume = 1.0;
                window.speechSynthesis.speak(fallbackUtterance);
            }
        } catch (e) {
            console.warn("SpeechSynthesis error:", e);
        }
    }
};

export const playArabicAudio = (text, directAudioUrl = null, phoneticFallback = "") => {
    if (typeof window === 'undefined') return;

    try {
        // Stop and unload previous Howler instance
        if (currentHowl) {
            currentHowl.stop();
            currentHowl.unload();
            currentHowl = null;
        }

        // Tier 1: Authentic Human MP3 Recitation URL if provided
        if (directAudioUrl) {
            currentHowl = new Howl({
                src: [directAudioUrl],
                html5: true, // HTML5 audio streaming for cross-domain CDN
                format: ['mp3'],
                volume: 1.0,
                onplayerror: () => {
                    fallbackSpeech(text, phoneticFallback);
                }
            });
            currentHowl.play();
            return;
        }

        // Tier 2: Google TTS Stream / SpeechSynthesis
        const encodedText = encodeURIComponent(text);
        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=ar&client=tw-ob`;

        currentHowl = new Howl({
            src: [ttsUrl],
            html5: true,
            format: ['mp3'],
            volume: 1.0,
            onplayerror: () => {
                fallbackSpeech(text, phoneticFallback);
            },
            onloaderror: () => {
                fallbackSpeech(text, phoneticFallback);
            }
        });

        currentHowl.play();
    } catch (e) {
        console.error("Howler audio engine error:", e);
        fallbackSpeech(text, phoneticFallback);
    }
};
