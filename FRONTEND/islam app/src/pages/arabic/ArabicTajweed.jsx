import React from 'react';
import arabicData from '../../data/arabic_learning.json';
import { playArabicAudio } from '../../utils/audio';
import { Gem, Volume2 } from 'lucide-react';

export default function ArabicTajweed() {
    const playAudio = (text) => {
        playArabicAudio(text);
    };

    return (
        <div className="w-full max-w-5xl mx-auto py-6 px-4 flex flex-col min-h-screen">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 flex items-center justify-center gap-3">
                    <Gem className="text-gray-400" size={32} />
                    Guide des Règles de Tajweed
                </h2>
                <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
                    Apprenez les règles de récitation coranique avec les codes couleurs et les exemples audio.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {arabicData.tajweedRules.map(rule => (
                    <div 
                        key={rule.id}
                        className="bg-[#0a0a0a] border border-[#333] p-6 rounded-2xl shadow-xl flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span 
                                    className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: rule.hex }}
                                />
                                <h3 className="text-xl font-bold text-white">{rule.name}</h3>
                            </div>

                            <p className="text-gray-300 text-sm leading-relaxed mb-6 font-sans">
                                {rule.description}
                            </p>
                        </div>

                        <div className="bg-[#111] p-4 rounded-xl border border-[#222] text-right">
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1 text-left">Exemple de Récitation</span>
                            <p className="text-3xl font-arabic text-white font-bold flex items-center justify-between" dir="rtl">
                                <span>{rule.example}</span>
                                <button 
                                    onClick={() => playAudio(rule.example)} 
                                    className="text-gray-500 hover:text-white p-1"
                                    title="Écouter l'exemple"
                                >
                                    <Volume2 size={18} />
                                </button>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
