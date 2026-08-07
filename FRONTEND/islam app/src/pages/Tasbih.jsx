import React, { useRef } from 'react';
import { RotateCcw, Activity, Volume2, VolumeX, Gem, Trash2 } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import PageHeader from '../components/PageHeader';

export default function Tasbih() {
    const [count, setCount] = useLocalStorage('tasbih_count', 0);
    const [total, setTotal] = useLocalStorage('tasbih_total', 0);
    const [phrase, setPhrase] = useLocalStorage('tasbih_phrase', "Subhanallah");
    const [soundEnabled, setSoundEnabled] = useLocalStorage('tasbih_sound', true);

    const phrases = [
        { text: "Subhanallah", arabic: "سُبْحَانَ ٱللَّٰهِ" },
        { text: "Alhamdulillah", arabic: "ٱلْحَمْدُ لِلَّٰهِ" },
        { text: "Allahu Akbar", arabic: "ٱللَّٰهُ أَكْبَرُ" },
        { text: "La ilaha illallah", arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ" },
        { text: "Astaghfirullah", arabic: "أَسْتَغْفِرُ ٱللَّٰهَ" }
    ];

    const audioCtxRef = useRef(null);

    // Session states are automatically persisted by useLocalStorage

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
        setTotal(0);
        if (navigator.vibrate) {
            navigator.vibrate(80);
        }
    };

    const currentArabic = phrases.find(p => p.text === phrase)?.arabic;

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 pt-8 pb-24">
            <PageHeader 
                icon={<Activity size={32} />}
                title="Tasbih Numérique"
            />
            
            <div className="bg-theme-surface border border-theme-border p-8 rounded-[3rem] shadow-2xl flex flex-col items-center w-full max-w-sm relative overflow-hidden">
                
                {/* Subtle Glow Background */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-theme-primary/20 rounded-full blur-[80px] pointer-events-none"></div>

                {/* Sound & Milestone Controls Header */}
                <div className="w-full flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-theme-text-muted font-mono tracking-widest">Total session : {total}</span>
                        {total > 0 && (
                            <button 
                                onClick={handleReset}
                                className="text-theme-text-muted hover:text-red-400 transition-colors p-1" 
                                title="Réinitialiser la session complète"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                    
                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={`p-2 rounded-xl border transition-all shadow-sm ${
                            soundEnabled ? 'bg-theme-primary/10 border-theme-primary/30 text-theme-primary' : 'bg-theme-surface-hover border-theme-border text-theme-text-muted'
                        }`}
                        title="Son du clic"
                    >
                        {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                    </button>
                </div>

                {/* Phrase Selection */}
                <div className="mb-8 w-full relative z-10">
                    <select 
                        value={phrase}
                        onChange={(e) => { 
                            const newP = e.target.value;
                            setPhrase(newP); 
                            setCount(0); 
                            setTotal(0);
                        }}
                        className="w-full bg-theme-bg border border-theme-border focus:border-theme-primary focus:ring-1 focus:ring-theme-primary text-theme-text p-3.5 rounded-2xl outline-none font-semibold text-sm cursor-pointer shadow-inner appearance-none text-center"
                    >
                        {phrases.map(p => (
                            <option key={p.text} value={p.text}>{p.text}</option>
                        ))}
                    </select>
                </div>

                {/* Digital Counter Display */}
                <div className="bg-theme-bg border-2 border-theme-border w-full h-40 rounded-3xl mb-10 flex flex-col items-center justify-center shadow-inner relative overflow-hidden p-4 group">
                    <div className="absolute inset-0 bg-gradient-to-b from-theme-surface-hover to-transparent opacity-50 pointer-events-none"></div>
                    <h3 className="text-2xl sm:text-3xl font-arabic text-theme-text-muted mb-2 relative z-10">{currentArabic}</h3>
                    <span className="text-6xl font-mono text-theme-primary font-bold tracking-widest relative z-10 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                        {count.toString().padStart(4, '0')}
                    </span>
                    {count > 0 && count % 33 === 0 && (
                        <span className="absolute top-3 right-3 text-xs bg-theme-accent text-theme-bg px-3 py-1 rounded-full font-extrabold flex items-center gap-1.5 shadow-lg shadow-theme-accent/20 animate-in zoom-in duration-300">
                            <Gem size={12} /> 33 Atteints !
                        </span>
                    )}
                </div>

                {/* Tap & Reset Buttons */}
                <div className="flex flex-col items-center gap-8 w-full relative z-10">
                    <button 
                        onClick={handleTap}
                        className="w-40 h-40 bg-white hover:bg-gray-100 text-emerald-600 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] border-4 border-emerald-500/20 flex flex-col items-center justify-center transform active:scale-90 transition-all cursor-pointer select-none"
                    >
                        <span className="text-4xl font-extrabold tracking-wider text-black">TAP</span>
                        <span className="text-xs text-emerald-600 font-bold uppercase mt-1 tracking-widest">Égrainer</span>
                    </button>

                    <button 
                        onClick={handleReset}
                        className="w-14 h-14 bg-white hover:bg-gray-200 border border-white text-black rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)] transform active:scale-90 transition-all"
                        title="Réinitialiser le compteur actuel"
                    >
                        <RotateCcw size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
