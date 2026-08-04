import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { PlayCircle, PauseCircle, BookOpen, ChevronLeft, Search, Palette, Download, Check, Languages, Bookmark, Gauge, Mic, BookmarkCheck } from 'lucide-react';
import { useQuranOffline } from '../hooks/useQuranOffline';
import { getSurahMeta } from '../utils/quranOfflineStorage';

const RECITERS = [
    { id: 7, name: 'Mishary Rashid Alafasy' },
    { id: 1, name: 'Abdul Basit (Murattal)' },
    { id: 3, name: 'Saad Al-Ghamdi' },
    { id: 6, name: 'Mahmoud Khalil Al-Husary' }
];

const SPEEDS = [0.75, 1, 1.25, 1.5];

export default function QuranReader() {
    const [chapters, setChapters] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [verses, setVerses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchMode, setSearchMode] = useState('surahs'); // 'surahs' | 'verses'
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchingVerses, setIsSearchingVerses] = useState(false);
    
    // Customization & Controls
    const [tajweedMode, setTajweedMode] = useState(true);
    const [showTranslation, setShowTranslation] = useState(true);
    const [selectedReciter, setSelectedReciter] = useState(7);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [lastRead, setLastRead] = useState(null);
    
    // Audio States & Sync
    const [audioFiles, setAudioFiles] = useState({});
    const [playingVerse, setPlayingVerse] = useState(null);
    const audioProgressDefault = { currentTime: 0, duration: 0, percentage: 0, currentWordIndex: 0 };
    const [audioProgress, setAudioProgress] = useState(audioProgressDefault);
    const audioRef = useRef(null);
    const verseRefs = useRef({});
    const versesListContainerRef = useRef(null);

    const {
        isDownloaded,
        isDownloading,
        downloadProgress,
        startDownload,
        deleteOffline,
        getOfflineAudioUrl,
        loadFromOffline,
        setIsDownloaded
    } = useQuranOffline(selectedChapter, verses, audioFiles);

    const [offlineSurahsCache, setOfflineSurahsCache] = useState({});

    // Load initial Chapters & Last Read Bookmark
    useEffect(() => {
        const cachedChapters = localStorage.getItem('quran_chapters_cache');
        if (cachedChapters) {
            try {
                setChapters(JSON.parse(cachedChapters));
            } catch (e) {
                console.error(e);
            }
        }

        const savedBookmark = localStorage.getItem('quran_last_read');
        if (savedBookmark) {
            try {
                setLastRead(JSON.parse(savedBookmark));
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

    // Synchronize Audio Playback Speed
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = playbackSpeed;
        }
    }, [playbackSpeed]);

    // Update offline cache list
    useEffect(() => {
        const updateOfflineList = async () => {
            const cache = {};
            for (let c of chapters) {
                const meta = await getSurahMeta(c.id);
                if (meta) {
                    cache[c.id] = true;
                }
            }
            setOfflineSurahsCache(cache);
        };
        if (chapters.length > 0) {
            updateOfflineList();
        }
    }, [chapters, isDownloaded]);

    // Re-fetch recitations when reciter changes
    useEffect(() => {
        if (selectedChapter) {
            fetchAudioForReciter(selectedChapter.id, selectedReciter);
        }
    }, [selectedReciter]);

    // Dedicated Auto-scroll inside isolated verses container
    useEffect(() => {
        if (!playingVerse || !verseRefs.current[playingVerse] || !versesListContainerRef.current) return;
        const el = verseRefs.current[playingVerse];
        const container = versesListContainerRef.current;
        
        const containerRect = container.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const relativeTop = elRect.top - containerRect.top;
        const targetScroll = container.scrollTop + relativeTop - (container.clientHeight / 2) + (elRect.height / 2);
        
        container.scrollTo({
            top: Math.max(0, targetScroll),
            behavior: 'smooth'
        });
    }, [playingVerse]);

    // Handle Audio TimeUpdate and End events for Word-by-Word sync
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
            if (activeVerseObj) {
                const textStr = activeVerseObj.text_tajweed || activeVerseObj.text_uthmani || '';
                const tokens = textStr.match(/((?:<[^>]+>|[^<>\s])+)/g) || [];
                if (tokens.length > 0) {
                    wordIdx = Math.min(tokens.length - 1, Math.floor((cur / dur) * tokens.length));
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

    // Handle Verse Global Search
    const handleSearchVerses = async () => {
        if (!searchQuery.trim()) return;
        setIsSearchingVerses(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_QURAN_API_URL}/api/v4/search?q=${encodeURIComponent(searchQuery)}&language=fr`);
            setSearchResults(res.data?.search?.results || []);
        } catch (err) {
            console.error("Search verses error:", err);
        } finally {
            setIsSearchingVerses(false);
        }
    };

    const fetchAudioForReciter = async (chapterId, reciterId) => {
        try {
            const resAudio = await axios.get(`${import.meta.env.VITE_QURAN_API_URL}/api/v4/quran/recitations/${reciterId}?chapter_number=${chapterId}`);
            const audioMap = {};
            if (resAudio?.data?.audio_files) {
                resAudio.data.audio_files.forEach(a => {
                    audioMap[a.verse_key] = a.url.startsWith('http') ? a.url : `https://verses.quran.com/${a.url}`;
                });
            }
            setAudioFiles(audioMap);
        } catch (e) {
            console.error("Reciter audio load error:", e);
        }
    };

    // Fast Fetch: Tajweed + Official French Translation (Hamidullah ID 31) + Audio
    const fetchVerses = async (chapterId, targetVerseKey = null) => {
        setLoading(true);
        const chapterObj = chapters.find(c => c.id === chapterId);
        setSelectedChapter(chapterObj);
        setPlayingVerse(null);
        if (audioRef.current) {
            audioRef.current.pause();
        }

        const offlineData = await loadFromOffline(chapterId);
        if (offlineData) {
            setVerses(offlineData.verses || []);
            setAudioFiles(offlineData.audioObjectUrls || {});
            setIsDownloaded(true);
            setLoading(false);
            if (targetVerseKey) {
                setTimeout(() => {
                    if (verseRefs.current[targetVerseKey]) {
                        verseRefs.current[targetVerseKey].scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 300);
            }
            return;
        }

        setIsDownloaded(false);

        try {
            const [resTajweed, resTranslation, resAudio] = await Promise.all([
                axios.get(`${import.meta.env.VITE_QURAN_API_URL}/api/v4/quran/verses/uthmani_tajweed?chapter_number=${chapterId}`),
                axios.get(`${import.meta.env.VITE_QURAN_API_URL}/api/v4/quran/translations/31?chapter_number=${chapterId}`).catch(() => null),
                axios.get(`${import.meta.env.VITE_QURAN_API_URL}/api/v4/quran/recitations/${selectedReciter}?chapter_number=${chapterId}`)
            ]);
            
            const tajweedVerses = resTajweed?.data?.verses || [];
            const translationVerses = resTranslation?.data?.translations || [];
            
            const mergedVerses = tajweedVerses.map((v, idx) => {
                const rawTranslation = translationVerses[idx]?.text || '';
                const cleanTranslation = rawTranslation.replace(/<sup[^>]*>.*?<\/sup>/g, '').trim();
                return {
                    ...v,
                    text_tajweed: v.text_uthmani_tajweed || v.text_uthmani,
                    text_uthmani: v.text_uthmani || v.text_uthmani_tajweed,
                    translation: cleanTranslation
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

            if (targetVerseKey) {
                setTimeout(() => {
                    if (verseRefs.current[targetVerseKey]) {
                        verseRefs.current[targetVerseKey].scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 300);
            }
            
        } catch (err) {
            console.error("Erreur lors du chargement des versets/audio:", err);
        } finally {
            setLoading(false);
        }
    };

    const saveBookmark = (verseKey) => {
        if (!selectedChapter) return;
        const bookmarkObj = {
            chapterId: selectedChapter.id,
            chapterName: selectedChapter.name_simple,
            chapterNameArabic: selectedChapter.name_arabic,
            verseKey: verseKey,
            timestamp: new Date().toLocaleDateString('fr-FR')
        };
        setLastRead(bookmarkObj);
        localStorage.setItem('quran_last_read', JSON.stringify(bookmarkObj));
    };

    const toggleDownload = () => {
        if (!selectedChapter) return;
        if (isDownloaded) {
            deleteOffline();
        } else {
            startDownload();
        }
    };

    const playVerse = async (verseKey) => {
        if (!audioRef.current) return;
        
        // Save bookmark automatically on verse play
        saveBookmark(verseKey);

        if (playingVerse === verseKey) {
            audioRef.current.pause();
            setPlayingVerse(null);
            setAudioProgress({ currentTime: 0, duration: 0, percentage: 0, currentWordIndex: 0 });
        } else {
            let audioSrc = await getOfflineAudioUrl(verseKey);
            if (!audioSrc) {
                audioSrc = audioFiles[verseKey];
            }
            
            if (!audioSrc) return;
            
            audioRef.current.src = audioSrc;
            audioRef.current.playbackRate = playbackSpeed;
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
        <div className="w-full max-w-5xl mx-auto py-4 px-4 flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)] overflow-hidden">
            {/* Page Header */}
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-white flex items-center justify-center gap-3 flex-shrink-0">
                <BookOpen className="text-gray-400" size={26} />
                Le Noble Coran
            </h2>
            
            {!selectedChapter ? (
                /* SURAH SELECTION VIEW */
                <div className="flex flex-col flex-1 overflow-hidden bg-[#0a0a0a] p-4 rounded-2xl border border-[#333] shadow-2xl">
                    
                    {/* Resume Reading Bookmark Banner */}
                    {lastRead && (
                        <div className="mb-4 p-3 bg-[#111] border border-[#333] rounded-xl flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <Bookmark className="text-emerald-400" size={20} />
                                <div>
                                    <p className="text-xs text-gray-400 font-bold">Reprendre la lecture</p>
                                    <p className="text-sm font-bold text-white">
                                        Sourate {lastRead.chapterName} ({lastRead.chapterNameArabic}) — Verset {lastRead.verseKey.split(':')[1]}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => fetchVerses(lastRead.chapterId, lastRead.verseKey)}
                                className="px-3 py-1.5 bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-semibold rounded-lg hover:bg-emerald-900 transition-colors"
                            >
                                Continuer ➔
                            </button>
                        </div>
                    )}

                    {/* Search Bar & Mode Switch */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-4 flex-shrink-0">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                            <input 
                                type="text" 
                                placeholder={searchMode === 'surahs' ? "Rechercher une sourate (Nom, N°)..." : "Rechercher un mot/verset dans tout le Coran..."}
                                className="w-full bg-[#111] border border-[#333] text-white py-2.5 pl-11 pr-4 rounded-xl outline-none focus:border-gray-500 transition-colors shadow-lg text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && searchMode === 'verses' && handleSearchVerses()}
                            />
                        </div>

                        <div className="flex items-center bg-[#111] p-1 rounded-xl border border-[#333]">
                            <button
                                onClick={() => setSearchMode('surahs')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                    searchMode === 'surahs' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                Sourates
                            </button>
                            <button
                                onClick={() => { setSearchMode('verses'); handleSearchVerses(); }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                    searchMode === 'verses' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                Versets
                            </button>
                        </div>
                    </div>
                    
                    {searchMode === 'surahs' ? (
                        filteredChapters.length === 0 && chapters.length > 0 ? (
                            <div className="flex justify-center items-center h-48">
                                <p className="text-gray-500">Aucune sourate trouvée pour "{searchQuery}"</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 flex-1 overflow-y-auto p-2 custom-scrollbar">
                                {filteredChapters.map(chapter => {
                                    const isSavedOffline = !!offlineSurahsCache[chapter.id];
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
                        )
                    ) : (
                        /* VERSES GLOBAL SEARCH RESULTS */
                        <div className="flex-1 overflow-y-auto p-2 space-y-4 custom-scrollbar">
                            {isSearchingVerses ? (
                                <div className="flex justify-center items-center h-48">
                                    <p className="text-gray-400">Recherche dans tout le Coran...</p>
                                </div>
                            ) : searchResults.length === 0 ? (
                                <div className="flex justify-center items-center h-48">
                                    <p className="text-gray-500">Tapez un mot puis appuyez sur Entrée pour chercher dans le Coran.</p>
                                </div>
                            ) : (
                                searchResults.map((res, i) => {
                                    const chapterId = parseInt(res.verse_key.split(':')[0]);
                                    return (
                                        <div 
                                            key={i} 
                                            onClick={() => fetchVerses(chapterId, res.verse_key)}
                                            className="p-4 bg-[#111] hover:bg-[#222] border border-[#333] hover:border-gray-500 rounded-xl cursor-pointer transition-all"
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs font-bold text-emerald-400">Verset {res.verse_key}</span>
                                                <span className="text-xs text-gray-500">Cliquer pour ouvrir ➔</span>
                                            </div>
                                            <p className="text-white text-sm font-sans mb-2" dangerouslySetInnerHTML={{ __html: res.text }} />
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            ) : (
                /* SURAH READER VIEW - 2 SEPARATE PHYSICAL CONTAINERS */
                <div className="flex flex-col flex-1 overflow-hidden">
                    {/* CONTAINER 1: PHYSICAL SEPARATE FIXED HEADER */}
                    <div className="flex-shrink-0 bg-[#0a0a0a] p-4 sm:p-6 rounded-2xl border border-[#333] mb-4 shadow-xl">
                        {/* Top Control Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                            <button 
                                onClick={() => setSelectedChapter(null)}
                                className="bg-[#222] hover:bg-[#333] border border-[#444] px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all text-white flex items-center gap-2"
                            >
                                <ChevronLeft size={16} /> Retour aux Sourates
                            </button>

                            <div className="flex flex-wrap items-center gap-2.5">
                                {/* Reciter Selector */}
                                <div className="flex items-center gap-1 bg-[#111] border border-[#333] px-2.5 py-1 rounded-xl text-xs text-gray-300">
                                    <Mic size={14} className="text-gray-400" />
                                    <select
                                        value={selectedReciter}
                                        onChange={(e) => setSelectedReciter(Number(e.target.value))}
                                        className="bg-transparent text-white outline-none cursor-pointer text-xs"
                                    >
                                        {RECITERS.map(r => (
                                            <option key={r.id} value={r.id} className="bg-[#111] text-white">
                                                {r.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Speed Control Selector */}
                                <div className="flex items-center gap-1 bg-[#111] border border-[#333] px-2 py-1 rounded-xl text-xs text-gray-300">
                                    <Gauge size={14} className="text-gray-400" />
                                    {SPEEDS.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setPlaybackSpeed(s)}
                                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                                playbackSpeed === s ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            {s}x
                                        </button>
                                    ))}
                                </div>

                                {/* Translation FR Toggle */}
                                <button
                                    onClick={() => setShowTranslation(!showTranslation)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                                        showTranslation 
                                            ? 'bg-emerald-900/50 border-emerald-700 text-emerald-300' 
                                            : 'bg-[#111] text-gray-400 border-[#333] hover:text-white'
                                    }`}
                                >
                                    <Languages size={14} />
                                    <span>FR : {showTranslation ? 'Activée' : 'Masquée'}</span>
                                </button>

                                {/* Tajweed Toggle */}
                                <button
                                    onClick={() => setTajweedMode(!tajweedMode)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                                        tajweedMode 
                                            ? 'bg-white text-black border-white shadow-md' 
                                            : 'bg-[#111] text-gray-400 border-[#333] hover:text-white'
                                    }`}
                                >
                                    <Palette size={14} />
                                    <span>Tajweed : {tajweedMode ? 'Activé' : 'Désactivé'}</span>
                                </button>

                                {/* Download / Offline Toggle */}
                                {isDownloading ? (
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-blue-500 bg-blue-900/30 text-blue-300 text-xs font-semibold">
                                        <span className="animate-pulse">Téléchargement {downloadProgress?.downloaded}/{downloadProgress?.total}...</span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={toggleDownload}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                                            isDownloaded 
                                                ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300' 
                                                : 'bg-[#111] border-[#333] text-gray-300 hover:border-gray-500'
                                        }`}
                                        title={isDownloaded ? "Disponible Hors-Ligne (Cliquer pour supprimer)" : "Télécharger pour lire hors-ligne"}
                                    >
                                        {isDownloaded ? <Check size={14} className="text-emerald-400" /> : <Download size={14} />}
                                        <span>{isDownloaded ? 'Hors-Ligne OK' : 'Télécharger'}</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Tajweed Legend Bar */}
                        {tajweedMode && (
                            <div className="mb-3 p-2 bg-[#111] border border-[#222] rounded-xl flex flex-wrap items-center justify-center gap-3 text-xs font-medium">
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
                            <span className="block text-sm text-gray-500 mt-0.5 font-sans">Sourate {selectedChapter.name_simple} ({selectedChapter.verses_count} versets)</span>
                        </h3>
                    </div>

                    {/* CONTAINER 2: PHYSICAL SEPARATE SCROLLABLE VERSES CONTAINER */}
                    <div className="flex-1 overflow-hidden bg-[#0a0a0a] p-4 sm:p-6 rounded-2xl border border-[#333] shadow-2xl flex flex-col">
                        {loading ? (
                            <div className="flex justify-center items-center h-48">
                                <p className="text-xl text-gray-300">Chargement des versets...</p>
                            </div>
                        ) : (
                            <div 
                                ref={versesListContainerRef}
                                className="flex-1 overflow-y-auto min-h-0 pr-2 space-y-6 custom-scrollbar" 
                                dir="rtl"
                            >
                                {verses.map(v => {
                                    const isPlaying = playingVerse === v.verse_key;
                                    const isBookmarked = lastRead && lastRead.verseKey === v.verse_key;

                                    return (
                                        <div 
                                            key={v.id} 
                                            ref={el => verseRefs.current[v.verse_key] = el}
                                            className={`p-6 sm:p-8 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                                                isPlaying 
                                                    ? 'bg-[#121212] border border-gray-700 shadow-lg' 
                                                    : 'hover:bg-[#111] border border-[#222]'
                                            }`}
                                        >
                                            <div className="flex items-start gap-4 sm:gap-6">
                                                <div className="flex flex-col items-center gap-3 flex-shrink-0 mt-3">
                                                    <button 
                                                        onClick={() => playVerse(v.verse_key)}
                                                        className={`transition-all duration-300 ${
                                                            isPlaying ? 'text-white scale-110' : 'text-gray-600 hover:text-gray-300'
                                                        }`}
                                                        title="Écouter le verset"
                                                    >
                                                        {isPlaying ? <PauseCircle size={34} /> : <PlayCircle size={34} />}
                                                    </button>

                                                    <button
                                                        onClick={() => saveBookmark(v.verse_key)}
                                                        className={`transition-all ${
                                                            isBookmarked ? 'text-emerald-400' : 'text-gray-700 hover:text-gray-400'
                                                        }`}
                                                        title={isBookmarked ? "Marque-page actuel" : "Marquer comme dernier verset lu"}
                                                    >
                                                        {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={18} />}
                                                    </button>
                                                </div>

                                                <div className="flex-grow text-right">
                                                    {/* Word-by-Word sync with preserved Tajweed colors */}
                                                    {isPlaying ? (
                                                        <p className={`tajweed-text font-arabic text-3xl sm:text-4xl leading-[2.5] sm:leading-[2.8] tracking-wide text-white`}>
                                                            {((v.text_tajweed || v.text_uthmani || '').match(/((?:<[^>]+>|[^<>\s])+)/g) || []).map((wHtml, idx) => {
                                                                const isCurrentWord = isPlaying && idx === audioProgress.currentWordIndex;
                                                                const wordContent = tajweedMode ? wHtml : wHtml.replace(/<[^>]+>/g, '');
                                                                return (
                                                                    <span 
                                                                        key={idx} 
                                                                        className={`mx-1.5 px-1.5 py-0.5 rounded-xl transition-all duration-200 inline-block ${
                                                                            isCurrentWord 
                                                                                ? 'bg-white/10 border-b-2 border-white' 
                                                                                : ''
                                                                        }`}
                                                                        dangerouslySetInnerHTML={{ __html: wordContent }}
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
                                                            {(v.text_uthmani || v.text_tajweed || '').replace(/<[^>]+>/g, '')}
                                                            <span className="inline-flex items-center justify-center text-xs w-7 h-7 rounded-full mx-2 font-mono border bg-[#222] text-gray-400 border-[#444]">
                                                                {v.verse_key.split(':')[1]}
                                                            </span>
                                                        </p>
                                                    )}

                                                    {/* French Translation Display */}
                                                    {showTranslation && v.translation && (
                                                        <p 
                                                            className="text-gray-300 text-sm sm:text-base leading-relaxed mt-4 font-sans text-left border-t border-[#222] pt-3" 
                                                            dir="ltr"
                                                            dangerouslySetInnerHTML={{ __html: v.translation }}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
