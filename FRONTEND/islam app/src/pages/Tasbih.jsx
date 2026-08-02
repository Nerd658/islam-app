import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Activity, Volume2, VolumeX, Sparkles, Trash2 } from 'lucide-react';

export default function Tasbih() {
    const [count, setCount] = useState(() => {
        return parseInt(localStorage.getItem('tasbih_count') || '0', 10);
    });
    const [total, setTotal] = useState(() => {
        return parseInt(localStorage.getItem('tasbih_total') || '0', 10);
    });
    const [phrase, setPhrase] = useState(() => {
        return localStorage.getItem('tasbih_phrase') || "Subhanallah";
    });
    const [soundEnabled, setSoundEnabled] = useState(() => {
        return localStorage.getItem('tasbih_sound') !== 'false';
    });

    const phrases = [
        { text: "Subhanallah", arabic: "سُبْحَانَ ٱللَّٰهِ" },
        { text: "Alhamdulillah", arabic: "ٱلْحَمْدُ لِلَّٰهِ" },
        { text: "Allahu Akbar", arabic: "ٱللَّٰهُ أَكْبَرُ" },
        { text: "La ilaha illallah", arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ" },
        { text: "Astaghfirullah", arabic: "أَسْتَغْفِرُ ٱللَّٰهَ" }
    ];

    const audioCtxRef = useRef(null);

    // Persist session states to localStorage
    useEffect(() => {
        localStorage.setItem('tasbih_count', count.toString());
    }, [count]);

    useEffect(() => {
        localStorage.setItem('tasbih_total', total.toString());
    }, [total]);

    useEffect(() => {
        localStorage.setItem('tasbih_phrase', phrase);
    }, [phrase]);

    useEffect(() => {
        localStorage.setItem('tasbih_sound', soundEnabled.toString());
    }, [soundEnabled]);

    const playClickSound = () => {
        if (!soundEnabled) return;
        try {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            const ctx = audioCtxRef.current;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.08);
        } catch (e) {
            console.error(e);
        }
    };

    const handleTap = () => {
        const nextCount = count + 1;
        setCount(nextCount);
        setTotal(t => t + 1);

        playClickSound();

        // Enhanced Haptic Vibration: Double pulse every 33 counts
        if (navigator.vibrate) {
            if (nextCount % 33 === 0) {
                navigator.vibrate([100, 50, 100]);
            } else {
                navigator.vibrate(40);
            }
        }
    };

    const handleReset = () => {
        setCount(0);
        if (navigator.vibrate) {
            navigator.vibrate(80);
        }
    };

    const handleResetTotal = () => {
        setCount(0);
        setTotal(0);
        localStorage.setItem('tasbih_count', '0');
        localStorage.setItem('tasbih_total', '0');
        if (navigator.vibrate) {
            navigator.vibrate([80, 40, 80]);
        }
    };

    const currentArabic = phrases.find(p => p.text === phrase)?.arabic;

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-white">
                <Activity className="text-[#aaa]" size={28} /> Tasbih Numérique
            </h2>
            
            <div className="bg-[#0a0a0a] border border-[#333] p-8 rounded-[3rem] shadow-2xl flex flex-col items-center w-full max-w-sm">
                
                {/* Sound & Milestone Controls Header */}
                <div className="w-full flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-mono">Total session : {total}</span>
                        {total > 0 && (
                            <button 
                                onClick={handleResetTotal}
                                className="text-gray-600 hover:text-red-400 transition-colors p-1" 
                                title="Réinitialiser la session complète"
                            >
                                <Trash2 size={12} />
                            </button>
                        )}
                    </div>
                    
                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={`p-2 rounded-xl border transition-all ${
                            soundEnabled ? 'bg-[#111] border-[#444] text-white' : 'bg-[#111] border-[#222] text-gray-600'
                        }`}
                        title="Son du clic"
                    >
                        {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    </button>
                </div>

                {/* Phrase Selection */}
                <div className="mb-6 w-full">
                    <select 
                        value={phrase}
                        onChange={(e) => { setPhrase(e.target.value); setCount(0); }}
                        className="w-full bg-[#111] border border-[#333] text-white p-3 rounded-xl outline-none font-semibold text-sm cursor-pointer"
                    >
                        {phrases.map(p => (
                            <option key={p.text} value={p.text}>{p.text}</option>
                        ))}
                    </select>
                </div>

                {/* Digital Counter Display */}
                <div className="bg-[#111] border border-[#444] w-full h-36 rounded-2xl mb-8 flex flex-col items-center justify-center shadow-inner relative overflow-hidden p-4">
                    <h3 className="text-2xl sm:text-3xl font-arabic text-gray-300 mb-1">{currentArabic}</h3>
                    <span className="text-5xl font-mono text-white font-bold tracking-widest">{count.toString().padStart(4, '0')}</span>
                    {count > 0 && count % 33 === 0 && (
                        <span className="absolute top-2 right-2 text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <Sparkles size={10} /> 33 Requis !
                        </span>
                    )}
                </div>

                {/* Tap & Reset Buttons */}
                <div className="flex flex-col items-center gap-6 w-full">
                    <button 
                        onClick={handleTap}
                        className="w-36 h-36 bg-white hover:bg-gray-200 text-black rounded-full shadow-2xl flex flex-col items-center justify-center transform active:scale-95 transition-all cursor-pointer select-none"
                    >
                        <span className="text-3xl font-extrabold tracking-wide">TAP</span>
                        <span className="text-[10px] text-gray-500 font-mono uppercase mt-0.5">Égrainer</span>
                    </button>

                    <button 
                        onClick={handleReset}
                        className="w-14 h-14 bg-[#111] hover:bg-[#222] border border-[#444] text-gray-300 hover:text-white rounded-full flex items-center justify-center shadow-md transform active:scale-90 transition-all"
                        title="Réinitialiser le compteur actuel"
                    >
                        <RotateCcw size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
