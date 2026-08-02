import React from 'react';
import arabicData from '../../data/arabic_learning.json';
import { GraduationCap } from 'lucide-react';

export default function ArabicGrammar() {
    return (
        <div className="w-full max-w-5xl mx-auto py-6 px-4 flex flex-col min-h-screen">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 flex items-center justify-center gap-3">
                    <GraduationCap className="text-gray-400" size={32} />
                    Bases de la Grammaire Coranique (Nahw)
                </h2>
                <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
                    Découvrez les 3 catégories fondamentales des mots en arabe avec leurs caractéristiques et exemples.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {arabicData.grammar.map(item => (
                    <div 
                        key={item.id}
                        className="bg-[#0a0a0a] border border-[#333] p-6 rounded-2xl shadow-xl flex flex-col justify-between"
                    >
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                            <p className="text-gray-300 text-sm leading-relaxed mb-4 font-sans">
                                {item.definition}
                            </p>
                            <div className="bg-[#111] p-3 rounded-xl border border-[#222] mb-4">
                                <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Caractéristiques</span>
                                <p className="text-xs text-gray-400 font-sans">{item.characteristics}</p>
                            </div>
                        </div>

                        <div className="bg-[#111] p-4 rounded-xl border border-[#222] text-center">
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Exemple</span>
                            <p className="text-2xl font-arabic text-white font-bold mb-1">{item.exampleArabic}</p>
                            <p className="text-xs text-gray-400 italic">{item.exampleFr}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
