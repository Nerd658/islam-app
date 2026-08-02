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
    
    // Audio States & Sync
    const [audioFiles, setAudioFiles] = useState({});
    const [playingVerse, setPlayingVerse] = useState(null);
    const [audioProgress, setAudioProgress] = useState({ currentTime: 0, duration: 0, percentage: 0, currentWordIndex: 0 });
    const audioRef = useRef(null);
    const verseRefs = useRef({});
    const versesListContainerRef = useRef(null);

    // Fetch the list of Surahs (Chapters)
    useEffect(() => {
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

    // Dedicated Auto-scroll inside isolated verses container
    useEffect(() => {
        if (!playingVerse || !verseRefs.current[playingVerse]) return;

        const el = verseRefs.current[playingVerse];
        const container = versesListContainerRef.current;
        
        if (container) {
            const containerRect = container.getBoundingClientRect();
            const elRect = el.getBoundingClientRect();
            const relativeTop = elRect.top - containerRect.top;
            const targetScroll = container.scrollTop + relativeTop - (container.clientHeight / 2) + (elRect.height / 2);
            
            container.scrollTo({
                top: Math.max(0, targetScroll),
                behavior: 'smooth'
            });
        }
    }, [playingVerse]);

    // Handle Audio TimeUpdate and End events for Word-by-Word sync & progress
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        
        const handleAudioEnd = () => {
            if (!playingVerse) return;
            const currentIdx = verses.findIndex(v => v.verse_key === playingVerse);
            if (currentIdx !== -1 && currentIdx + 1 < verses.length) {
                const nextVerseKey = verses[currentIdx + 1].verse_key;
                playVerse(nextVerseKey);
            } else {
                setPlayingVerse(null);
                setAudioProgress({ currentTime: 0, duration: 0, percentage: 0, currentWordIndex: 0 });
            }
        };

        const handleTimeUpdate = () => {
            if (!audio || !playingVerse) return;
            const cur = audio.currentTime || 0;
            const dur = audio.duration || 1;
            const pct = (cur / dur) * 100;
            
            const activeVerseObj = verses.find(v => v.verse_key === playingVerse);
            let wordIdx = 0;
            if (activeVerseObj && activeVerseObj.words && activeVerseObj.words.length > 0) {
                const actualWords = activeVerseObj.words.filter(w => w.char_type_name === 'word');
                if (actualWords.length > 0) {
                    wordIdx = Math.min(actualWords.length - 1, Math.floor((cur / dur) * actualWords.length));
                }
            }

            setAudioProgress({
                currentTime: cur,
                duration: dur,
                percentage: pct,
                currentWordIndex: wordIdx
            });
        };

        audio.addEventListener('ended', handleAudioEnd);
        audio.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            audio.removeEventListener('ended', handleAudioEnd);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, [playingVerse, verses]);

    // Fetch the Arabic verses of a specific Surah + Audio + Words + Tajweed
    const fetchVerses = async (chapterId) => {
        setLoading(true);
        const chapterObj = chapters.find(c => c.id === chapterId);
        setSelectedChapter(chapterObj);
        setPlayingVerse(null);
        if (audioRef.current) {
            audioRef.current.pause();
        }

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
            const [resVerses, resTajweed, resWords, resAudio] = await Promise.all([
                axios.get(`${import.meta.env.VITE_QURAN_API_URL}/api/v4/quran/verses/uthmani?chapter_number=${chapterId}`),
                axios.get(`${import.meta.env.VITE_QURAN_API_URL}/api/v4/quran/verses/uthmani_tajweed?chapter_number=${chapterId}`).catch(() => null),
                axios.get(`${import.meta.env.VITE_QURAN_API_URL}/api/v4/verses/by_chapter/${chapterId}?words=true&word_fields=text_uthmani`).catch(() => null),
                axios.get(`${import.meta.env.VITE_QURAN_API_URL}/api/v4/quran/recitations/7?chapter_number=${chapterId}`)
            ]);
            
            const uthmaniVerses = resVerses.data.verses;
            const tajweedVerses = resTajweed?.data?.verses || [];
            const wordVerses = resWords?.data?.verses || [];
            
            const mergedVerses = uthmaniVerses.map(v => {
                const tajweedMatch = tajweedVerses.find(t => t.id === v.id || t.verse_key === v.verse_key);
                const wordMatch = wordVerses.find(w => w.id === v.id || w.verse_key === v.verse_key);
                return {
                    ...v,
                    text_tajweed: tajweedMatch ? (tajweedMatch.text_uthmani_tajweed || tajweedMatch.text_tajweed) : v.text_uthmani,
                    words: wordMatch ? wordMatch.words : []
                };
            });

            setVerses(mergedVerses);
            
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
            setAudioProgress({ currentTime: 0, duration: 0, percentage: 0, currentWordIndex: 0 });
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
        <div className="w-full max-w-5xl mx-auto py-6 px-4 flex flex-col min-h-[calc(100vh-2rem)] md:min-h-screen">
            <h2 className="text-3xl font-bold text-center mb-6 text-white flex items-center justify-center gap-3 flex-shrink-0">
                <BookOpen className="text-gray-400" size={28} />
                Le Noble Coran
            </h2>
            
            {!selectedChapter ? (
                <>
                    <div className="max-w-md mx-auto mb-8 relative flex-shrink-0">
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
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 flex-1 overflow-y-auto p-4 bg-[#0a0a0a] rounded-2xl border border-[#333] custom-scrollbar max-h-[70vh]">
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
                <div className="bg-[#0a0a0a] p-4 sm:p-8 rounded-2xl border border-[#333] flex flex-col flex-1 overflow-hidden shadow-2xl">
                    {/* Sticky Reader Header (Buttons + Tajweed Legend + Title) */}
                    <div className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-md pb-4 pt-2 border-b border-[#222] mb-6 flex-shrink-0">
                        {/* Top Control Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                            <button 
                                onClick={() => setSelectedChapter(null)}
                                className="bg-[#222] hover:bg-[#333] border border-[#444] px-4 py-2 rounded-xl text-sm font-medium transition-all text-white flex items-center gap-2"
                            >
                                <ChevronLeft size={16} /> Retour aux Sourates
                            </button>

                            <div className="flex items-center gap-3">
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
                            <div className="mb-4 p-2.5 bg-[#111] border border-[#222] rounded-xl flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
                                <span className="text-gray-400 font-bold">Règles Tajweed :</span>
                                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span><span className="text-rose-400 font-bold">Madd (Élongation)</span></span>
                                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span className="text-emerald-400 font-bold">Ghunna (Nasalisation)</span></span>
                                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span><span className="text-blue-400 font-bold">Qalqala (Rebond)</span></span>
                                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span><span className="text-orange-400 font-bold">Ikhfa</span></span>
                            </div>
                        )}

                        {/* Surah Title */}
                        <h3 className="text-2xl sm:text-3xl font-bold text-center text-white font-arabic">
                            {selectedChapter.name_arabic}
                            <span className="block text-base text-gray-500 mt-1 font-sans">Sourate {selectedChapter.name_simple} ({selectedChapter.verses_count} versets)</span>
                        </h3>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-48">
                            <p className="text-xl text-gray-300">Chargement des versets...</p>
                        </div>
                    ) : (
                        /* Isolated Scrollable Verses List */
                        <div 
                            ref={versesListContainerRef}
                            className="flex flex-col space-y-6 sm:space-y-8 flex-1 overflow-y-auto pr-2 custom-scrollbar" 
                            dir="rtl"
                        >
                            {verses.map(v => {
                                const isPlaying = playingVerse === v.verse_key;
                                const tajweedWordTokens = (v.text_tajweed || v.text_uthmani || '').trim().split(/\s+/);

                                return (
                                    <div 
                                        key={v.id} 
                                        ref={el => verseRefs.current[v.verse_key] = el}
                                        className={`p-6 sm:p-8 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                                            isPlaying 
                                                ? 'bg-emerald-950/30 border-2 border-emerald-500 shadow-xl shadow-emerald-950/40' 
                                                : 'hover:bg-[#111] border border-[#222]'
                                        }`}
                                    >
                                        {/* Audio Progress Bar at top of active verse card */}
                                        {isPlaying && (
                                            <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-950">
                                                <div 
                                                    className="h-full bg-emerald-400 transition-all duration-200" 
                                                    style={{ width: `${audioProgress.percentage}%` }}
                                                />
                                            </div>
                                        )}

                                        <div className="flex items-start gap-4 sm:gap-6">
                                            <button 
                                                onClick={() => playVerse(v.verse_key)}
                                                className={`flex-shrink-0 mt-3 transition-all duration-300 ${
                                                    isPlaying ? 'text-emerald-400 scale-110' : 'text-gray-600 hover:text-gray-300'
                                                }`}
                                                title="Écouter le verset"
                                            >
                                                {isPlaying ? <PauseCircle size={34} /> : <PlayCircle size={34} />}
                                            </button>

                                            <div className="flex-grow text-right">
                                                {/* Word-by-Word sync with preserved Tajweed colors */}
                                                {isPlaying ? (
                                                    <p className={`tajweed-text font-arabic text-3xl sm:text-4xl leading-[2.5] sm:leading-[2.8] tracking-wide text-white`}>
                                                        {tajweedWordTokens.map((wHtml, idx) => {
                                                            const isCurrentWord = isPlaying && idx === audioProgress.currentWordIndex;
                                                            return (
                                                                <span 
                                                                    key={idx} 
                                                                    className={`mx-1.5 px-1 py-0.5 rounded-lg transition-all duration-200 inline-block ${
                                                                        isCurrentWord 
                                                                            ? 'bg-emerald-950/70 border-b-2 border-emerald-400 scale-105 shadow-md shadow-emerald-500/20' 
                                                                            : ''
                                                                    }`}
                                                                    dangerouslySetInnerHTML={{ __html: wHtml }}
                                                                />
                                                            );
                                                        })}
                                                        <span className="inline-flex items-center justify-center text-xs w-7 h-7 rounded-full mx-2 font-mono border bg-emerald-900/50 text-emerald-200 border-emerald-700">
                                                            {v.verse_key.split(':')[1]}
                                                        </span>
                                                    </p>
                                                ) : tajweedMode ? (
                                                    <p 
                                                        className="tajweed-text font-arabic text-3xl sm:text-4xl leading-[2.5] sm:leading-[2.8] tracking-wide text-white"
                                                        dangerouslySetInnerHTML={{ __html: v.text_tajweed || v.text_uthmani }}
                                                    />
                                                ) : (
                                                    <p className="font-arabic text-3xl sm:text-4xl leading-[2.5] sm:leading-[2.8] tracking-wide text-white">
                                                        {v.text_uthmani || v.text_tajweed}
                                                        <span className="inline-flex items-center justify-center text-xs w-7 h-7 rounded-full mx-2 font-mono border bg-[#222] text-gray-400 border-[#444]">
                                                            {v.verse_key.split(':')[1]}
                                                        </span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
