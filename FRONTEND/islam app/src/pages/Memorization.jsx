import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Mic, MicOff, ChevronRight, PlayCircle, StopCircle, RefreshCw, AlertTriangle, HelpCircle, CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { calculateSimilarity, stripArabicDiacritics } from '../utils/arabicUtils';

export default function Memorization() {
    const [chapters, setChapters] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [verses, setVerses] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Quiz state
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
    const [listening, setListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [feedback, setFeedback] = useState('');
    const [completed, setCompleted] = useState(false);
    const [showHint, setShowHint] = useState(false);
    
    const recognitionRef = useRef(null);
    
    // Setup Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            // Best accuracy for Quran is Saudi Arabic
            recognition.lang = 'ar-SA';
            
            recognition.onstart = () => {
                setListening(true);
                setFeedback('En écoute...');
            };
            
            recognition.onresult = (event) => {
                let currentTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    currentTranscript += event.results[i][0].transcript;
                }
                setTranscript(currentTranscript);
            };
            
            recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                if (event.error === 'not-allowed') {
                    setFeedback('Microphone bloqué. Veuillez autoriser l\'accès.');
                    setListening(false);
                } else if (event.error !== 'no-speech') {
                    setFeedback(`Erreur audio: ${event.error}`);
                }
            };
            
            recognition.onend = () => {
                setListening(false);
                // If quiz is still active, we might want to restart listening automatically,
                // but for UX, let's let the user press the button again or we can auto-restart.
            };
            
            recognitionRef.current = recognition;
        } else {
            setFeedback('La reconnaissance vocale n\'est pas supportée par votre navigateur (utilisez Chrome).');
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    // Load Chapters
    useEffect(() => {
        const cachedChapters = localStorage.getItem('quran_chapters_cache');
        if (cachedChapters) {
            setChapters(JSON.parse(cachedChapters));
        } else {
            setLoading(true);
            axios.get(`${import.meta.env.VITE_QURAN_API_URL}/api/v4/chapters?language=fr`)
                .then(res => {
                    setChapters(res.data.chapters);
                    localStorage.setItem('quran_chapters_cache', JSON.stringify(res.data.chapters));
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, []);

    // Fetch verses when chapter selected
    useEffect(() => {
        if (!selectedChapter) return;
        
        setLoading(true);
        axios.get(`${import.meta.env.VITE_QURAN_API_URL}/api/v4/quran/verses/uthmani?chapter_number=${selectedChapter.id}`)
            .then(res => {
                setVerses(res.data.verses);
                setQuizStarted(false);
                setCurrentVerseIndex(0);
                setTranscript('');
                setFeedback('');
                setCompleted(false);
                setShowHint(false);
            })
            .catch(err => {
                console.error(err);
                setFeedback('Erreur lors du chargement de la sourate.');
            })
            .finally(() => setLoading(false));
    }, [selectedChapter]);

    // Check similarity on transcript change
    useEffect(() => {
        if (!quizStarted || !verses.length || currentVerseIndex >= verses.length || !transcript) return;
        
        const targetVerse = verses[currentVerseIndex].text_uthmani;
        
        // Sometimes Bismillah is included in the first verse (for some APIs), but usually it's just the verse.
        const similarity = calculateSimilarity(transcript, targetVerse);
        
        if (similarity > 75) {
            // Verse recited correctly
            setFeedback(`Macha'Allah ! Précision : ${similarity}%`);
            setShowHint(true); // REVEAL IMMEDIATELY
            
            // Move to next verse after a delay to let user see it
            setTimeout(() => {
                setTranscript('');
                setShowHint(false);
                if (currentVerseIndex + 1 < verses.length) {
                    setCurrentVerseIndex(prev => prev + 1);
                    setFeedback('Récitez le verset suivant...');
                } else {
                    setCompleted(true);
                    setQuizStarted(false);
                    if (recognitionRef.current) {
                        recognitionRef.current.stop();
                    }
                    setFeedback('Félicitations, vous avez complété cette sourate !');
                }
            }, 2500); // 2.5 seconds delay for better UX
        } else if (transcript.trim().length > 10) {
            // Provide live feedback on accuracy if they've spoken a bit
            setFeedback(`En cours... (Précision: ${similarity}%)`);
        }
    }, [transcript, currentVerseIndex, quizStarted, verses]);

    const toggleListening = useCallback(() => {
        if (!recognitionRef.current) return;
        
        if (listening) {
            recognitionRef.current.stop();
            setListening(false);
        } else {
            setTranscript('');
            try {
                recognitionRef.current.start();
            } catch (e) {
                // If it's already started, this catches the error
                console.log(e);
            }
        }
    }, [listening]);

    const startQuiz = () => {
        setQuizStarted(true);
        setCurrentVerseIndex(0);
        setTranscript('');
        setFeedback('Commencez à réciter...');
        setCompleted(false);
        setShowHint(false);
        if (recognitionRef.current && !listening) {
            recognitionRef.current.start();
        }
    };

    const stopQuiz = () => {
        setQuizStarted(false);
        if (recognitionRef.current && listening) {
            recognitionRef.current.stop();
        }
    };

    const nextVerse = () => {
        if (currentVerseIndex + 1 < verses.length) {
            setCurrentVerseIndex(prev => prev + 1);
            setTranscript('');
            setShowHint(false);
            setFeedback('Passé au verset suivant.');
        }
    };

    return (
        <div className="pt-8 px-4 max-w-4xl mx-auto mb-24 min-h-[80vh]">
            <PageHeader 
                icon={<Mic size={32} />}
                title="Test de Mémorisation"
                subtitle="Récitez avec votre voix et l'IA vérifiera votre mémorisation (Hifz)."
            />

            {!recognitionRef.current && (
                <div className="bg-red-950/40 border border-red-800 text-red-400 p-4 rounded-xl mb-6 flex items-start gap-3">
                    <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
                    <p className="text-sm">Votre navigateur ne supporte pas la reconnaissance vocale. Veuillez utiliser Google Chrome, Edge ou Safari.</p>
                </div>
            )}

            {/* Selection Area */}
            {!quizStarted && !completed && (
                <div className="bg-[#0a0a0a] border border-[#333] rounded-3xl p-6 mb-8">
                    <h3 className="text-white font-bold mb-4">1. Choisissez une sourate</h3>
                    <select 
                        className="w-full bg-[#111] border border-[#333] text-white p-4 rounded-xl mb-6 focus:border-emerald-500 focus:outline-none transition-colors"
                        onChange={(e) => {
                            const ch = chapters.find(c => c.id === parseInt(e.target.value));
                            setSelectedChapter(ch);
                        }}
                        value={selectedChapter?.id || ""}
                    >
                        <option value="" disabled>Sélectionner une sourate...</option>
                        {chapters.map(chapter => (
                            <option key={chapter.id} value={chapter.id}>
                                {chapter.id}. {chapter.name_simple} ({chapter.name_arabic})
                            </option>
                        ))}
                    </select>

                    {loading && <p className="text-gray-400 text-sm">Chargement des versets...</p>}

                    {selectedChapter && verses.length > 0 && (
                        <div className="text-center mt-6">
                            <button 
                                onClick={startQuiz}
                                disabled={!recognitionRef.current}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-8 rounded-xl inline-flex items-center gap-3 transition-colors disabled:opacity-50"
                            >
                                <PlayCircle size={24} /> Commencer le test
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Active Quiz Area */}
            {quizStarted && verses.length > 0 && (
                <div className="space-y-6">
                    {/* Progress & Header */}
                    <div className="bg-[#0a0a0a] border border-[#333] rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-emerald-400 font-bold text-sm tracking-wider uppercase mb-1">
                                Sourate {selectedChapter.name_simple}
                            </p>
                            <p className="text-gray-400 text-sm">
                                Verset {verses[currentVerseIndex].verse_key.split(':')[1]} / {verses.length}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={stopQuiz}
                                className="bg-[#111] border border-[#333] hover:border-red-500/50 hover:bg-red-950/20 text-gray-400 hover:text-red-400 px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
                            >
                                <StopCircle size={16} /> Arrêter
                            </button>
                            <button 
                                onClick={nextVerse}
                                className="bg-[#111] border border-[#333] hover:border-gray-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
                            >
                                Passer <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Recitation Area */}
                    <div className="bg-[#0a0a0a] border border-[#333] rounded-3xl p-4 sm:p-8 relative overflow-hidden flex flex-col">
                        {/* Audio Wave Animation Effect (Pure CSS) */}
                        {listening && (
                            <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center z-0">
                                <div className="w-72 h-72 sm:w-96 sm:h-96 bg-emerald-500 rounded-full animate-ping"></div>
                            </div>
                        )}

                        <div className="mb-6 max-h-[65vh] md:max-h-[60vh] overflow-y-auto pr-2 relative z-10 space-y-4 sm:space-y-6 scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent">
                            {verses.map((verse, idx) => {
                                const isCompleted = idx < currentVerseIndex;
                                const isActive = idx === currentVerseIndex;
                                const isFuture = idx > currentVerseIndex;

                                return (
                                    <div 
                                        key={verse.id} 
                                        className={`p-4 sm:p-6 rounded-2xl border transition-all duration-500 ${
                                            isActive 
                                                ? 'bg-[#111] border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                                                : isCompleted 
                                                    ? 'bg-emerald-950/10 border-[#222] opacity-70' 
                                                    : 'bg-[#0a0a0a] border-[#222] opacity-50'
                                        }`}
                                        ref={isActive ? (el) => { if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }) } : null}
                                    >
                                        <div className="flex justify-between items-start mb-3 sm:mb-4">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-md ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#222] text-gray-500'}`}>
                                                Verset {verse.verse_key.split(':')[1]}
                                            </span>
                                            {isCompleted && <CheckCircle2 size={16} className="text-emerald-500" />}
                                        </div>

                                        <div className="min-h-[2.5rem] sm:min-h-[3rem] transition-all duration-700 ease-in-out" dir="rtl">
                                            {isCompleted ? (
                                                <p className="text-xl sm:text-3xl font-arabic text-emerald-50 leading-loose transition-all duration-500">
                                                    {verse.text_uthmani}
                                                </p>
                                            ) : isActive && showHint ? (
                                                <p className="text-xl sm:text-3xl font-arabic text-emerald-400 leading-loose drop-shadow-[0_0_12px_rgba(16,185,129,0.8)] transform scale-[1.02] transition-all duration-500">
                                                    {verse.text_uthmani}
                                                </p>
                                            ) : (
                                                <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-start transition-all duration-300">
                                                    {verse.text_uthmani.split(' ').map((_, i) => (
                                                        <span key={i} className={`h-2 sm:h-3 bg-[#222] rounded-full inline-block ${isActive ? 'animate-pulse bg-[#333]' : ''}`} style={{ width: `${Math.max(1.5, Math.random() * 3 + 1.5)}rem` }}></span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-center mb-6">
                            <button 
                                onClick={toggleListening}
                                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
                                    listening 
                                        ? 'bg-red-500/10 border-2 border-red-500 text-red-500' 
                                        : 'bg-emerald-500 text-white hover:bg-emerald-400 hover:scale-105'
                                }`}
                            >
                                {listening ? <MicOff size={28} className="sm:w-8 sm:h-8" /> : <Mic size={28} className="sm:w-8 sm:h-8" />}
                            </button>
                        </div>

                        {/* Live Transcript & Feedback */}
                        <div className="bg-[#111] border border-[#222] rounded-2xl p-4 min-h-[5rem] flex flex-col justify-center">
                            {transcript ? (
                                <p className="text-gray-300 font-arabic text-xl" dir="rtl">{transcript}</p>
                            ) : (
                                <p className="text-gray-600 text-sm italic">{feedback}</p>
                            )}
                        </div>
                        
                        {transcript && <p className="text-emerald-500/80 text-xs mt-3 font-semibold">{feedback}</p>}

                        <button 
                            onClick={() => setShowHint(!showHint)}
                            className="mt-6 text-gray-500 hover:text-gray-300 text-sm font-semibold flex items-center justify-center gap-2 mx-auto transition-colors"
                        >
                            <HelpCircle size={16} /> {showHint ? 'Masquer le verset' : 'Afficher un indice (voir le verset)'}
                        </button>
                    </div>
                </div>
            )}

            {/* Completion Screen */}
            {completed && (
                <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-3xl p-10 text-center shadow-2xl">
                    <CheckCircle2 size={64} className="text-emerald-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-white mb-4">Macha'Allah !</h2>
                    <p className="text-gray-300 mb-8 max-w-md mx-auto">
                        Vous avez terminé de réciter la sourate {selectedChapter?.name_simple}. Qu'Allah accepte votre effort et illumine votre cœur par le Coran.
                    </p>
                    <button 
                        onClick={() => {
                            setCompleted(false);
                            setSelectedChapter(null);
                        }}
                        className="bg-[#111] border border-[#333] hover:border-gray-500 text-white font-bold py-3 px-6 rounded-xl inline-flex items-center gap-3 transition-colors"
                    >
                        <RefreshCw size={20} /> Tester une autre sourate
                    </button>
                </div>
            )}
        </div>
    );
}
