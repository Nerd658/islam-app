/**
 * Bulletproof Arabic Audio Utility
 * Fixed: Removed crossOrigin='anonymous' which caused CORS block on Google TTS stream.
 * Added persistent Audio reference and Web Speech API fallback.
 */

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

        // Method 1: Web Speech API Synthesis
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ar-SA';
            utterance.rate = 0.85;
            utterance.volume = 1.0;

            const voices = window.speechSynthesis.getVoices();
            const arVoice = voices.find(v => v.lang && (v.lang.startsWith('ar') || v.lang.includes('ar')));
            if (arVoice) {
                utterance.voice = arVoice;
            }

            window.speechSynthesis.speak(utterance);
        }

        // Method 2: HTML5 Audio Stream (NO crossOrigin to prevent CORS block)
        const encodedText = encodeURIComponent(text);
        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=ar&client=tw-ob`;
        
        const audio = new Audio();
        audio.referrerPolicy = 'no-referrer';
        audio.volume = 1.0;
        audio.src = ttsUrl;

        // Store in global window reference so GC does not destroy it mid-stream
        window._activeArabicAudio = audio;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch((err) => {
                console.warn("Google TTS fallback active:", err);
                
                // Fallback to Youdao Arabic TTS
                try {
                    const fallbackUrl = `https://dict.youdao.com/dictvoice?audio=${encodedText}&le=ar`;
                    const fallbackAudio = new Audio();
                    fallbackAudio.volume = 1.0;
                    fallbackAudio.src = fallbackUrl;
                    window._activeArabicAudio = fallbackAudio;
                    fallbackAudio.play().catch(() => {});
                } catch (e) {}
            });
        }
    } catch (e) {
        console.error("Audio engine error:", e);
    }
};
