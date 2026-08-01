import React, { useState } from 'react';
import { RotateCcw, Activity } from 'lucide-react';

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
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Activity className="text-white" size={28} /> Tasbih Numérique
            </h2>
            
            <div className="bg-[#0a0a0a] border border-[#333] p-8 rounded-[3rem] shadow-2xl flex flex-col items-center w-full max-w-sm">
                
                <div className="mb-8 w-full">
                    <select 
                        onChange={(e) => { setPhrase(e.target.value); setCount(0); }}
                        className="w-full bg-[#111] border border-[#333] text-white p-3 rounded-lg outline-none"
                    >
                        {phrases.map(p => (
                            <option key={p.text} value={p.text}>{p.text}</option>
                        ))}
                    </select>
                </div>

                <div className="bg-[#111] border border-[#444] w-full h-32 rounded-2xl mb-12 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
                    <h3 className="text-2xl font-arabic text-gray-400 mb-1">{phrases.find(p => p.text === phrase)?.arabic}</h3>
                    <span className="text-5xl font-mono text-white font-bold">{count.toString().padStart(4, '0')}</span>
                </div>

                <div className="flex flex-col items-center gap-8 w-full">
                    <button 
                        onClick={handleTap}
                        className="w-32 h-32 bg-white hover:bg-gray-200 text-black rounded-full shadow-lg flex items-center justify-center transform active:scale-95 transition-all"
                    >
                        <span className="text-2xl font-bold">Tap</span>
                    </button>

                    <button 
                        onClick={handleReset}
                        className="w-16 h-16 bg-[#222] hover:bg-[#333] border border-[#444] text-white rounded-full flex items-center justify-center shadow-md transform active:scale-90 transition-all"
                        title="Réinitialiser"
                    >
                        <RotateCcw size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
}
