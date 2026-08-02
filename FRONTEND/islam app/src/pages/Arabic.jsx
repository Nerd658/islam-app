import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import arabicData from '../data/arabic_learning.json';
import { Languages, BookOpen, Layers, Sparkles, Volume2, RotateCw, CheckCircle2, ChevronRight, ChevronLeft, HelpCircle, GraduationCap, Trophy, XCircle, CheckCircle } from 'lucide-react';

export default function Arabic() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabFromUrl = searchParams.get('tab') || 'alphabet';
    
    const [activeTab, setActiveTab] = useState(tabFromUrl);
    
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
        setSearchParams({ tab: newTab });
    };

    // Audio Speech Synthesis Pronunciation
    const playAudio = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ar-SA';
            utterance.rate = 0.8;
            window.speechSynthesis.speak(utterance);
        }
    };

    // Flashcard State for Vocabulary
    const [flashcardIndex, setFlashcardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    // Selected Alphabet Letter for Detail
    const [selectedLetter, setSelectedLetter] = useState(arabicData.alphabet[0]);

    // Quiz State
    const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [quizQuestions, setQuizQuestions] = useState([]);

    useEffect(() => {
        // Generate random quiz questions from vocabulary
        const questions = arabicData.vocabulary.map(item => {
            const wrongOptions = arabicData.vocabulary
                .filter(v => v.id !== item.id)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3)
                .map(v => v.french);
            
            const options = [...wrongOptions, item.french].sort(() => 0.5 - Math.random());

            return {
                arabic: item.arabic,
                transliteration: item.transliteration,
                correctAnswer: item.french,
                options
            };
        }).sort(() => 0.5 - Math.random());

        setQuizQuestions(questions);
    }, []);

    const currentVocab = arabicData.vocabulary[flashcardIndex];

    const nextCard = () => {
        setIsFlipped(false);
        setFlashcardIndex((prev) => (prev + 1) % arabicData.vocabulary.length);
    };

    const prevCard = () => {
        setIsFlipped(false);
        setFlashcardIndex((prev) => (prev - 1 + arabicData.vocabulary.length) % arabicData.vocabulary.length);
    };

    const handleAnswerSelect = (option) => {
        if (isAnswered) return;
        setSelectedAnswer(option);
        setIsAnswered(true);

        if (option === quizQuestions[quizQuestionIndex].correctAnswer) {
            setScore(s => s + 1);
        }
    };

    const nextQuestion = () => {
        setIsAnswered(false);
        setSelectedAnswer(null);
        setQuizQuestionIndex(prev => (prev + 1) % quizQuestions.length);
    };

    const resetQuiz = () => {
        setScore(0);
        setQuizQuestionIndex(0);
        setIsAnswered(false);
        setSelectedAnswer(null);
    };

    return (
        <div className="w-full max-w-5xl mx-auto py-6 px-4 flex flex-col min-h-screen">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 flex items-center justify-center gap-3">
                    <Languages className="text-gray-400" size={32} />
                    Apprendre l'Arabe Coranique
                </h2>
                <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
                    Maîtrisez l'alphabet arabe, le vocabulaire le plus fréquent du Coran et les règles fondamentales du Tajweed.
                </p>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-[#0a0a0a] border border-[#333] p-1.5 rounded-2xl mb-8 shadow-xl flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto w-full">
                <button
                    onClick={() => handleTabChange('alphabet')}
                    className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                        activeTab === 'alphabet' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white'
                    }`}
                >
                    <BookOpen size={16} />
                    <span>Alphabet</span>
                </button>

                <button
                    onClick={() => handleTabChange('vocabulary')}
                    className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                        activeTab === 'vocabulary' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white'
                    }`}
                >
                    <Layers size={16} />
                    <span>Vocabulaire (80%)</span>
                </button>

                <button
                    onClick={() => handleTabChange('tajweed')}
                    className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                        activeTab === 'tajweed' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white'
                    }`}
                >
                    <Sparkles size={16} />
                    <span>Tajweed</span>
                </button>

                <button
                    onClick={() => handleTabChange('quiz')}
                    className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                        activeTab === 'quiz' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white'
                    }`}
                >
                    <HelpCircle size={16} />
                    <span>Quiz</span>
                </button>

                <button
                    onClick={() => handleTabChange('grammar')}
                    className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                        activeTab === 'grammar' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white'
                    }`}
                >
                    <GraduationCap size={16} />
                    <span>Grammaire</span>
                </button>
            </div>

            {/* TAB 1: ALPHABET */}
            {activeTab === 'alphabet' && (
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
            )}

            {/* TAB 2: VOCABULARY FLASHCARDS */}
            {activeTab === 'vocabulary' && (
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
                            onClick={(e) => { e.stopPropagation(); playAudio(currentVocab.arabic); }}
                            className="absolute top-4 left-4 p-2 bg-[#111] hover:bg-[#222] border border-[#333] text-emerald-400 rounded-xl transition-all"
                            title="Écouter la prononciation"
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
            )}

            {/* TAB 3: TAJWEED RULES */}
            {activeTab === 'tajweed' && (
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
            )}

            {/* TAB 4: QUIZ MODE */}
            {activeTab === 'quiz' && quizQuestions.length > 0 && (
                <div className="max-w-xl mx-auto w-full bg-[#0a0a0a] border border-[#333] p-8 rounded-3xl shadow-2xl">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#222]">
                        <span className="text-xs font-mono text-gray-400">Question {quizQuestionIndex + 1} / {quizQuestions.length}</span>
                        <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-800 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
                            <Trophy size={14} />
                            <span>Score : {score}</span>
                        </div>
                    </div>

                    {/* Question Card */}
                    <div className="text-center mb-8">
                        <span className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Que signifie ce mot ?</span>
                        <div className="bg-[#111] border border-[#333] p-6 rounded-2xl inline-block mb-3">
                            <h3 className="text-5xl font-arabic text-white font-bold mb-2">{quizQuestions[quizQuestionIndex]?.arabic}</h3>
                            <p className="text-xs text-gray-400 font-mono">[{quizQuestions[quizQuestionIndex]?.transliteration}]</p>
                        </div>
                    </div>

                    {/* Answer Options */}
                    <div className="grid grid-cols-1 gap-3 mb-6">
                        {quizQuestions[quizQuestionIndex]?.options.map((opt, i) => {
                            const isCorrect = opt === quizQuestions[quizQuestionIndex].correctAnswer;
                            const isSelected = selectedAnswer === opt;

                            let btnStyle = "bg-[#111] border-[#333] text-gray-200 hover:border-gray-500";
                            if (isAnswered) {
                                if (isCorrect) {
                                    btnStyle = "bg-emerald-950 border-emerald-600 text-emerald-200 font-bold";
                                } else if (isSelected) {
                                    btnStyle = "bg-rose-950 border-rose-700 text-rose-300 font-bold";
                                }
                            }

                            return (
                                <button
                                    key={i}
                                    onClick={() => handleAnswerSelect(opt)}
                                    disabled={isAnswered}
                                    className={`p-4 rounded-xl border transition-all text-sm font-semibold flex items-center justify-between text-left ${btnStyle}`}
                                >
                                    <span>{opt}</span>
                                    {isAnswered && isCorrect && <CheckCircle size={18} className="text-emerald-400" />}
                                    {isAnswered && isSelected && !isCorrect && <XCircle size={18} className="text-rose-400" />}
                                </button>
                            );
                        })}
                    </div>

                    {/* Next Question / Reset */}
                    {isAnswered && (
                        <button
                            onClick={nextQuestion}
                            className="w-full py-3.5 bg-white hover:bg-gray-200 text-black font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
                        >
                            <span>Question Suivante</span>
                            <ChevronRight size={18} />
                        </button>
                    )}
                </div>
            )}

            {/* TAB 5: GRAMMAR */}
            {activeTab === 'grammar' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {arabicData.grammar.map(item => (
                        <div 
                            key={item.id}
                            className="bg-[#0a0a0a] border border-[#333] p-6 rounded-2xl shadow-xl flex flex-col justify-between"
                        >
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                    {item.definition}
                                </p>
                                <div className="bg-[#111] p-3 rounded-xl border border-[#222] mb-4">
                                    <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Caractéristiques</span>
                                    <p className="text-xs text-gray-400">{item.characteristics}</p>
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
            )}
        </div>
    );
}
