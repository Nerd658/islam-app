import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { PlayCircle, PauseCircle, BookOpen, ChevronLeft, Search, Palette, Download, Check, Sparkles } from 'lucide-react';

export default function QuranReader() {
    const [chapters, setChapters] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [verses, setVerses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [tajweedMode, setTajweedMode] = useState(true);
    const [isDownloaded, setIsDownloaded] = useState(false);
    
    // Audio States
    const [audioFiles, setAudioFiles] = useState({});
    const [playingVerse, setPlayingVerse] = useState(null);
    const audioRef = useRef(null);

    // Fetch the list of Surahs (Chapters)
    useEffect(() => {
        // Try local storage cache for chapters first
        const cachedChapters = localStorage.getItem('quran_chapters_cache');
        if (cachedChapters) {
            try {
                setChapters(JSON.parse(cachedChapters));
            } catch (e) {
                console.error(e);
            }
        }

        axios.get(`${import.meta.env.VITE_QURAN_API_URL}/api/v4/chapters?language=fr`)
            .then(res => {
                setChapters(res.data.chapters);
                localStorage.setItem('quran_chapters_cache', JSON.stringify(res.data.chapters));
            })
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

    // Fetch the Arabic verses of a specific Surah + Audio + Tajweed
    const fetchVerses = async (chapterId) => {
        setLoading(true);
        const chapterObj = chapters.find(c => c.id === chapterId);
        setSelectedChapter(chapterObj);
        setPlayingVerse(null);
        if (audioRef.current) {
            audioRef.current.pause();
        }

        // Check if saved offline
        const offlineKey = `offline_surah_${chapterId}`;
        const savedData = localStorage.getItem(offlineKey);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setVerses(parsed.verses || []);
                setAudioFiles(parsed.audioFiles || {});
                setIsDownloaded(true);
                setLoading(false);
                return;
            } catch (e) {
                console.error("Offline parse error:", e);
            }
        }

        setIsDownloaded(false);

        try {
            const [resVerses, resTajweed, resAudio] = await Promise.all([
                axios.get(`${import.meta.env.VITE_QURAN_API_URL}/api/v4/quran/verses/uthmani?chapter_number=${chapterId}`),
                axios.get(`${import.meta.env.VITE_QURAN_API_URL}/api/v4/quran/verses/tajweed?chapter_number=${chapterId}`).catch(() => null),
                axios.get(`${import.meta.env.VITE_QURAN_API_URL}/api/v4/quran/recitations/7?chapter_number=${chapterId}`) // 7 = Mishari
            ]);
            
            // Merge Uthmani & Tajweed
            const uthmaniVerses = resVerses.data.verses;
            const tajweedVerses = resTajweed?.data?.verses || [];
            
            const mergedVerses = uthmaniVerses.map(v => {
                const tajweedMatch = tajweedVerses.find(t => t.id === v.id || t.verse_key === v.verse_key);
                return {
                    ...v,
                    text_tajweed: tajweedMatch ? tajweedMatch.text_tajweed : v.text_uthmani
                };
            });

            setVerses(mergedVerses);
            
            // Map audio URLs by verse_key
            const audioMap = {};
            if (resAudio?.data?.audio_files) {
                resAudio.data.audio_files.forEach(a => {
                    audioMap[a.verse_key] = a.url.startsWith('http') ? a.url : `https://verses.quran.com/${a.url}`;
                });
            }
            setAudioFiles(audioMap);
            
        } catch (err) {
            console.error("Erreur lors du chargement des versets/audio:", err);
        } finally {
            setLoading(false);
        }
    };

    const toggleDownload = () => {
        if (!selectedChapter) return;
        const offlineKey = `offline_surah_${selectedChapter.id}`;
        if (isDownloaded) {
            localStorage.removeItem(offlineKey);
            setIsDownloaded(false);
        } else {
            localStorage.setItem(offlineKey, JSON.stringify({
                verses,
                audioFiles
            }));
            setIsDownloaded(true);
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
                            className="w-full bg-[#111] border border-[#333] text-white py-3 pl-12 pr-4 rounded-full outline-none focus:border-gray-500 transition-colors shadow-lg text-sm"
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
                            {filteredChapters.map(chapter => {
                                const isSavedOffline = !!localStorage.getItem(`offline_surah_${chapter.id}`);
                                return (
                                    <button 
                                        key={chapter.id}
                                        onClick={() => fetchVerses(chapter.id)}
                                        className="relative flex flex-col items-center justify-center p-4 bg-[#111] hover:bg-[#222] border border-[#333] hover:border-gray-500 rounded-xl transition-all shadow-sm group"
                                    >
                                        {isSavedOffline && (
                                            <span className="absolute top-2 right-2 p-1 bg-emerald-950/80 text-emerald-400 rounded-full border border-emerald-800" title="Disponible Hors-Ligne">
                                                <Check size={12} />
                                            </span>
                                        )}
                                        <span className="text-gray-500 font-bold mb-1 text-xs">N° {chapter.id}</span>
                                        <h3 className="font-bold text-lg mb-1 text-white">{chapter.name_simple}</h3>
                                        <p className="text-2xl text-white font-arabic">{chapter.name_arabic}</p>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-[#0a0a0a] p-6 sm:p-10 rounded-2xl relative border border-[#333]">
                    {/* Top Control Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <button 
                            onClick={() => setSelectedChapter(null)}
                            className="bg-[#222] hover:bg-[#333] border border-[#444] px-4 py-2 rounded-xl text-sm font-medium transition-all text-white flex items-center gap-2"
                        >
                            <ChevronLeft size={16} /> Retour aux Sourates
                        </button>

                        <div className="flex items-center gap-3">
                            {/* Tajweed Toggle */}
                            <button
                                onClick={() => setTajweedMode(!tajweedMode)}
                                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border flex items-center gap-2 ${
                                    tajweedMode 
                                        ? 'bg-white text-black border-white shadow-md' 
                                        : 'bg-[#111] text-gray-400 border-[#333] hover:text-white'
                                }`}
                            >
                                <Palette size={16} />
                                <span>Tajweed Coloré : {tajweedMode ? 'Activé' : 'Désactivé'}</span>
                            </button>

                            {/* Download / Offline Toggle */}
                            <button
                                onClick={toggleDownload}
                                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border flex items-center gap-2 ${
                                    isDownloaded 
                                        ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300' 
                                        : 'bg-[#111] border-[#333] text-gray-300 hover:border-gray-500'
                                }`}
                                title={isDownloaded ? "Disponible Hors-Ligne (Cliquer pour supprimer)" : "Télécharger pour lire hors-ligne"}
                            >
                                {isDownloaded ? <Check size={16} className="text-emerald-400" /> : <Download size={16} />}
                                <span>{isDownloaded ? 'Hors-Ligne OK' : 'Télécharger'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Tajweed Legend Bar */}
                    {tajweedMode && (
                        <div className="mb-8 p-3 bg-[#111] border border-[#222] rounded-xl flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
                            <span className="text-gray-400 flex items-center gap-1 font-bold"><Sparkles size={12} /> Règles Tajweed :</span>
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span><span className="text-rose-400 font-bold">Madd (Élongation)</span></span>
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span className="text-emerald-400 font-bold">Ghunna (Nasalisation)</span></span>
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span><span className="text-blue-400 font-bold">Qalqala (Rebond)</span></span>
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span><span className="text-orange-400 font-bold">Ikhfa</span></span>
                        </div>
                    )}

                    <h3 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-white font-arabic">
                        {selectedChapter.name_arabic}
                        <span className="block text-xl text-gray-500 mt-2 font-sans">Sourate {selectedChapter.name_simple} ({selectedChapter.verses_count} versets)</span>
                    </h3>
                    
                    {loading ? (
                        <div className="flex justify-center items-center h-48">
                            <p className="text-xl text-gray-300">Chargement des versets...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-4" dir="rtl">
                            {verses.map(v => (
                                <div key={v.id} className={`p-5 rounded-2xl transition-all duration-300 ${playingVerse === v.verse_key ? 'bg-emerald-950/30 border-r-4 border-emerald-500' : 'hover:bg-[#111] border-r-4 border-transparent'}`}>
                                    <div className="flex items-start gap-4">
                                        <button 
                                            onClick={() => playVerse(v.verse_key)}
                                            className={`flex-shrink-0 mt-2 transition-all duration-300 ${playingVerse === v.verse_key ? 'text-emerald-500 scale-110' : 'text-gray-600 hover:text-gray-300'}`}
                                            title="Écouter le verset"
                                        >
                                            {playingVerse === v.verse_key ? <PauseCircle size={28} /> : <PlayCircle size={28} />}
                                        </button>

                                        <div className="flex-grow text-right">
                                            {tajweedMode ? (
                                                <p 
                                                    className="tajweed-text font-arabic text-3xl sm:text-4xl leading-loose text-white"
                                                    dangerouslySetInnerHTML={{ __html: v.text_tajweed || v.text_uthmani }}
                                                />
                                            ) : (
                                                <p className="font-arabic text-3xl sm:text-4xl leading-loose text-white">
                                                    {v.text_uthmani || v.text_tajweed}
                                                </p>
                                            )}
                                            <span className={`inline-flex items-center justify-center text-xs w-7 h-7 rounded-full mx-2 font-mono border transition-colors duration-300 ${playingVerse === v.verse_key ? 'bg-emerald-900/50 text-emerald-200 border-emerald-700' : 'bg-[#222] text-gray-400 border-[#444]'}`}>
                                                {v.verse_key.split(':')[1]}
                                            </span>
                                        </div>
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
