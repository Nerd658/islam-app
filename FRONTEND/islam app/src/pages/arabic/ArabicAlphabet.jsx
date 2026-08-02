import React, { useState } from 'react';
import arabicData from '../../data/arabic_learning.json';
import { BookOpen, Volume2, Sparkles, Award, Layers, VolumeX } from 'lucide-react';

export default function ArabicAlphabet() {
    const [level, setLevel] = useState('forms'); // 'forms' | 'short_vowels' | 'long_vowels' | 'tanween' | 'shaddah'
    const [selectedLetter, setSelectedLetter] = useState(arabicData.alphabet[0]);

    const playAudio = (text) => {
        if (!text) return;
        try {
            const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=ar&client=tw-ob`;
            const audio = new Audio();
            audio.src = ttsUrl;
            audio.volume = 1.0;
            
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch((err) => {
                    console.warn("Audio stream error, falling back to SpeechSynthesis:", err);
                    if ('speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                        const utterance = new SpeechSynthesisUtterance(text);
                        const voices = window.speechSynthesis.getVoices();
                        const arVoice = voices.find(v => v.lang.startsWith('ar'));
                        if (arVoice) utterance.voice = arVoice;
                        utterance.lang = 'ar-SA';
                        utterance.volume = 1.0;
                        utterance.rate = 0.75;
                        window.speechSynthesis.speak(utterance);
                    }
                });
            }
        } catch (e) {
            console.error("Audio error:", e);
        }
    };

    // Helper to get vocalized forms of selected letter
    const baseChar = selectedLetter.letter.replace(/[\u064B-\u0652]/g, '');

    const levels = [
        { id: 'forms', label: '1. Lettres & Formes', desc: 'Formes d\'écriture (Isolée, Début, Milieu, Fin)' },
        { id: 'short_vowels', label: '2. Voyelles Courtes', desc: 'Fatha ( َ ), Kasra ( ِ ), Damma ( ُ ), Sukun ( ْ )' },
        { id: 'long_vowels', label: '3. Voyelles Longues', desc: 'Madd Alif ( َا ), Madd Ya ( ِي ), Madd Waw ( ُو )' },
        { id: 'tanween', label: '4. Le Tanween', desc: 'Fathatan ( ً ), Kasratan ( ٍ ), Dammatan ( ٌ )' },
        { id: 'shaddah', label: '5. La Shaddah & Solaires', desc: 'Redoublement ( ّ ) & Lettres Solaires/Lunaires' }
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
                    Progression pédagogique en 5 niveaux : des lettres aux voyelles, prolongations et règles de lecture.
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

            {/* Main Learning Workspace */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Left Side: 28 Alphabet Selector */}
                <div className="bg-[#0a0a0a] p-4 rounded-2xl border border-[#333] shadow-xl">
                    <div className="flex items-center justify-between mb-3 px-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sélectionner une lettre</span>
                        <span className="text-[10px] text-emerald-400 font-mono">28 Lettres</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 max-h-[500px] overflow-y-auto custom-scrollbar p-1">
                        {arabicData.alphabet.map(letter => {
                            const isSelected = selectedLetter.id === letter.id;
                            return (
                                <button
                                    key={letter.id}
                                    onClick={() => {
                                        setSelectedLetter(letter);
                                        playAudio(letter.example);
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

                {/* Right Side: Interactive Level Content */}
                <div className="md:col-span-2 bg-[#0a0a0a] border border-[#333] p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col justify-between">
                    
                    {/* Header Info for Selected Letter */}
                    <div className="flex items-center justify-between border-b border-[#222] pb-4 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-[#111] border border-[#444] flex items-center justify-center shadow-inner">
                                <span className="text-4xl font-arabic text-white font-bold">{selectedLetter.letter}</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">{selectedLetter.name}</h3>
                                <p className="text-xs text-emerald-400 font-mono">Phonétique : {selectedLetter.phonetic}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => playAudio(selectedLetter.example)}
                            className="p-3 bg-[#111] hover:bg-[#222] border border-[#333] text-emerald-400 hover:text-emerald-300 rounded-xl transition-all flex items-center gap-2 text-xs font-semibold"
                            title="Écouter la lettre"
                        >
                            <Volume2 size={18} />
                            <span className="hidden sm:inline">Écouter</span>
                        </button>
                    </div>

                    {/* CONTENT LEVEL 1: FORMS */}
                    {level === 'forms' && (
                        <div>
                            <h4 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
                                <Layers size={16} className="text-gray-400" />
                                Formes d'écriture selon la position dans le mot
                            </h4>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                                <div className="bg-[#111] border border-[#222] p-4 rounded-xl text-center">
                                    <span className="text-[10px] text-gray-500 font-bold uppercase block mb-2">Isolée</span>
                                    <span className="text-3xl font-arabic text-white font-bold block mb-1">{selectedLetter.isolated}</span>
                                    <span className="text-[10px] text-gray-400">Seule</span>
                                </div>
                                <div className="bg-[#111] border border-[#222] p-4 rounded-xl text-center">
                                    <span className="text-[10px] text-gray-500 font-bold uppercase block mb-2">Début</span>
                                    <span className="text-3xl font-arabic text-white font-bold block mb-1">{selectedLetter.initial}</span>
                                    <span className="text-[10px] text-gray-400">Attachée à droite</span>
                                </div>
                                <div className="bg-[#111] border border-[#222] p-4 rounded-xl text-center">
                                    <span className="text-[10px] text-gray-500 font-bold uppercase block mb-2">Milieu</span>
                                    <span className="text-3xl font-arabic text-white font-bold block mb-1">{selectedLetter.medial}</span>
                                    <span className="text-[10px] text-gray-400">Attachée des 2 côtés</span>
                                </div>
                                <div className="bg-[#111] border border-[#222] p-4 rounded-xl text-center">
                                    <span className="text-[10px] text-gray-500 font-bold uppercase block mb-2">Fin</span>
                                    <span className="text-3xl font-arabic text-white font-bold block mb-1">{selectedLetter.final}</span>
                                    <span className="text-[10px] text-gray-400">Attachée à gauche</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CONTENT LEVEL 2: SHORT VOWELS */}
                    {level === 'short_vowels' && (
                        <div>
                            <h4 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
                                <Sparkles size={16} className="text-emerald-400" />
                                Déclinaison avec les Voyelles Courtes (*Al-Harakat*)
                            </h4>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                                {[
                                    { name: 'Fatha ( َ )', sign: 'َ', sound: 'A', char: `${baseChar}َ` },
                                    { name: 'Kasra ( ِ )', sign: 'ِ', sound: 'I', char: `${baseChar}ِ` },
                                    { name: 'Damma ( ُ )', sign: 'ُ', sound: 'OU', char: `${baseChar}ُ` },
                                    { name: 'Sukun ( ْ )', sign: 'ْ', sound: 'Arrêt (Sukun)', char: `${baseChar}ْ` }
                                ].map((v, i) => (
                                    <button
                                        key={i}
                                        onClick={() => playAudio(v.char)}
                                        className="bg-[#111] hover:bg-[#222] border border-[#222] hover:border-gray-500 p-4 rounded-xl text-center transition-all group cursor-pointer"
                                    >
                                        <span className="text-[10px] text-emerald-400 font-bold block mb-1">{v.name}</span>
                                        <span className="text-4xl font-arabic text-white font-bold block mb-2 group-hover:scale-110 transition-transform">{v.char}</span>
                                        <span className="text-[11px] text-gray-400 font-mono">Son : {v.sound}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CONTENT LEVEL 3: LONG VOWELS */}
                    {level === 'long_vowels' && (
                        <div>
                            <h4 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
                                <Sparkles size={16} className="text-rose-400" />
                                Prolongation des Voyelles (*Al-Madd*)
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                                {[
                                    { name: 'Madd Alif ( َا )', sound: 'AA (Prolongé)', char: `${baseChar}َا` },
                                    { name: 'Madd Ya ( ِي )', sound: 'II (Prolongé)', char: `${baseChar}ِي` },
                                    { name: 'Madd Waw ( ُو )', sound: 'OUU (Prolongé)', char: `${baseChar}ُو` }
                                ].map((v, i) => (
                                    <button
                                        key={i}
                                        onClick={() => playAudio(v.char)}
                                        className="bg-[#111] hover:bg-[#222] border border-[#222] hover:border-gray-500 p-5 rounded-xl text-center transition-all group cursor-pointer"
                                    >
                                        <span className="text-xs text-rose-400 font-bold block mb-1">{v.name}</span>
                                        <span className="text-4xl font-arabic text-white font-bold block mb-2 group-hover:scale-110 transition-transform">{v.char}</span>
                                        <span className="text-xs text-gray-400 font-mono">{v.sound}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CONTENT LEVEL 4: TANWEEN */}
                    {level === 'tanween' && (
                        <div>
                            <h4 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
                                <Sparkles size={16} className="text-purple-400" />
                                Nounisation des fin de mots (*Al-Tanween*)
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                                {[
                                    { name: 'Fathatan ( ً )', sound: 'AN', char: `${baseChar}ً` },
                                    { name: 'Kasratan ( ٍ )', sound: 'IN', char: `${baseChar}ٍ` },
                                    { name: 'Dammatan ( ٌ )', sound: 'OUN', char: `${baseChar}ٌ` }
                                ].map((v, i) => (
                                    <button
                                        key={i}
                                        onClick={() => playAudio(v.char)}
                                        className="bg-[#111] hover:bg-[#222] border border-[#222] hover:border-gray-500 p-5 rounded-xl text-center transition-all group cursor-pointer"
                                    >
                                        <span className="text-xs text-purple-400 font-bold block mb-1">{v.name}</span>
                                        <span className="text-4xl font-arabic text-white font-bold block mb-2 group-hover:scale-110 transition-transform">{v.char}</span>
                                        <span className="text-xs text-gray-400 font-mono">Son : {v.sound}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CONTENT LEVEL 5: SHADDAH */}
                    {level === 'shaddah' && (
                        <div>
                            <h4 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
                                <Sparkles size={16} className="text-amber-400" />
                                Redoublement d'intensité (*Al-Shaddah  ّ *)
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                                {[
                                    { name: 'Shaddah + Fatha', sound: 'Doublement A', char: `${baseChar}َّ` },
                                    { name: 'Shaddah + Kasra', sound: 'Doublement I', char: `${baseChar}ِّ` },
                                    { name: 'Shaddah + Damma', sound: 'Doublement OU', char: `${baseChar}ُّ` }
                                ].map((v, i) => (
                                    <button
                                        key={i}
                                        onClick={() => playAudio(v.char)}
                                        className="bg-[#111] hover:bg-[#222] border border-[#222] hover:border-gray-500 p-5 rounded-xl text-center transition-all group cursor-pointer"
                                    >
                                        <span className="text-xs text-amber-400 font-bold block mb-1">{v.name}</span>
                                        <span className="text-4xl font-arabic text-white font-bold block mb-2 group-hover:scale-110 transition-transform">{v.char}</span>
                                        <span className="text-xs text-gray-400 font-mono">{v.sound}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Footer Example Card */}
                    <div className="bg-[#111] p-4 rounded-xl border border-[#222] flex items-center justify-between">
                        <div>
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Exemple dans le Coran</span>
                            <span className="text-xs text-gray-400 italic">{selectedLetter.exampleFr}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-arabic text-white font-bold">{selectedLetter.example}</span>
                            <button
                                onClick={() => playAudio(selectedLetter.example)}
                                className="p-2 bg-[#222] hover:bg-[#333] text-white rounded-lg transition-colors"
                            >
                                <Volume2 size={16} />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
