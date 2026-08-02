import React, { useState } from 'react';
import arabicData from '../../data/arabic_learning.json';
import { playArabicAudio } from '../../utils/audio';
import { Layers, Volume2, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ArabicVocabulary() {
    const [flashcardIndex, setFlashcardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const currentVocab = arabicData.vocabulary[flashcardIndex];

    const playAudio = (text, directAudioUrl = null, fallback = "") => {
        playArabicAudio(text, directAudioUrl, fallback);
    };

    const nextCard = () => {
        setIsFlipped(false);
        setFlashcardIndex((prev) => (prev + 1) % arabicData.vocabulary.length);
    };

    const prevCard = () => {
        setIsFlipped(false);
        setFlashcardIndex((prev) => (prev - 1 + arabicData.vocabulary.length) % arabicData.vocabulary.length);
    };

    return (
        <div className="w-full max-w-5xl mx-auto py-6 px-4 flex flex-col min-h-screen">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 flex items-center justify-center gap-3">
                    <Layers className="text-gray-400" size={32} />
                    Les 80% du Vocabulaire Coranique
                </h2>
                <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
                    Cartes mémoire interactives (Flashcards) pour réviser les mots les plus fréquents du Coran.
                </p>
            </div>

            <div className="flex flex-col items-center max-w-xl mx-auto w-full">
                {/* Progress Indicator */}
                <div className="w-full flex justify-between items-center mb-4 text-xs font-mono text-gray-400">
                    <span>Mot {flashcardIndex + 1} / {arabicData.vocabulary.length}</span>
                    <span>Répété {currentVocab.occurrences} fois dans le Coran</span>
                </div>

                {/* Interactive Flashcard Container */}
                <div 
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="w-full h-80 bg-[#0a0a0a] border border-[#333] hover:border-gray-500 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer shadow-2xl transition-all relative overflow-hidden group select-none"
                >
                    <span className="absolute top-4 right-4 text-[10px] text-gray-500 font-mono flex items-center gap-1">
                        <RotateCw size={12} /> Cliquer pour retourner
                    </span>

                    <button 
                        onClick={(e) => { e.stopPropagation(); playAudio(currentVocab.arabic, currentVocab.audio, currentVocab.transliteration); }}
                        className="absolute top-4 left-4 p-2 bg-[#111] hover:bg-[#222] border border-[#333] text-emerald-400 rounded-xl transition-all"
                        title="Écouter la prononciation authentique"
                    >
                        <Volume2 size={18} />
                    </button>

                    {!isFlipped ? (
                        /* Front Side: Arabic */
                        <div className="flex flex-col items-center">
                            <span className="text-6xl font-arabic text-white font-bold mb-4">{currentVocab.arabic}</span>
                            <span className="text-sm font-mono text-gray-400">[{currentVocab.transliteration}]</span>
                        </div>
                    ) : (
                        /* Back Side: Translation */
                        <div className="flex flex-col items-center">
                            <span className="text-xs uppercase text-emerald-400 font-bold tracking-widest mb-2">Traduction</span>
                            <h3 className="text-3xl font-bold text-white mb-3">{currentVocab.french}</h3>
                            <p className="text-xs text-gray-400 italic max-w-xs">
                                En apprenant ce mot, vous comprenez {currentVocab.occurrences} versets du Coran.
                            </p>
                        </div>
                    )}
                </div>

                {/* Card Controls */}
                <div className="flex items-center gap-4 mt-6">
                    <button
                        onClick={prevCard}
                        className="p-3 bg-[#111] hover:bg-[#222] border border-[#333] text-white rounded-full transition-all shadow-md"
                        title="Précédent"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <button
                        onClick={() => setIsFlipped(!isFlipped)}
                        className="px-6 py-3 bg-white text-black font-bold rounded-2xl shadow-lg hover:bg-gray-200 transition-all text-sm flex items-center gap-2"
                    >
                        <RotateCw size={16} />
                        <span>{isFlipped ? "Voir l'Arabe" : "Voir la Traduction"}</span>
                    </button>

                    <button
                        onClick={nextCard}
                        className="p-3 bg-[#111] hover:bg-[#222] border border-[#333] text-white rounded-full transition-all shadow-md"
                        title="Suivant"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
