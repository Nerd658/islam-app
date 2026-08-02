import React, { useState, useEffect } from 'react';
import hadithsData from '../data/hadiths.json';
import { Scroll, Search, Bookmark, BookmarkCheck, Share2, Sparkles, Volume2, Check } from 'lucide-react';

export default function Hadiths() {
    const [selectedCategory, setSelectedCategory] = useState('Tout');
    const [searchQuery, setSearchQuery] = useState('');
    const [favorites, setFavorites] = useState([]);
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        const savedFavs = localStorage.getItem('hadith_favorites');
        if (savedFavs) {
            try {
                setFavorites(JSON.parse(savedFavs));
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    const toggleFavorite = (id) => {
        let updated;
        if (favorites.includes(id)) {
            updated = favorites.filter(favId => favId !== id);
        } else {
            updated = [...favorites, id];
        }
        setFavorites(updated);
        localStorage.setItem('hadith_favorites', JSON.stringify(updated));
    };

    const copyHadith = (hadith) => {
        const textToCopy = `[Hadith N°${hadith.id}] ${hadith.title}\n\n"${hadith.translation}"\n\n— ${hadith.narrator}`;
        navigator.clipboard.writeText(textToCopy);
        setCopiedId(hadith.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const categories = ['Tout', 'Favoris', ...new Set(hadithsData.map(h => h.category))];

    const filteredHadiths = hadithsData.filter(hadith => {
        const matchesCategory = 
            selectedCategory === 'Tout' ? true :
            selectedCategory === 'Favoris' ? favorites.includes(hadith.id) :
            hadith.category === selectedCategory;

        const matchesQuery = 
            hadith.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hadith.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hadith.arabic.includes(searchQuery) ||
            hadith.narrator.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesQuery;
    });

    return (
        <div className="w-full max-w-5xl mx-auto py-6 px-4 flex flex-col min-h-screen">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 flex items-center justify-center gap-3">
                    <Scroll className="text-gray-400" size={32} />
                    Hadiths Authentiques (An-Nawawi)
                </h2>
                <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
                    Explorez les 40 Hadiths d'An-Nawawi, fondements spirituels et éthiques de l'Islam avec commentaires.
                </p>
            </div>

            {/* Controls Bar: Search & Category Tabs */}
            <div className="bg-[#0a0a0a] border border-[#333] p-4 rounded-2xl mb-8 shadow-xl flex flex-col gap-4">
                <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Rechercher un hadith (titre, sens, rapporteur...)"
                        className="w-full bg-[#111] border border-[#333] text-white py-2.5 pl-11 pr-4 rounded-xl outline-none focus:border-gray-500 transition-colors shadow-inner text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                                selectedCategory === cat
                                    ? 'bg-white text-black border-white shadow-md'
                                    : 'bg-[#111] text-gray-400 border-[#333] hover:text-white'
                            }`}
                        >
                            {cat} {cat === 'Favoris' && `(${favorites.length})`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Hadiths Cards List */}
            {filteredHadiths.length === 0 ? (
                <div className="flex justify-center items-center h-48 bg-[#0a0a0a] border border-[#333] rounded-2xl">
                    <p className="text-gray-500 text-sm">
                        {selectedCategory === 'Favoris' 
                            ? "Aucun hadith dans vos favoris. Cliquez sur le marque-page pour en ajouter !" 
                            : `Aucun hadith trouvé pour "${searchQuery}"`}
                    </p>
                </div>
            ) : (
                <div className="flex flex-col space-y-6">
                    {filteredHadiths.map(hadith => {
                        const isFav = favorites.includes(hadith.id);
                        return (
                            <div 
                                key={hadith.id}
                                className="bg-[#0a0a0a] border border-[#333] hover:border-gray-600 rounded-2xl p-6 sm:p-8 transition-all shadow-xl relative overflow-hidden group"
                            >
                                {/* Top Meta Info */}
                                <div className="flex items-center justify-between mb-4 border-b border-[#222] pb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-[#111] border border-[#333] flex items-center justify-center font-mono font-bold text-xs text-white">
                                            {hadith.id}
                                        </span>
                                        <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-950/60 text-emerald-300 border border-emerald-800 rounded-full">
                                            {hadith.category}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => copyHadith(hadith)}
                                            className="p-2 bg-[#111] hover:bg-[#222] border border-[#333] text-gray-400 hover:text-white rounded-xl transition-all"
                                            title="Copier le Hadith"
                                        >
                                            {copiedId === hadith.id ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
                                        </button>

                                        <button
                                            onClick={() => toggleFavorite(hadith.id)}
                                            className={`p-2 rounded-xl transition-all border ${
                                                isFav 
                                                    ? 'bg-emerald-950 border-emerald-700 text-emerald-400' 
                                                    : 'bg-[#111] border-[#333] text-gray-400 hover:text-white'
                                            }`}
                                            title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
                                        >
                                            {isFav ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Hadith Title */}
                                <h3 className="text-xl font-bold text-white mb-4">
                                    {hadith.title}
                                </h3>

                                {/* Arabic Text */}
                                <div className="bg-[#111] p-5 sm:p-6 rounded-xl border border-[#222] mb-4 text-right">
                                    <p className="font-arabic text-2xl sm:text-3xl leading-[2.4] tracking-wide text-white" dir="rtl">
                                        {hadith.arabic}
                                    </p>
                                </div>

                                {/* French Translation */}
                                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4 font-sans">
                                    "{hadith.translation}"
                                </p>

                                {/* Narrator & Spiritual Lesson */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#222]">
                                    <span className="text-xs text-gray-500 italic">
                                        {hadith.narrator}
                                    </span>

                                    {hadith.lesson && (
                                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-950/40 border border-emerald-900/50 px-3 py-1.5 rounded-lg">
                                            <Sparkles size={14} className="flex-shrink-0" />
                                            <span>{hadith.lesson}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
