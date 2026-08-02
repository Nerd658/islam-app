import { Howl } from 'howler';

/**
 * Industrial Howler.js Powered Arabic Audio Engine
 * Smart URL detection: Automatically distinguishes between direct audio URLs and phonetic fallback strings.
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

export const playArabicAudio = (text, param2 = null, param3 = "") => {
    if (!text || typeof window === 'undefined') return;

    let directAudioUrl = null;
    let phoneticFallback = "";

    // Smart parameter detection
    if (typeof param2 === 'string') {
        if (param2.startsWith('http://') || param2.startsWith('https://') || param2.startsWith('/')) {
            directAudioUrl = param2;
            phoneticFallback = param3;
        } else {
            phoneticFallback = param2;
        }
    }

    try {
        // Stop and unload previous Howler instance
        if (currentHowl) {
            currentHowl.stop();
            currentHowl.unload();
            currentHowl = null;
        }

        // Tier 1: Direct Real Human MP3 Recitation URL if valid URL provided
        if (directAudioUrl) {
            currentHowl = new Howl({
                src: [directAudioUrl],
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
            return;
        }

        // Tier 2: Stream Google TTS / SpeechSynthesis
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
