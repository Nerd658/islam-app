import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { PlayCircle, PauseCircle, BookOpen, ChevronLeft, Search } from 'lucide-react';

export default function QuranReader() {
    const [chapters, setChapters] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [verses, setVerses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Audio States
    const [audioFiles, setAudioFiles] = useState({});
    const [playingVerse, setPlayingVerse] = useState(null);
    const audioRef = useRef(null);

    // Fetch the list of Surahs (Chapters)
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_QURAN_API_URL}/api/v4/chapters?language=fr`)
            .then(res => setChapters(res.data.chapters))
            .catch(err => console.error("Erreur lors du chargement des sourates:", err));
            
        // Initialize Audio element
        if (!audioRef.current) {
            audioRef.current = new Audio();
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
        };
    }, []);

    // Handle Audio End to play next verse automatically
    useEffect(() => {
        if (!audioRef.current) return;
        
        const handleAudioEnd = () => {
            if (!playingVerse) return;
            const currentIdx = verses.findIndex(v => v.verse_key === playingVerse);
            if (currentIdx !== -1 && currentIdx + 1 < verses.length) {
                const nextVerseKey = verses[currentIdx + 1].verse_key;
                playVerse(nextVerseKey);
            } else {
                setPlayingVerse(null);
            }
        };

        audioRef.current.addEventListener('ended', handleAudioEnd);
        return () => {
            audioRef.current.removeEventListener('ended', handleAudioEnd);
        };
    }, [playingVerse, verses]);

    // Fetch the Arabic verses of a specific Surah + Audio
    const fetchVerses = async (chapterId) => {
        setLoading(true);
        setSelectedChapter(chapters.find(c => c.id === chapterId));
        setPlayingVerse(null);
        if (audioRef.current) {
            audioRef.current.pause();
        }
        
        try {
            const [resVerses, resAudio] = await Promise.all([
                axios.get(`${import.meta.env.VITE_QURAN_API_URL}/api/v4/quran/verses/uthmani?chapter_number=${chapterId}`),
                axios.get(`${import.meta.env.VITE_QURAN_API_URL}/api/v4/quran/recitations/7?chapter_number=${chapterId}`) // 7 = Mishari
            ]);
            
            setVerses(resVerses.data.verses);
            
            // Map audio URLs by verse_key
            const audioMap = {};
            resAudio.data.audio_files.forEach(a => {
                audioMap[a.verse_key] = a.url.startsWith('http') ? a.url : `https://verses.quran.com/${a.url}`;
            });
            setAudioFiles(audioMap);
            
        } catch (err) {
            console.error("Erreur lors du chargement des versets/audio:", err);
        } finally {
            setLoading(false);
        }
    };

    const playVerse = (verseKey) => {
        if (!audioFiles[verseKey] || !audioRef.current) return;
        
        if (playingVerse === verseKey) {
            audioRef.current.pause();
            setPlayingVerse(null);
        } else {
            audioRef.current.src = audioFiles[verseKey];
            audioRef.current.play();
            setPlayingVerse(verseKey);
        }
    };

    const filteredChapters = chapters.filter(chapter => 
        chapter.name_simple.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chapter.name_arabic.includes(searchQuery) ||
        (chapter.translated_name && chapter.translated_name.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        chapter.id.toString() === searchQuery
    );

    return (
        <div className="w-full max-w-5xl mx-auto mt-16 mb-24 px-4">
            <h2 className="text-3xl font-bold text-center mb-8 text-white flex items-center justify-center gap-3">
                <BookOpen className="text-gray-400" size={28} />
                Le Noble Coran
            </h2>
            
            {!selectedChapter ? (
                <>
                    <div className="max-w-md mx-auto mb-10 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                        <input 
                            type="text" 
                            placeholder="Rechercher une sourate (Nom, Numéro...)" 
                            className="w-full bg-[#111] border border-[#333] text-white py-3 pl-12 pr-4 rounded-full outline-none focus:border-gray-500 transition-colors shadow-lg"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    {filteredChapters.length === 0 && chapters.length > 0 ? (
                        <div className="flex justify-center items-center h-48">
                            <p className="text-gray-500">Aucune sourate trouvée pour "{searchQuery}"</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto p-4 bg-[#0a0a0a] rounded-2xl border border-[#333] custom-scrollbar">
                            {filteredChapters.map(chapter => (
                                <button 
                                    key={chapter.id}
                                    onClick={() => fetchVerses(chapter.id)}
                                    className="flex flex-col items-center justify-center p-4 bg-[#111] hover:bg-[#222] border border-[#333] hover:border-gray-500 rounded-xl transition-all shadow-sm"
                                >
                                    <span className="text-gray-500 font-bold mb-1 text-xs">N° {chapter.id}</span>
                                    <h3 className="font-bold text-lg mb-1 text-white">{chapter.name_simple}</h3>
                                    <p className="text-2xl text-white font-arabic">{chapter.name_arabic}</p>
                                </button>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-[#0a0a0a] p-6 sm:p-10 rounded-2xl relative border border-[#333]">
                    <button 
                        onClick={() => setSelectedChapter(null)}
                        className="absolute top-6 left-6 bg-[#222] hover:bg-[#333] border border-[#444] px-4 py-2 rounded-lg text-sm font-medium transition-all text-white flex items-center gap-2"
                    >
                        <ChevronLeft size={16} /> Retour
                    </button>
                    <h3 className="text-3xl sm:text-4xl font-bold text-center mb-10 pt-12 text-white font-arabic">
                        {selectedChapter.name_arabic}
                        <span className="block text-xl text-gray-500 mt-2 font-sans">Sourate {selectedChapter.name_simple}</span>
                    </h3>
                    
                    {loading ? (
                        <div className="flex justify-center items-center h-48">
                            <p className="text-xl text-gray-300">Chargement des versets...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-4" dir="rtl">
                            {verses.map(v => (
                                <div key={v.id} className={`p-4 rounded-xl transition-all duration-300 ${playingVerse === v.verse_key ? 'bg-emerald-950/30 border-r-4 border-emerald-500' : 'hover:bg-[#111] border-r-4 border-transparent'}`}>
                                    <div className="flex items-center gap-4">
                                        <button 
                                            onClick={() => playVerse(v.verse_key)}
                                            className={`flex-shrink-0 transition-all duration-300 ${playingVerse === v.verse_key ? 'text-emerald-500 scale-110' : 'text-gray-600 hover:text-gray-300'}`}
                                            title="Écouter le verset"
                                        >
                                            {playingVerse === v.verse_key ? <PauseCircle size={28} /> : <PlayCircle size={28} />}
                                        </button>
                                        <p className={`font-arabic text-3xl sm:text-4xl leading-loose flex-grow text-right transition-colors duration-300 ${playingVerse === v.verse_key ? 'text-emerald-400' : 'text-white'}`}>
                                            {v.text_uthmani}
                                            <span className={`inline-flex items-center justify-center text-sm w-8 h-8 rounded-full mx-3 font-mono border transition-colors duration-300 ${playingVerse === v.verse_key ? 'bg-emerald-900/50 text-emerald-200 border-emerald-700' : 'bg-[#222] text-white border-[#444]'}`}>
                                                {v.verse_key.split(':')[1]}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
