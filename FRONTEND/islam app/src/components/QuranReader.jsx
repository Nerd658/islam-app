import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function QuranReader() {
    const [chapters, setChapters] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [verses, setVerses] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch the list of Surahs (Chapters)
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_QURAN_API_URL}/api/v4/chapters?language=fr`)
            .then(res => setChapters(res.data.chapters))
            .catch(err => console.error("Erreur lors du chargement des sourates:", err));
    }, []);

    // Fetch the Arabic verses of a specific Surah
    const fetchVerses = async (chapterId) => {
        setLoading(true);
        setSelectedChapter(chapters.find(c => c.id === chapterId));
        try {
            const res = await axios.get(`${import.meta.env.VITE_QURAN_API_URL}/api/v4/quran/verses/uthmani?chapter_number=${chapterId}`);
            setVerses(res.data.verses);
        } catch (err) {
            console.error("Erreur lors du chargement des versets:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto mt-16 mb-24 px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Le Noble Coran 📖</h2>
            
            {!selectedChapter ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto p-4 bg-black/20 rounded-3xl border border-white/5 custom-scrollbar">
                    {chapters.map(chapter => (
                        <button 
                            key={chapter.id}
                            onClick={() => fetchVerses(chapter.id)}
                            className="flex flex-col items-center justify-center p-4 bg-white/5 hover:bg-emerald-600 rounded-2xl transition-all shadow-md transform hover:scale-105"
                        >
                            <span className="text-emerald-400 font-bold mb-1 text-sm">N° {chapter.id}</span>
                            <h3 className="font-bold text-lg mb-1">{chapter.name_simple}</h3>
                            <p className="text-2xl text-amber-300 font-arabic">{chapter.name_arabic}</p>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="bg-white/10 p-6 sm:p-10 rounded-3xl shadow-2xl relative border border-white/10">
                    <button 
                        onClick={() => setSelectedChapter(null)}
                        className="absolute top-6 left-6 bg-slate-800 hover:bg-slate-700 px-6 py-2 rounded-full text-sm font-bold shadow-md transition-all"
                    >
                        🔙 Retour aux Sourates
                    </button>
                    <h3 className="text-3xl sm:text-4xl font-bold text-center mb-10 pt-12 text-emerald-400 font-arabic">
                        {selectedChapter.name_arabic}
                        <span className="block text-xl text-gray-300 mt-2 font-sans">Sourate {selectedChapter.name_simple}</span>
                    </h3>
                    
                    {loading ? (
                        <div className="flex justify-center items-center h-48">
                            <p className="text-xl animate-pulse text-emerald-300">Chargement des versets...</p>
                        </div>
                    ) : (
                        <div className="text-right space-y-2 font-arabic text-3xl sm:text-4xl leading-loose" dir="rtl">
                            {verses.map(v => (
                                <span key={v.id} className="inline leading-[3rem]">
                                    {v.text_uthmani} 
                                    <span className="inline-flex items-center justify-center bg-emerald-700/60 text-amber-300 text-lg w-10 h-10 rounded-full mx-3 font-mono shadow-inner border border-emerald-500/50">
                                        {v.verse_key.split(':')[1]}
                                    </span>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
