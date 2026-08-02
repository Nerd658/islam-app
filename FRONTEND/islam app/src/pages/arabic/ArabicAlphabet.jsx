import React, { useState, useRef, useEffect } from 'react';
import arabicData from '../../data/arabic_learning.json';
import { playArabicAudio } from '../../utils/audio';
import { BookOpen, Volume2, Sparkles, Layers, Sun, Moon, Edit3, Eraser, VolumeX, Split, Info } from 'lucide-react';

export default function ArabicAlphabet() {
    const [level, setLevel] = useState('forms'); // 'forms' | 'short_vowels' | 'long_vowels' | 'tanween' | 'shaddah' | 'compare'
    const [selectedLetter, setSelectedLetter] = useState(arabicData.alphabet[0]);

    // Canvas State for Drawing Practice
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const playAudio = (text, directAudioUrl = null, fallback = "") => {
        playArabicAudio(text, directAudioUrl, fallback);
    };

    // Canvas drawing helpers
    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        ctx.lineTo(x, y);
        ctx.strokeStyle = '#34d399'; // Emerald color
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    // Clear canvas when letter changes
    useEffect(() => {
        clearCanvas();
    }, [selectedLetter]);

    const baseChar = selectedLetter.letter.replace(/[\u064B-\u0652]/g, '');

    const levels = [
        { id: 'forms', label: '1. Lettres & Formes' },
        { id: 'short_vowels', label: '2. Voyelles Courtes' },
        { id: 'long_vowels', label: '3. Voyelles Longues' },
        { id: 'tanween', label: '4. Le Tanween' },
        { id: 'shaddah', label: '5. La Shaddah' },
        { id: 'compare', label: '6. Comparateur de Sons' }
    ];

    return (
        <div className="w-full max-w-5xl mx-auto py-6 px-4 flex flex-col min-h-screen">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 flex items-center justify-center gap-3">
                    <BookOpen className="text-gray-400" size={32} />
                    Méthode d'Apprentissage de l'Arabe
                </h2>
                <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
                    Progression pédagogique en 6 étapes : lettres, voyelles, makharij, tracé interactif et comparaison sonore.
                </p>
            </div>

            {/* Level Selector Tabs */}
            <div className="bg-[#0a0a0a] border border-[#333] p-1.5 rounded-2xl mb-8 shadow-xl flex items-center justify-center gap-2 overflow-x-auto custom-scrollbar">
                {levels.map(lvl => (
                    <button
                        key={lvl.id}
                        onClick={() => setLevel(lvl.id)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                            level === lvl.id
                                ? 'bg-white text-black border-white shadow-md font-bold'
                                : 'bg-[#111] text-gray-400 border-[#333] hover:text-white'
                        }`}
                    >
                        {lvl.label}
                    </button>
                ))}
            </div>

            {/* IF LEVEL 6: COMPARE CONFUSED PAIRS */}
            {level === 'compare' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {arabicData.confusedPairs.map(pair => (
                        <div key={pair.id} className="bg-[#0a0a0a] border border-[#333] p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Split size={16} className="text-emerald-400" />
                                    Paire N° {pair.id} : Distinction Sonore
                                </h3>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <button
                                        onClick={() => playAudio(pair.l1)}
                                        className="bg-[#111] hover:bg-[#222] border border-[#333] p-4 rounded-xl text-center transition-all group"
                                    >
                                        <span className="text-4xl font-arabic text-white font-bold block mb-1 group-hover:scale-110 transition-transform">{pair.l1}</span>
                                        <span className="text-xs font-semibold text-emerald-400 block">{pair.name1}</span>
                                        <span className="text-[10px] text-gray-500 flex items-center justify-center gap-1 mt-1">
                                            <Volume2 size={12} /> Écouter
                                        </span>
                                    </button>

                                    <button
                                        onClick={() => playAudio(pair.l2)}
                                        className="bg-[#111] hover:bg-[#222] border border-[#333] p-4 rounded-xl text-center transition-all group"
                                    >
                                        <span className="text-4xl font-arabic text-white font-bold block mb-1 group-hover:scale-110 transition-transform">{pair.l2}</span>
                                        <span className="text-xs font-semibold text-rose-400 block">{pair.name2}</span>
                                        <span className="text-[10px] text-gray-500 flex items-center justify-center gap-1 mt-1">
                                            <Volume2 size={12} /> Écouter
                                        </span>
                                    </button>
                                </div>

                                <div className="bg-[#111] p-3.5 rounded-xl border border-[#222]">
                                    <p className="text-xs text-gray-300 leading-relaxed font-sans">{pair.diff}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* STANDARD ALPHABET WORKSPACE FOR LEVELS 1-5 */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Left Side: 28 Alphabet Selector */}
                    <div className="bg-[#0a0a0a] p-4 rounded-2xl border border-[#333] shadow-xl">
                        <div className="flex items-center justify-between mb-3 px-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sélectionner une lettre</span>
                            <span className="text-[10px] text-emerald-400 font-mono">28 Lettres</span>
                        </div>

                        <div className="grid grid-cols-4 gap-2 max-h-[520px] overflow-y-auto custom-scrollbar p-1">
                            {arabicData.alphabet.map(letter => {
                                const isSelected = selectedLetter.id === letter.id;
                                return (
                                    <button
                                        key={letter.id}
                                        onClick={() => {
                                            setSelectedLetter(letter);
                                            playAudio(letter.nameAr || letter.letter, null, letter.name);
                                        }}
                                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                                            isSelected 
                                                ? 'bg-white text-black border-white shadow-lg scale-105' 
                                                : 'bg-[#111] hover:bg-[#222] text-white border-[#333] hover:border-gray-500'
                                        }`}
                                    >
                                        <span className="text-2xl font-arabic font-bold mb-0.5">{letter.letter}</span>
                                        <span className={`text-[9px] font-bold ${isSelected ? 'text-black' : 'text-gray-400'}`}>
                                            {letter.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Side: Interactive Level Content & Drawing Workshop */}
                    <div className="md:col-span-2 bg-[#0a0a0a] border border-[#333] p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col justify-between space-y-6">
                        
                        {/* Header Info with Badges for Solar/Lunar & Makhraj */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#222] pb-4 gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-[#111] border border-[#444] flex items-center justify-center shadow-inner">
                                    <span className="text-4xl font-arabic text-white font-bold">{selectedLetter.letter}</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-2xl font-bold text-white">{selectedLetter.name} ({selectedLetter.nameAr})</h3>
                                        {selectedLetter.type === 'solar' ? (
                                            <span className="bg-amber-950/80 border border-amber-700 text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                                                <Sun size={11} /> Solaire
                                            </span>
                                        ) : (
                                            <span className="bg-indigo-950/80 border border-indigo-700 text-indigo-300 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                                                <Moon size={11} /> Lunaire
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-emerald-400 font-mono">Phonétique : {selectedLetter.phonetic}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => playAudio(selectedLetter.nameAr || selectedLetter.letter, null, selectedLetter.name)}
                                className="p-3 bg-[#111] hover:bg-[#222] border border-[#333] text-emerald-400 hover:text-emerald-300 rounded-xl transition-all flex items-center gap-2 text-xs font-semibold"
                                title="Écouter la lettre"
                            >
                                <Volume2 size={18} />
                                <span>Écouter</span>
                            </button>
                        </div>

                        {/* MAKHRAJ POINT OF ARTICULATION BADGE */}
                        <div className="bg-[#111] p-3.5 rounded-xl border border-[#222] flex items-center gap-3">
                            <Info size={18} className="text-blue-400 flex-shrink-0" />
                            <div className="text-xs">
                                <span className="font-bold text-gray-300 block mb-0.5">Point d'articulation (Makhraj) :</span>
                                <span className="text-gray-400 font-sans">{selectedLetter.makhraj}</span>
                            </div>
                        </div>

                        {/* QURANIC EXAMPLE WITH AUTHENTIC HUMAN RECITATION */}
                        <div className="bg-[#111] p-3.5 rounded-xl border border-[#222] flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-arabic text-emerald-400 font-bold">{selectedLetter.example}</span>
                                <div className="text-xs">
                                    <span className="font-bold text-gray-200 block">{selectedLetter.exampleFr}</span>
                                    <span className="text-[10px] text-gray-500 font-mono">Exemple du Coran</span>
                                </div>
                            </div>
                            <button
                                onClick={() => playAudio(selectedLetter.example, selectedLetter.exampleAudio, selectedLetter.exampleFr)}
                                className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                                title="Écouter le mot coranique récité par un Qari humain"
                            >
                                <Volume2 size={14} />
                                <span>Écouter le mot (Récitation Humaine)</span>
                            </button>
                        </div>

                        {/* CONTENT LEVEL 1: FORMS */}
                        {level === 'forms' && (
                            <div>
                                <h4 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                                    <Layers size={16} className="text-gray-400" />
                                    Formes d'écriture selon la position
                                </h4>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div className="bg-[#111] border border-[#222] p-3 rounded-xl text-center">
                                        <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Isolée</span>
                                        <span className="text-3xl font-arabic text-white font-bold block mb-1">{selectedLetter.isolated}</span>
                                    </div>
                                    <div className="bg-[#111] border border-[#222] p-3 rounded-xl text-center">
                                        <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Début</span>
                                        <span className="text-3xl font-arabic text-white font-bold block mb-1">{selectedLetter.initial}</span>
                                    </div>
                                    <div className="bg-[#111] border border-[#222] p-3 rounded-xl text-center">
                                        <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Milieu</span>
                                        <span className="text-3xl font-arabic text-white font-bold block mb-1">{selectedLetter.medial}</span>
                                    </div>
                                    <div className="bg-[#111] border border-[#222] p-3 rounded-xl text-center">
                                        <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Fin</span>
                                        <span className="text-3xl font-arabic text-white font-bold block mb-1">{selectedLetter.final}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CONTENT LEVEL 2: SHORT VOWELS */}
                        {level === 'short_vowels' && (
                            <div>
                                <h4 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                                    <Sparkles size={16} className="text-emerald-400" />
                                    Voyelles Courtes (*Al-Harakat*)
                                </h4>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {[
                                        { name: 'Fatha ( َ )', sound: 'A', char: `${baseChar}َ` },
                                        { name: 'Kasra ( ِ )', sound: 'I', char: `${baseChar}ِ` },
                                        { name: 'Damma ( ُ )', sound: 'OU', char: `${baseChar}ُ` },
                                        { name: 'Sukun ( ْ )', sound: 'Arrêt', char: `${baseChar}ْ` }
                                    ].map((v, i) => (
                                        <button
                                            key={i}
                                            onClick={() => playAudio(v.char)}
                                            className="bg-[#111] hover:bg-[#222] border border-[#222] hover:border-gray-500 p-3 rounded-xl text-center transition-all group"
                                        >
                                            <span className="text-[10px] text-emerald-400 font-bold block mb-1">{v.name}</span>
                                            <span className="text-3xl font-arabic text-white font-bold block mb-1 group-hover:scale-110 transition-transform">{v.char}</span>
                                            <span className="text-[10px] text-gray-400 font-mono">Son : {v.sound}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CONTENT LEVEL 3: LONG VOWELS */}
                        {level === 'long_vowels' && (
                            <div>
                                <h4 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                                    <Sparkles size={16} className="text-rose-400" />
                                    Voyelles Longues (*Al-Madd*)
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {[
                                        { name: 'Madd Alif ( َا )', sound: 'AA (Prolongé)', char: `${baseChar}َا` },
                                        { name: 'Madd Ya ( ِي )', sound: 'II (Prolongé)', char: `${baseChar}ِي` },
                                        { name: 'Madd Waw ( ُو )', sound: 'OUU (Prolongé)', char: `${baseChar}ُو` }
                                    ].map((v, i) => (
                                        <button
                                            key={i}
                                            onClick={() => playAudio(v.char)}
                                            className="bg-[#111] hover:bg-[#222] border border-[#222] hover:border-gray-500 p-4 rounded-xl text-center transition-all group"
                                        >
                                            <span className="text-xs text-rose-400 font-bold block mb-1">{v.name}</span>
                                            <span className="text-3xl font-arabic text-white font-bold block mb-1 group-hover:scale-110 transition-transform">{v.char}</span>
                                            <span className="text-xs text-gray-400 font-mono">{v.sound}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CONTENT LEVEL 4: TANWEEN */}
                        {level === 'tanween' && (
                            <div>
                                <h4 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                                    <Sparkles size={16} className="text-purple-400" />
                                    Le Tanween (*Al-Tanween*)
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {[
                                        { name: 'Fathatan ( ً )', sound: 'AN', char: `${baseChar}ً` },
                                        { name: 'Kasratan ( ٍ )', sound: 'IN', char: `${baseChar}ٍ` },
                                        { name: 'Dammatan ( ٌ )', sound: 'OUN', char: `${baseChar}ٌ` }
                                    ].map((v, i) => (
                                        <button
                                            key={i}
                                            onClick={() => playAudio(v.char)}
                                            className="bg-[#111] hover:bg-[#222] border border-[#222] hover:border-gray-500 p-4 rounded-xl text-center transition-all group"
                                        >
                                            <span className="text-xs text-purple-400 font-bold block mb-1">{v.name}</span>
                                            <span className="text-3xl font-arabic text-white font-bold block mb-1 group-hover:scale-110 transition-transform">{v.char}</span>
                                            <span className="text-xs text-gray-400 font-mono">Son : {v.sound}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CONTENT LEVEL 5: SHADDAH */}
                        {level === 'shaddah' && (
                            <div>
                                <h4 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                                    <Sparkles size={16} className="text-amber-400" />
                                    La Shaddah (*Al-Shaddah  ّ *)
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {[
                                        { name: 'Shaddah + Fatha', sound: 'Doublement A', char: `${baseChar}َّ` },
                                        { name: 'Shaddah + Kasra', sound: 'Doublement I', char: `${baseChar}ِّ` },
                                        { name: 'Shaddah + Damma', sound: 'Doublement OU', char: `${baseChar}ُّ` }
                                    ].map((v, i) => (
                                        <button
                                            key={i}
                                            onClick={() => playAudio(v.char)}
                                            className="bg-[#111] hover:bg-[#222] border border-[#222] hover:border-gray-500 p-4 rounded-xl text-center transition-all group"
                                        >
                                            <span className="text-xs text-amber-400 font-bold block mb-1">{v.name}</span>
                                            <span className="text-3xl font-arabic text-white font-bold block mb-1 group-hover:scale-110 transition-transform">{v.char}</span>
                                            <span className="text-xs text-gray-400 font-mono">{v.sound}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* INTERACTIVE DRAWING WORKSHOP */}
                        <div className="bg-[#111] p-4 rounded-xl border border-[#222]">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                                    <Edit3 size={14} className="text-emerald-400" />
                                    Atelier d'Écriture : Tracé de {selectedLetter.name} ({selectedLetter.letter})
                                </span>
                                <button
                                    onClick={clearCanvas}
                                    className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 bg-[#222] px-2 py-1 rounded-md transition-colors"
                                >
                                    <Eraser size={12} /> Effacer
                                </button>
                            </div>

                            <div className="relative w-full h-24 bg-black/60 rounded-lg border border-[#333] overflow-hidden">
                                {/* Watermark Letter Guide */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-20">
                                    <span className="text-7xl font-arabic text-white">{selectedLetter.letter}</span>
                                </div>

                                <canvas
                                    ref={canvasRef}
                                    width={500}
                                    height={100}
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                    onTouchStart={startDrawing}
                                    onTouchMove={draw}
                                    onTouchEnd={stopDrawing}
                                    className="w-full h-full cursor-crosshair touch-none"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
