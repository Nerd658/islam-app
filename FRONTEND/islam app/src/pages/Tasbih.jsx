import React, { useState } from 'react';

export default function Tasbih() {
    const [count, setCount] = useState(0);
    const [total, setTotal] = useState(0);
    const [phrase, setPhrase] = useState("Subhanallah");

    const phrases = [
        { text: "Subhanallah", arabic: "سُبْحَانَ ٱللَّٰهِ" },
        { text: "Alhamdulillah", arabic: "ٱلْحَمْدُ لِلَّٰهِ" },
        { text: "Allahu Akbar", arabic: "ٱللَّٰهُ أَكْبَرُ" },
        { text: "La ilaha illallah", arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ" }
    ];

    const handleTap = () => {
        setCount(c => c + 1);
        setTotal(t => t + 1);
        // Haptic feedback if supported
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    };

    const handleReset = () => {
        setCount(0);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
            <h2 className="text-3xl font-bold mb-8">Tasbih Numérique 📿</h2>
            
            <div className="flex flex-wrap justify-center gap-2 mb-10">
                {phrases.map(p => (
                    <button
                        key={p.text}
                        onClick={() => { setPhrase(p.text); setCount(0); }}
                        className={`px-4 py-2 rounded-full font-semibold transition ${phrase === p.text ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                    >
                        {p.text}
                    </button>
                ))}
            </div>

            <div className="bg-slate-800/80 p-8 rounded-[3rem] shadow-2xl border-4 border-slate-700 w-full max-w-sm flex flex-col items-center relative">
                <div className="absolute top-4 right-6 text-emerald-400 font-mono text-xl">
                    Total: {total}
                </div>
                
                <h3 className="text-4xl font-arabic text-amber-300 mt-8 mb-2">
                    {phrases.find(p => p.text === phrase)?.arabic}
                </h3>
                <p className="text-gray-400 mb-8">{phrase}</p>

                <div className="bg-slate-900 w-full rounded-2xl p-6 text-center shadow-inner mb-10">
                    <span className="text-7xl font-mono font-bold text-white tracking-widest">{count.toString().padStart(3, '0')}</span>
                </div>

                <div className="flex gap-4 w-full px-4">
                    <button 
                        onClick={handleReset}
                        className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 flex items-center justify-center font-bold shadow-inner transition active:scale-95"
                    >
                        Reset
                    </button>
                    <button 
                        onClick={handleTap}
                        className="flex-grow h-24 rounded-[2rem] bg-emerald-500 hover:bg-emerald-400 text-white text-3xl font-bold shadow-[0_10px_0_0_rgba(5,150,105,1)] active:shadow-[0_0px_0_0_rgba(5,150,105,1)] active:translate-y-[10px] transition-all"
                    >
                        TAP
                    </button>
                </div>
            </div>
        </div>
    );
}
