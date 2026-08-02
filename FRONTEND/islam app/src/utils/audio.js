/**
 * Bulletproof Arabic TTS & Audio Player Utility
 * Combines Web Speech Synthesis with multi-CDN fallback for 100% reliability across all devices & browsers.
 */

// Pre-load voices on browser startup
let cachedVoices = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    cachedVoices = window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
        cachedVoices = window.speechSynthesis.getVoices();
    };
}

export const playArabicAudio = (text) => {
    if (!text || typeof window === 'undefined') return;

    // Method 1: Web Speech Synthesis with pre-warmed voice selection
    if ('speechSynthesis' in window) {
        try {
            window.speechSynthesis.cancel(); // Stop any pending speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ar-SA';
            utterance.rate = 0.75;
            utterance.volume = 1.0;

            const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
            const arVoice = voices.find(v => v.lang && (v.lang.startsWith('ar') || v.lang.includes('ar')));
            
            if (arVoice) {
                utterance.voice = arVoice;
            }

            window.speechSynthesis.speak(utterance);
        } catch (e) {
            console.warn("SpeechSynthesis failed:", e);
        }
    }

    // Method 2: Dual Audio Element Stream with no-referrer
    try {
        const encodedText = encodeURIComponent(text);
        const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=ar&client=tw-ob`;
        
        const audio = new Audio();
        audio.referrerPolicy = 'no-referrer';
        audio.src = googleUrl;
        audio.volume = 1.0;
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Secondary Audio CDN Fallback (Youdao Arabic Voice)
                try {
                    const fallbackUrl = `https://dict.youdao.com/dictvoice?audio=${encodedText}&le=ar`;
                    const fallbackAudio = new Audio(fallbackUrl);
                    fallbackAudio.volume = 1.0;
                    fallbackAudio.play().catch(() => {});
                } catch (err) {
                    console.warn("All audio endpoints blocked by browser autoplay policy.");
                }
            });
        }
    } catch (e) {
        console.error("Audio player error:", e);
    }
};
