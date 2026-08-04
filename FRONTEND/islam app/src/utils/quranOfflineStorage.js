const DB_NAME = 'QuranOfflineDB';
const DB_VERSION = 1;

export const openDB = () => {
    return new Promise((resolve, reject) => {
        if (!window.indexedDB) {
            return reject(new Error("IndexedDB non supporté"));
        }
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('surah_meta')) {
                db.createObjectStore('surah_meta', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('audio_blobs')) {
                const audioStore = db.createObjectStore('audio_blobs', { keyPath: 'key' });
                audioStore.createIndex('surahId', 'surahId', { unique: false });
            }
        };

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
};

export const saveSurahMeta = async (surahId, data) => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('surah_meta', 'readwrite');
            const store = tx.objectStore('surah_meta');
            store.put({ id: surahId, ...data });
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    } catch (e) {
        console.error(e);
    }
};

export const getSurahMeta = async (surahId) => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('surah_meta', 'readonly');
            const store = tx.objectStore('surah_meta');
            const req = store.get(surahId);
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => reject(req.error);
        });
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const saveAudioBlob = async (verseKey, blob, surahId) => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('audio_blobs', 'readwrite');
            const store = tx.objectStore('audio_blobs');
            store.put({ key: verseKey, blob, surahId });
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    } catch (e) {
        console.error(e);
    }
};

export const getAudioBlob = async (verseKey) => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('audio_blobs', 'readonly');
            const store = tx.objectStore('audio_blobs');
            const req = store.get(verseKey);
            req.onsuccess = () => resolve(req.result ? req.result.blob : null);
            req.onerror = () => reject(req.error);
        });
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const deleteSurah = async (surahId, verseKeys = []) => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(['surah_meta', 'audio_blobs'], 'readwrite');
            const metaStore = tx.objectStore('surah_meta');
            const audioStore = tx.objectStore('audio_blobs');

            metaStore.delete(surahId);

            if (verseKeys && verseKeys.length > 0) {
                verseKeys.forEach(vk => audioStore.delete(vk));
            } else {
                const index = audioStore.index('surahId');
                const req = index.openCursor(IDBKeyRange.only(surahId));
                req.onsuccess = (e) => {
                    const cursor = e.target.result;
                    if (cursor) {
                        cursor.delete();
                        cursor.continue();
                    }
                };
            }

            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    } catch (e) {
        console.error(e);
    }
};

export const getSurahList = async () => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('surah_meta', 'readonly');
            const store = tx.objectStore('surah_meta');
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result || []);
            req.onerror = () => reject(req.error);
        });
    } catch (e) {
        console.error(e);
        return [];
    }
};
