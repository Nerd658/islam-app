/**
 * Bulletproof Arabic Audio Utility
 * Fixes the JavaScript Garbage Collection bug where `new Audio()` is collected mid-stream,
 * causing silent playback without console errors.
 */

// Persistent global reference to prevent Garbage Collection mid-flight
if (typeof window !== 'undefined') {
    window._activeArabicAudio = null;
}

export const playArabicAudio = (text) => {
    if (!text || typeof window === 'undefined') return;

    try {
        // Stop any currently playing audio instance
        if (window._activeArabicAudio) {
            window._activeArabicAudio.pause();
            window._activeArabicAudio.currentTime = 0;
            window._activeArabicAudio = null;
        }

        // Method 1: Web Speech Synthesis with explicit User Gesture binding
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ar-SA';
            utterance.rate = 0.8;
            utterance.volume = 1.0;

            const voices = window.speechSynthesis.getVoices();
            const arVoice = voices.find(v => v.lang && (v.lang.startsWith('ar') || v.lang.includes('ar')));
            if (arVoice) {
                utterance.voice = arVoice;
            }

            window.speechSynthesis.speak(utterance);
        }

        // Method 2: Persistent Audio Element (Prevents JS Garbage Collector from killing it)
        const encodedText = encodeURIComponent(text);
        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=ar&client=tw-ob`;
        
        const audio = new Audio();
        audio.referrerPolicy = 'no-referrer';
        audio.crossOrigin = 'anonymous';
        audio.volume = 1.0;
        audio.src = ttsUrl;

        // Store in global window reference so GC does not destroy it
        window._activeArabicAudio = audio;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Playback started successfully
            }).catch((err) => {
                console.warn("Primary audio stream notice, fallback active:", err);
                
                // Fallback to Youdao Arabic TTS
                try {
                    const fallbackUrl = `https://dict.youdao.com/dictvoice?audio=${encodedText}&le=ar`;
                    const fallbackAudio = new Audio(fallbackUrl);
                    fallbackAudio.volume = 1.0;
                    window._activeArabicAudio = fallbackAudio;
                    fallbackAudio.play().catch(() => {});
                } catch (e) {}
            });
        }
    } catch (e) {
        console.error("Audio engine error:", e);
    }
};
