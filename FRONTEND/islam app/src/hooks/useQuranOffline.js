import { useState, useEffect, useRef } from 'react';
import { 
    saveSurahMeta, 
    getSurahMeta, 
    saveAudioBlob, 
    getAudioBlob, 
    deleteSurah 
} from '../utils/quranOfflineStorage';

export const useQuranOffline = (selectedChapter, verses, audioFiles) => {
    const [isDownloaded, setIsDownloaded] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(null);
    const blobUrlsRef = useRef({});

    useEffect(() => {
        const checkStatus = async () => {
            if (!selectedChapter) {
                setIsDownloaded(false);
                return;
            }
            const meta = await getSurahMeta(selectedChapter.id);
            setIsDownloaded(!!meta);
        };
        checkStatus();
        
        return () => {
            Object.values(blobUrlsRef.current).forEach(url => URL.revokeObjectURL(url));
            blobUrlsRef.current = {};
        };
    }, [selectedChapter]);

    const startDownload = async () => {
        if (!selectedChapter || !verses || verses.length === 0) return;
        setIsDownloading(true);
        setDownloadProgress({ total: verses.length, downloaded: 0, percent: 0 });

        try {
            await saveSurahMeta(selectedChapter.id, {
                chapterName: selectedChapter.name_simple,
                verses: verses,
                audioObjectUrlsMap: audioFiles,
                timestamp: Date.now()
            });

            let downloaded = 0;
            for (const verse of verses) {
                const url = audioFiles[verse.verse_key];
                if (url) {
                    try {
                        const response = await fetch(url, { mode: 'cors' });
                        if (response.ok) {
                            const blob = await response.blob();
                            await saveAudioBlob(verse.verse_key, blob, selectedChapter.id);
                        }
                    } catch (e) {
                        console.error("Erreur téléchargement audio:", e);
                    }
                }
                downloaded++;
                setDownloadProgress({ 
                    total: verses.length, 
                    downloaded, 
                    percent: Math.round((downloaded / verses.length) * 100) 
                });
            }
            setIsDownloaded(true);
        } catch (e) {
            console.error("Erreur de téléchargement de la sourate:", e);
        } finally {
            setIsDownloading(false);
            setDownloadProgress(null);
        }
    };

    const deleteOffline = async () => {
        if (!selectedChapter) return;
        try {
            const verseKeys = verses ? verses.map(v => v.verse_key) : [];
            await deleteSurah(selectedChapter.id, verseKeys);
            setIsDownloaded(false);
        } catch (e) {
            console.error("Erreur lors de la suppression hors-ligne:", e);
        }
    };

    const getOfflineAudioUrl = async (verseKey) => {
        if (blobUrlsRef.current[verseKey]) {
            return blobUrlsRef.current[verseKey];
        }
        const blob = await getAudioBlob(verseKey);
        if (blob) {
            const url = URL.createObjectURL(blob);
            blobUrlsRef.current[verseKey] = url;
            return url;
        }
        return null;
    };

    const loadFromOffline = async (surahId) => {
        try {
            const meta = await getSurahMeta(surahId);
            if (!meta || !meta.verses) return null;
            return {
                verses: meta.verses,
                audioObjectUrls: meta.audioObjectUrlsMap || {}
            };
        } catch (e) {
            return null;
        }
    };

    return {
        isDownloaded,
        isDownloading,
        downloadProgress,
        startDownload,
        deleteOffline,
        getOfflineAudioUrl,
        loadFromOffline,
        setIsDownloaded
    };
};
