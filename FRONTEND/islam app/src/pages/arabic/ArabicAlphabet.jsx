import React, { useState } from 'react';
import arabicData from '../../data/arabic_learning.json';
import { BookOpen, Volume2 } from 'lucide-react';

export default function ArabicAlphabet() {
    const [selectedLetter, setSelectedLetter] = useState(arabicData.alphabet[0]);

    const playAudio = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ar-SA';
            utterance.rate = 0.8;
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto py-6 px-4 flex flex-col min-h-screen">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 flex items-center justify-center gap-3">
                    <BookOpen className="text-gray-400" size={32} />
                    L'Alphabet Arabe & Formes d'Écriture
                </h2>
                <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
                    Apprenez les 28 lettres de l'alphabet arabe, leurs formes d'écriture et leur prononciation exacte.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Letters Grid */}
                <div className="md:col-span-2 grid grid-cols-4 sm:grid-cols-7 gap-3 bg-[#0a0a0a] p-4 rounded-2xl border border-[#333] shadow-xl">
                    {arabicData.alphabet.map(letter => {
                        const isSelected = selectedLetter.id === letter.id;
                        return (
                            <button
                                key={letter.id}
                                onClick={() => {
                                    setSelectedLetter(letter);
                                    playAudio(letter.example);
                                }}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                                    isSelected 
                                        ? 'bg-white text-black border-white shadow-lg scale-105' 
                                        : 'bg-[#111] hover:bg-[#222] text-white border-[#333] hover:border-gray-500'
                                }`}
                            >
                                <span className="text-3xl font-arabic font-bold mb-1">{letter.letter}</span>
                                <span className={`text-[10px] font-bold ${isSelected ? 'text-black' : 'text-gray-400'}`}>
                                    {letter.name}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Selected Letter Detail Panel */}
                <div className="bg-[#0a0a0a] border border-[#333] p-6 rounded-2xl flex flex-col items-center text-center shadow-xl">
                    <div className="w-full flex justify-between items-center mb-2">
                        <span className="text-xs font-mono text-gray-500">Lettre N° {selectedLetter.id}</span>
                        <button
                            onClick={() => playAudio(selectedLetter.example)}
                            className="p-2 bg-[#111] hover:bg-[#222] border border-[#333] text-emerald-400 rounded-xl transition-all"
                            title="Écouter la prononciation"
                        >
                            <Volume2 size={16} />
                        </button>
                    </div>

                    <div className="w-24 h-24 rounded-full bg-[#111] border border-[#444] flex items-center justify-center mb-4 shadow-inner">
                        <span className="text-6xl font-arabic text-white font-bold">{selectedLetter.letter}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{selectedLetter.name}</h3>
                    <p className="text-emerald-400 font-mono text-sm font-semibold mb-6">Prononciation : {selectedLetter.phonetic}</p>

                    {/* Letter Forms Table */}
                    <div className="w-full bg-[#111] border border-[#222] rounded-xl p-4 mb-6">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Formes d'écriture</h4>
                        <div className="grid grid-cols-4 gap-2 text-center">
                            <div>
                                <span className="text-[10px] text-gray-500 block mb-1">Isolée</span>
                                <span className="text-xl font-arabic text-white font-bold">{selectedLetter.isolated}</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-gray-500 block mb-1">Début</span>
                                <span className="text-xl font-arabic text-white font-bold">{selectedLetter.initial}</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-gray-500 block mb-1">Milieu</span>
                                <span className="text-xl font-arabic text-white font-bold">{selectedLetter.medial}</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-gray-500 block mb-1">Fin</span>
                                <span className="text-xl font-arabic text-white font-bold">{selectedLetter.final}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quranic Example */}
                    <div className="w-full bg-[#111] border border-[#222] rounded-xl p-4 text-center">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Exemple du Coran</span>
                        <p className="text-3xl font-arabic text-white mb-1 flex items-center justify-center gap-2">
                            {selectedLetter.example}
                            <button onClick={() => playAudio(selectedLetter.example)} className="text-gray-500 hover:text-white">
                                <Volume2 size={16} />
                            </button>
                        </p>
                        <p className="text-xs text-gray-400 italic">{selectedLetter.exampleFr}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
