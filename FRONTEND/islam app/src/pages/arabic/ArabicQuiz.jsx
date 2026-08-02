import React, { useState, useEffect } from 'react';
import arabicData from '../../data/arabic_learning.json';
import { HelpCircle, Trophy, CheckCircle, XCircle, ChevronRight, RotateCcw } from 'lucide-react';

export default function ArabicQuiz() {
    const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [quizQuestions, setQuizQuestions] = useState([]);

    useEffect(() => {
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

    if (quizQuestions.length === 0) return null;

    return (
        <div className="w-full max-w-5xl mx-auto py-6 px-4 flex flex-col min-h-screen">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 flex items-center justify-center gap-3">
                    <HelpCircle className="text-gray-400" size={32} />
                    Quiz & Auto-évaluation
                </h2>
                <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
                    Testez vos connaissances sur le vocabulaire coranique le plus fréquent.
                </p>
            </div>

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
                    <div className="flex gap-3">
                        <button
                            onClick={nextQuestion}
                            className="flex-1 py-3.5 bg-white hover:bg-gray-200 text-black font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
                        >
                            <span>Question Suivante</span>
                            <ChevronRight size={18} />
                        </button>
                        <button
                            onClick={resetQuiz}
                            className="p-3.5 bg-[#111] hover:bg-[#222] border border-[#333] text-gray-400 hover:text-white rounded-xl transition-all"
                            title="Réinitialiser le quiz"
                        >
                            <RotateCcw size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
