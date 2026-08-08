import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { PlayCircle, PauseCircle, BookOpen, ChevronLeft, Search, Palette, Download, Check, Languages, Bookmark, Gauge, Mic, BookmarkCheck, Menu, Info, X } from 'lucide-react';
import { useQuranOffline } from '../hooks/useQuranOffline';
import { getSurahMeta } from '../utils/quranOfflineStorage';

const RECITERS = [
    { id: 7, name: 'Mishari Rashid al-`Afasy' },
    { id: 1, name: 'AbdulBaset AbdulSamad' },
    { id: 2, name: 'AbdulBaset AbdulSamad (Mujawwad)' },
    { id: 3, name: 'Abdur-Rahman as-Sudais' },
    { id: 4, name: 'Abu Bakr al-Shatri' },
    { id: 5, name: 'Hani ar-Rifai' },
    { id: 12, name: 'Mahmoud Khalil Al-Husary' },
    { id: 6, name: 'Mahmoud Khalil Al-Husary (Muallim)' },
    { id: 8, name: 'Mohamed Siddiq al-Minshawi' },
    { id: 9, name: 'Mohamed Siddiq al-Minshawi (Mujawwad)' },
    { id: 10, name: 'Sa`ud ash-Shuraym' },
    { id: 11, name: 'Mohamed al-Tablawi' }
];

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export default function QuranReader() {
    const [chapters, setChapters] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [verses, setVerses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchMode, setSearchMode] = useState('surahs');
    const [showSettings, setShowSettings] = useState(false);
    const [showTajweedModal, setShowTajweedModal] = useState(false);
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

    const handleTajweedToggle = () => {
        setTajweedMode(!tajweedMode);
    };

    const filteredChapters = chapters.filter(chapter => 
        chapter.name_simple.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chapter.name_arabic.includes(searchQuery) ||
        (chapter.translated_name && chapter.translated_name.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        chapter.id.toString() === searchQuery
    );

    return (
        <div className="w-full max-w-5xl mx-auto py-4 px-4 flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)] overflow-hidden">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-theme-text flex items-center justify-center gap-3 flex-shrink-0">
                <BookOpen className="text-theme-primary" size={28} />
                Le Noble Coran
            </h2>
            
            {!selectedChapter ? (
                <div className="flex flex-col flex-1 overflow-hidden bg-theme-surface p-4 sm:p-6 rounded-3xl border border-theme-border shadow-2xl">
                    {lastRead && (
                        <div className="mb-6 p-4 bg-theme-surface-hover border border-theme-primary/30 rounded-2xl flex items-center justify-between flex-shrink-0 shadow-lg shadow-theme-primary/5">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-theme-primary/10 rounded-xl hidden sm:block">
                                    <Bookmark className="text-theme-primary" size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-theme-text-muted font-bold uppercase tracking-wider mb-1">Reprendre la lecture</p>
                                    <p className="text-sm sm:text-base font-bold text-theme-text">
                                        Sourate {lastRead.chapterName} ({lastRead.chapterNameArabic}) — Verset {lastRead.verseKey.split(':')[1]}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => fetchVerses(lastRead.chapterId, lastRead.verseKey)}
                                className="px-4 py-2 bg-theme-primary text-white text-sm font-bold rounded-xl hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2"
                            >
                                Continuer <span className="hidden sm:inline">➔</span>
                            </button>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 mb-6 flex-shrink-0">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-theme-primary" size={18} />
                            <input 
                                type="text" 
                                placeholder={searchMode === 'surahs' ? "Rechercher une sourate..." : "Rechercher un mot/verset..."}
                                className="w-full bg-theme-bg border border-theme-border text-theme-text py-3.5 pl-11 pr-4 rounded-xl outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme-primary transition-all shadow-inner text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && searchMode === 'verses' && handleSearchVerses()}
                            />
                        </div>

                        <div className="flex items-center bg-theme-bg p-1.5 rounded-xl border border-theme-border shadow-inner">
                            <button
                                onClick={() => setSearchMode('surahs')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                    searchMode === 'surahs' ? 'bg-theme-surface shadow-md text-theme-primary border border-theme-border' : 'text-theme-text-muted hover:text-theme-text'
                                }`}
                            >
                                Sourates
                            </button>
                            <button
                                onClick={() => { setSearchMode('verses'); handleSearchVerses(); }}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                    searchMode === 'verses' ? 'bg-theme-surface shadow-md text-theme-primary border border-theme-border' : 'text-theme-text-muted hover:text-theme-text'
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
                                            className="relative flex flex-col items-center justify-center p-6 bg-theme-surface-hover hover:bg-[#1a1a1a] border border-theme-border/60 hover:border-theme-primary/50 rounded-3xl transition-all shadow-md group hover:-translate-y-1"
                                        >
                                            {isSavedOffline && (
                                                <span className="absolute top-3 right-3 p-1.5 bg-theme-primary/10 text-theme-primary rounded-full border border-theme-primary/20" title="Disponible Hors-Ligne">
                                                    <Check size={14} />
                                                </span>
                                            )}
                                            <span className="absolute top-4 left-4 text-theme-text-muted/40 font-mono font-bold text-xs group-hover:text-theme-accent transition-colors">{chapter.id}</span>
                                            <p className="text-4xl text-theme-primary group-hover:text-theme-accent font-arabic mb-3 mt-4 transition-colors duration-300">{chapter.name_arabic}</p>
                                            <h3 className="font-bold text-base text-theme-text">{chapter.name_simple}</h3>
                                        </button>
                                    );
                                })}
                            </div>
                        )
                    ) : (
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
                <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-shrink-0 bg-theme-surface p-4 sm:p-6 rounded-3xl border border-theme-border mb-4 shadow-xl">
                        <div className="flex items-center justify-between gap-3 mb-4 relative">
                            <button 
                                onClick={() => setSelectedChapter(null)}
                                className="bg-theme-bg hover:bg-theme-surface-hover border border-theme-border px-4 py-2 rounded-xl text-sm font-bold transition-all text-theme-text flex items-center gap-2 flex-shrink-0 shadow-sm"
                            >
                                <ChevronLeft size={18} /> <span className="hidden sm:inline">Retour</span>
                            </button>

                            <div className="hidden sm:flex items-center gap-2.5">
                                <div className="flex-shrink-0 flex items-center gap-1 bg-[#111] border border-[#333] px-2.5 py-1 rounded-xl text-xs text-gray-300">
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

                                <div className="flex-shrink-0 flex items-center gap-1 bg-[#111] border border-[#333] px-2 py-1 rounded-xl text-xs text-gray-300">
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

                                <button
                                    onClick={() => setShowTranslation(!showTranslation)}
                                    className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                                        showTranslation 
                                            ? 'bg-emerald-900/50 border-emerald-700 text-emerald-300' 
                                            : 'bg-[#111] text-gray-400 border-[#333] hover:text-white'
                                    }`}
                                >
                                    <Languages size={14} />
                                    <span>FR : {showTranslation ? 'Activée' : 'Masquée'}</span>
                                </button>

                                <button
                                    onClick={handleTajweedToggle}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                                        tajweedMode 
                                            ? 'bg-white text-black border-white shadow-md' 
                                            : 'bg-[#111] text-gray-400 border-[#333] hover:text-white'
                                    }`}
                                >
                                    <Palette size={14} />
                                    <span>Tajweed : {tajweedMode ? 'Activé' : 'Off'}</span>
                                </button>

                                <button
                                    onClick={() => setShowTajweedModal(true)}
                                    className="p-1.5 bg-[#111] border border-[#333] rounded-xl text-gray-400 hover:text-white transition-colors"
                                    title="Règles du Tajweed"
                                >
                                    <Info size={18} />
                                </button>

                                {isDownloading ? (
                                    <div className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-blue-500 bg-blue-900/30 text-blue-300 text-xs font-semibold">
                                        <span className="animate-pulse">Téléchargement {downloadProgress?.downloaded}/{downloadProgress?.total}...</span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={toggleDownload}
                                        className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
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

                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className="sm:hidden bg-[#222] hover:bg-[#333] border border-[#444] p-2 rounded-xl text-gray-300 transition-colors"
                            >
                                <Menu size={20} />
                            </button>
                        </div>

                        {showSettings && (
                            <div className="sm:hidden mb-4 p-3 bg-[#111] border border-[#333] rounded-xl flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400">Récitateur</span>
                                    <div className="flex items-center gap-1 bg-[#222] border border-[#444] px-2 py-1 rounded-lg text-xs">
                                        <Mic size={12} className="text-gray-400" />
                                        <select
                                            value={selectedReciter}
                                            onChange={(e) => {
                                                setSelectedReciter(Number(e.target.value));
                                                setShowSettings(false);
                                            }}
                                            className="bg-transparent text-white outline-none"
                                        >
                                            {RECITERS.map(r => (
                                                <option key={r.id} value={r.id} className="bg-[#111]">{r.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400">Vitesse</span>
                                    <div className="flex items-center gap-1 bg-[#222] border border-[#444] px-2 py-1 rounded-lg text-xs">
                                        {SPEEDS.map(s => (
                                            <button
                                                key={s}
                                                onClick={() => { setPlaybackSpeed(s); setShowSettings(false); }}
                                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                                    playbackSpeed === s ? 'bg-white text-black' : 'text-gray-400'
                                                }`}
                                            >
                                                {s}x
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-1">
                                    <button
                                        onClick={() => { setShowTranslation(!showTranslation); setShowSettings(false); }}
                                        className={`px-2 py-1.5 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 ${
                                            showTranslation ? 'bg-emerald-900/50 border-emerald-700 text-emerald-300' : 'bg-[#222] border-[#444] text-gray-400'
                                        }`}
                                    >
                                        <Languages size={12} /> FR : {showTranslation ? 'Oui' : 'Non'}
                                    </button>
                                    <button
                                        onClick={() => { handleTajweedToggle(); setShowSettings(false); }}
                                        className={`px-2 py-1.5 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 ${
                                            tajweedMode ? 'bg-white text-black border-white' : 'bg-[#222] border-[#444] text-gray-400'
                                        }`}
                                    >
                                        <Palette size={12} /> Tajweed
                                    </button>
                                </div>
                                {isDownloading ? (
                                    <div className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-blue-500 bg-blue-900/30 text-blue-300 text-xs font-semibold w-full mt-1">
                                        <span className="animate-pulse">Téléchargement {downloadProgress?.downloaded}/{downloadProgress?.total}...</span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => { toggleDownload(); setShowSettings(false); }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 w-full mt-1 ${
                                            isDownloaded ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300' : 'bg-[#222] border-[#444] text-gray-300'
                                        }`}
                                    >
                                        {isDownloaded ? <Check size={14} className="text-emerald-400" /> : <Download size={14} />}
                                        {isDownloaded ? 'Hors-Ligne OK' : 'Télécharger'}
                                    </button>
                                )}
                            </div>
                        )}

                        <h3 className="text-3xl sm:text-4xl font-bold text-center text-theme-accent font-arabic mt-4 mb-2 drop-shadow-[0_0_15px_rgba(252,211,77,0.2)]">
                            {selectedChapter.name_arabic}
                            <span className="block text-sm text-theme-text-muted mt-2 font-sans tracking-wide">Sourate {selectedChapter.name_simple} ({selectedChapter.verses_count} versets)</span>
                        </h3>
                    </div>

                    <div className="flex-1 overflow-hidden bg-theme-surface p-4 sm:p-6 rounded-3xl border border-theme-border shadow-2xl flex flex-col">
                        {loading ? (
                            <div className="flex justify-center items-center h-48">
                                <p className="text-xl text-theme-text-muted">Chargement des versets...</p>
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
                                            className={`p-6 sm:p-8 rounded-3xl transition-all duration-500 relative overflow-hidden ${
                                                isPlaying 
                                                    ? 'bg-[#111] border-2 border-theme-primary shadow-[0_0_15px_rgba(16,185,129,0.1)] z-10' 
                                                    : 'bg-theme-surface-hover hover:bg-[#1a1a1a] border border-theme-border/60 hover:border-theme-primary/30 shadow-md'
                                            }`}
                                        >
                                            {isPlaying && (
                                                <div className="absolute inset-0 bg-gradient-to-l from-theme-primary/5 to-transparent pointer-events-none" />
                                            )}
                                            <div className="flex items-start gap-4 sm:gap-6 relative z-10">
                                                <div className="flex flex-col items-center gap-4 flex-shrink-0 mt-3">
                                                    <button 
                                                        onClick={() => playVerse(v.verse_key)}
                                                        className={`transition-all duration-300 ${
                                                            isPlaying ? 'text-theme-primary drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'text-theme-text-muted hover:text-theme-primary'
                                                        }`}
                                                        title="Écouter le verset"
                                                    >
                                                        {isPlaying ? <PauseCircle size={40} /> : <PlayCircle size={40} />}
                                                    </button>

                                                    <button
                                                        onClick={() => saveBookmark(v.verse_key)}
                                                        className={`transition-all ${
                                                            isBookmarked ? 'text-theme-accent' : 'text-theme-text-muted hover:text-theme-accent'
                                                        }`}
                                                        title={isBookmarked ? "Marque-page actuel" : "Marquer comme dernier verset lu"}
                                                    >
                                                        {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={18} />}
                                                    </button>
                                                </div>

                                                <div className="flex-grow text-right">
                                                    {isPlaying ? (
                                                        <p className={`tajweed-text font-arabic text-3xl sm:text-4xl leading-[2.5] sm:leading-[2.8] tracking-wide text-theme-text`}>
                                                            {((v.text_tajweed || v.text_uthmani || '').match(/((?:<[^>]+>|[^<>\s])+)/g) || []).map((wHtml, idx) => {
                                                                const isCurrentWord = isPlaying && idx === audioProgress.currentWordIndex;
                                                                const wordContent = tajweedMode ? wHtml : wHtml.replace(/<[^>]+>/g, '');
                                                                return (
                                                                    <span 
                                                                        key={idx} 
                                                                        className={`mx-1 px-1.5 py-0.5 rounded-lg transition-colors duration-200 inline-block ${
                                                                            isCurrentWord 
                                                                                ? 'bg-theme-primary text-white font-medium shadow-[0_0_10px_rgba(16,185,129,0.4)]' 
                                                                                : ''
                                                                        }`}
                                                                        dangerouslySetInnerHTML={{ __html: wordContent }}
                                                                    />
                                                                );
                                                            })}
                                                            <span className="inline-flex items-center justify-center text-xs w-7 h-7 rounded-full mx-2 font-mono border bg-theme-accent/20 text-theme-accent font-bold border-theme-accent">
                                                                {v.verse_key.split(':')[1]}
                                                            </span>
                                                        </p>
                                                    ) : tajweedMode ? (
                                                        <p 
                                                            className="tajweed-text font-arabic text-3xl sm:text-4xl leading-[2.5] sm:leading-[2.8] tracking-wide text-theme-text"
                                                            dangerouslySetInnerHTML={{ __html: v.text_tajweed || v.text_uthmani }}
                                                        />
                                                    ) : (
                                                        <p className="font-arabic text-3xl sm:text-4xl leading-[2.5] sm:leading-[2.8] tracking-wide text-theme-text">
                                                            {(v.text_uthmani || v.text_tajweed || '').replace(/<[^>]+>/g, '')}
                                                            <span className="inline-flex items-center justify-center text-xs w-7 h-7 rounded-full mx-2 font-mono border bg-transparent border-theme-accent/50 text-theme-accent">
                                                                {v.verse_key.split(':')[1]}
                                                            </span>
                                                        </p>
                                                    )}

                                                    {showTranslation && v.translation && (
                                                        <p 
                                                            className={`text-sm sm:text-base leading-relaxed mt-4 font-sans text-left border-t pt-4 transition-colors ${
                                                                isPlaying ? 'text-theme-primary/90 border-theme-primary/30' : 'text-theme-text-muted border-theme-border/50'
                                                            }`} 
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

            {/* Tajweed Legend Modal */}
            {showTajweedModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowTajweedModal(false)}>
                    <div className="bg-[#111] border border-[#333] p-6 rounded-2xl w-full max-w-sm relative shadow-2xl" onClick={e => e.stopPropagation()}>
                        <button 
                            onClick={() => setShowTajweedModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white bg-[#222] p-1.5 rounded-full transition-colors"
                        >
                            <X size={18} />
                        </button>
                        <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Palette size={20} className="text-emerald-400" />
                            Règles du Tajweed
                        </h4>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-xl border border-[#222]">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
                                    <span className="font-semibold text-white">Madd</span>
                                </div>
                                <span className="text-xs text-gray-400">Élongation</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-xl border border-[#222]">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                    <span className="font-semibold text-white">Ghunna</span>
                                </div>
                                <span className="text-xs text-gray-400">Nasalisation</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-xl border border-[#222]">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                    <span className="font-semibold text-white">Qalqala</span>
                                </div>
                                <span className="text-xs text-gray-400">Rebond</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-xl border border-[#222]">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                                    <span className="font-semibold text-white">Ikhfa</span>
                                </div>
                                <span className="text-xs text-gray-400">Dissimulation</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-xl border border-[#222]">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                                    <span className="font-semibold text-white">Idgham</span>
                                </div>
                                <span className="text-xs text-gray-400">Assimilation</span>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => setShowTajweedModal(false)}
                            className="w-full mt-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Compris, retourner à la lecture
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
