import React, { useState, useEffect } from 'react';
import hadithsData from '../data/hadiths.json';
import { Scroll, Search, Bookmark, BookmarkCheck, Share2, Gem, Check, X, CheckCircle, BookOpen } from 'lucide-react';

const CATEGORY_COLORS = {
    'Foi & Intention': 'bg-emerald-950/60 text-emerald-300 border-emerald-800',
    'Fondements de la Foi': 'bg-blue-950/60 text-blue-300 border-blue-800',
    'Foi & Destin': 'bg-violet-950/60 text-violet-300 border-violet-800',
    'Pratique & Conformité': 'bg-amber-950/60 text-amber-300 border-amber-800',
    'Spiritualité & Cœur': 'bg-rose-950/60 text-rose-300 border-rose-800',
    'Comportement & Fraternité': 'bg-cyan-950/60 text-cyan-300 border-cyan-800',
    'Morale & Noblesse': 'bg-indigo-950/60 text-indigo-300 border-indigo-800'
};

export default function Hadiths() {
    const [selectedCategory, setSelectedCategory] = useState('Tout');
    const [searchQuery, setSearchQuery] = useState('');
    const [favorites, setFavorites] = useState([]);
    const [readHadiths, setReadHadiths] = useState([]);
    const [copiedId, setCopiedId] = useState(null);
    const [selectedHadith, setSelectedHadith] = useState(null);

    useEffect(() => {
        const savedFavs = localStorage.getItem('hadith_favorites');
        if (savedFavs) {
            try {
                setFavorites(JSON.parse(savedFavs));
            } catch (e) {
                console.error(e);
            }
        }
        const savedReads = localStorage.getItem('hadiths_read');
        if (savedReads) {
            try {
                setReadHadiths(JSON.parse(savedReads));
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setSelectedHadith(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
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

    const toggleRead = (id) => {
        let updated;
        if (readHadiths.includes(id)) {
            updated = readHadiths.filter(readId => readId !== id);
        } else {
            updated = [...readHadiths, id];
        }
        setReadHadiths(updated);
        localStorage.setItem('hadiths_read', JSON.stringify(updated));
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
            (hadith.arabic && hadith.arabic.includes(searchQuery)) ||
            hadith.narrator.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesQuery;
    });

    const truncateTranslation = (text) => {
        if (!text) return '';
        if (text.length > 180) {
            return text.substring(0, 180) + '...';
        }
        return text;
    };

    const totalHadiths = hadithsData.length;
    const readCount = readHadiths.length;
    const progressPercent = totalHadiths > 0 ? (readCount / totalHadiths) * 100 : 0;

    return (
        <div className="w-full max-w-5xl mx-auto py-6 px-4 flex flex-col min-h-screen relative">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 flex items-center justify-center gap-3">
                    <Scroll className="text-gray-400" size={32} />
                    Hadiths Authentiques (An-Nawawi)
                </h2>
                <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto mb-6">
                    Explorez les 40 Hadiths d'An-Nawawi, fondements spirituels et éthiques de l'Islam avec commentaires.
                </p>

                {/* Progress Bar */}
                <div className="max-w-md mx-auto bg-[#111] border border-[#333] rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-300">Progression de lecture</span>
                        <span className="text-sm font-bold text-emerald-400">{readCount}/{totalHadiths} lus</span>
                    </div>
                    <div className="w-full bg-[#222] rounded-full h-2.5">
                        <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredHadiths.map(hadith => {
                        const isFav = favorites.includes(hadith.id);
                        const isRead = readHadiths.includes(hadith.id);
                        const categoryColorClass = CATEGORY_COLORS[hadith.category] || 'bg-gray-800 text-gray-300 border-gray-700';

                        return (
                            <div 
                                key={hadith.id}
                                className={`bg-[#0a0a0a] border border-[#333] hover:border-gray-600 rounded-2xl p-5 sm:p-6 transition-all shadow-xl flex flex-col justify-between ${
                                    isRead ? 'opacity-60' : ''
                                }`}
                            >
                                <div>
                                    {/* Top Meta Info */}
                                    <div className="flex items-center justify-between mb-4 border-b border-[#222] pb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-full bg-[#111] border border-[#333] flex items-center justify-center font-mono font-bold text-xs text-white">
                                                {hadith.id}
                                            </span>
                                            <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 border rounded-full ${categoryColorClass}`}>
                                                {hadith.category}
                                            </span>
                                            {isRead && (
                                                <span className="text-emerald-500 flex items-center ml-1" title="Lu">
                                                    <CheckCircle size={16} />
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1 sm:gap-2">
                                            <button
                                                onClick={() => copyHadith(hadith)}
                                                className="p-1.5 sm:p-2 bg-[#111] hover:bg-[#222] border border-[#333] text-gray-400 hover:text-white rounded-lg sm:rounded-xl transition-all"
                                                title="Copier le Hadith"
                                            >
                                                {copiedId === hadith.id ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
                                            </button>

                                            <button
                                                onClick={() => toggleFavorite(hadith.id)}
                                                className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all border ${
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
                                    <h3 className="text-lg sm:text-xl font-bold text-white mb-3 line-clamp-2">
                                        {hadith.title}
                                    </h3>

                                    {/* French Translation */}
                                    <p className="text-gray-400 text-sm leading-relaxed mb-4 font-sans">
                                        "{truncateTranslation(hadith.translation)}"
                                    </p>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mt-2 mb-3">
                                        <button 
                                            onClick={() => setSelectedHadith(hadith)}
                                            className="flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                                        >
                                            <BookOpen size={16} />
                                            Lire en détail
                                        </button>
                                        <button
                                            onClick={() => toggleRead(hadith.id)}
                                            className={`text-xs px-3 py-1.5 border rounded-lg transition-colors flex items-center gap-1 ${
                                                isRead 
                                                ? 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700' 
                                                : 'bg-emerald-900/30 text-emerald-400 border-emerald-800/50 hover:bg-emerald-900/50'
                                            }`}
                                        >
                                            <CheckCircle size={14} />
                                            {isRead ? 'Marqué comme lu' : 'Marquer comme lu'}
                                        </button>
                                    </div>

                                    {/* Narrator */}
                                    <div className="pt-3 border-t border-[#222]">
                                        <span className="text-[11px] sm:text-xs text-gray-500 italic block truncate">
                                            {hadith.narrator}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Read Mode Overlay */}
            {selectedHadith && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#0a0a0a] border border-[#333] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl relative">
                        {/* Overlay Header */}
                        <div className="flex justify-between items-center p-4 border-b border-[#222]">
                            <div className="flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-[#111] border border-[#333] flex items-center justify-center font-mono font-bold text-xs text-white">
                                    {selectedHadith.id}
                                </span>
                                <h3 className="text-lg font-bold text-white truncate max-w-[200px] sm:max-w-sm">
                                    {selectedHadith.title}
                                </h3>
                            </div>
                            <button 
                                onClick={() => setSelectedHadith(null)}
                                className="p-2 bg-[#111] hover:bg-[#222] border border-[#333] text-gray-400 hover:text-white rounded-xl transition-all"
                                title="Fermer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Overlay Content */}
                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                            <div className="mb-6 flex flex-wrap gap-2">
                                <span className={`text-xs font-semibold px-2.5 py-1 border rounded-full ${CATEGORY_COLORS[selectedHadith.category] || 'bg-gray-800 text-gray-300 border-gray-700'}`}>
                                    {selectedHadith.category}
                                </span>
                            </div>

                            {selectedHadith.arabic && (
                                <div className="bg-[#111] p-6 rounded-xl border border-[#222] mb-6 text-right">
                                    <p className="font-arabic text-3xl sm:text-4xl leading-[2.2] tracking-wide text-white" dir="rtl">
                                        {selectedHadith.arabic}
                                    </p>
                                </div>
                            )}

                            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6 font-sans">
                                "{selectedHadith.translation}"
                            </p>

                            <div className="bg-[#111] p-4 rounded-xl border border-[#222] mb-6">
                                <span className="text-sm text-gray-400 font-medium">Rapporteur :</span>
                                <p className="text-gray-200 mt-1">{selectedHadith.narrator}</p>
                            </div>

                            {selectedHadith.lesson && (
                                <div className="flex items-start gap-3 text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 p-4 rounded-xl">
                                    <Gem size={20} className="flex-shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold text-sm mb-1 block">Leçon à tirer</span>
                                        <p className="text-sm text-emerald-200/80">{selectedHadith.lesson}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Overlay Footer */}
                        <div className="p-4 border-t border-[#222] flex justify-end gap-3">
                            <button
                                onClick={() => toggleRead(selectedHadith.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all border ${
                                    readHadiths.includes(selectedHadith.id)
                                    ? 'bg-[#111] text-gray-400 border-[#333] hover:text-white'
                                    : 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500'
                                }`}
                            >
                                <CheckCircle size={18} />
                                {readHadiths.includes(selectedHadith.id) ? 'Marqué comme lu' : 'Marquer comme lu'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
