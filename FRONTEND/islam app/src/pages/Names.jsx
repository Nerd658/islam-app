import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, Search, ChevronLeft, ChevronRight, Heart, X, Gem } from 'lucide-react';
import namesDetails from '../data/names_details.json';

export default function Names() {
    const [names, setNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('asma_favorites');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Erreur parsing asma_favorites", e);
                return [];
            }
        }
        return [];
    });
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    
    const [selectedName, setSelectedName] = useState(null);

    const itemsPerPage = 20;

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_ALADHAN_API_URL}/v1/asmaAlHusna`)
            .then(res => {
                setNames(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur de récupération des 99 noms:", err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        localStorage.setItem('asma_favorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (e, number) => {
        e.stopPropagation();
        setFavorites(prev => 
            prev.includes(number) 
                ? prev.filter(n => n !== number)
                : [...prev, number]
        );
    };

    let filteredNames = names.filter(name => 
        name.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
        name.en.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
        name.name.includes(searchTerm)
    );

    if (showFavoritesOnly) {
        filteredNames = filteredNames.filter(name => favorites.includes(name.number));
    }

    const totalPages = Math.ceil(filteredNames.length / itemsPerPage);
    const paginatedNames = showFavoritesOnly 
        ? filteredNames 
        : filteredNames.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, showFavoritesOnly]);

    return (
        <div className="pt-8 px-4 max-w-5xl mx-auto mb-24">
            <div className="flex items-center justify-center gap-3 mb-8">
                <Star size={32} className="text-white" />
                <h2 className="text-3xl font-bold text-center text-white">Les 99 Noms d'Allah</h2>
                <Star size={32} className="text-white" />
            </div>
            
            <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto">
                "C'est à Allah qu'appartiennent les noms les plus beaux. Invoquez-Le par ces noms." (Coran 7:180)
            </p>

            <div className="max-w-md mx-auto mb-6 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input 
                    type="text" 
                    placeholder="Rechercher (ex: Rahman, Merciful...)" 
                    className="w-full bg-[#111] border border-[#333] text-white py-3 pl-12 pr-4 rounded-full outline-none focus:border-gray-500 transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex justify-center gap-4 mb-10">
                <div 
                    onClick={() => setShowFavoritesOnly(false)}
                    className={`cursor-pointer px-6 py-2 rounded-full border transition-colors ${!showFavoritesOnly ? 'bg-white text-black border-white' : 'bg-[#111] text-gray-400 border-[#333] hover:border-gray-500'}`}
                >
                    Tous les Noms
                </div>
                <div 
                    onClick={() => setShowFavoritesOnly(true)}
                    className={`cursor-pointer px-6 py-2 rounded-full border flex items-center gap-2 transition-colors ${showFavoritesOnly ? 'bg-white text-black border-white' : 'bg-[#111] text-gray-400 border-[#333] hover:border-gray-500'}`}
                >
                    <Heart size={18} className={showFavoritesOnly ? 'fill-black' : ''} />
                    Favoris
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-xl text-gray-300">Chargement des Noms grandioses...</p>
                </div>
            ) : filteredNames.length === 0 ? (
                <div className="flex justify-center items-center h-48">
                    <p className="text-gray-500">Aucun nom trouvé pour "{searchTerm}"</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {paginatedNames.map(name => (
                            <div 
                                key={name.number} 
                                onClick={() => setSelectedName(name)}
                                className="relative group bg-[#0a0a0a] hover:bg-[#111] border border-[#333] hover:border-gray-500 p-6 rounded-2xl transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
                            >
                                <span className="absolute top-4 left-4 text-gray-600 font-bold text-sm font-mono">{name.number}</span>
                                <div 
                                    onClick={(e) => toggleFavorite(e, name.number)}
                                    className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                                >
                                    <Heart size={20} className={favorites.includes(name.number) ? 'fill-white text-white' : ''} />
                                </div>
                                
                                <h3 className="text-5xl font-arabic text-white mb-4 mt-6 leading-tight">
                                    {name.name}
                                </h3>
                                
                                <h4 className="text-xl font-bold text-white mb-2 tracking-wide">
                                    {name.transliteration}
                                </h4>
                                
                                <p className="text-gray-400 text-sm">
                                    {name.en.meaning}
                                </p>
                            </div>
                        ))}
                    </div>
                    
                    {!showFavoritesOnly && totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-12">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-3 bg-[#111] border border-[#333] rounded-lg disabled:opacity-30 hover:bg-[#222] transition-colors"
                            >
                                <ChevronLeft size={20} className="text-white" />
                            </button>
                            <span className="text-gray-400 font-medium">Page {currentPage} sur {totalPages}</span>
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-3 bg-[#111] border border-[#333] rounded-lg disabled:opacity-30 hover:bg-[#222] transition-colors"
                            >
                                <ChevronRight size={20} className="text-white" />
                            </button>
                        </div>
                    )}
                </>
            )}

            {selectedName && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedName(null)}>
                    <div 
                        className="bg-[#0a0a0a] border border-[#333] rounded-3xl p-8 max-w-md w-full relative flex flex-col items-center text-center"
                        onClick={e => e.stopPropagation()}
                    >
                        <div 
                            onClick={() => setSelectedName(null)}
                            className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </div>

                        <span className="text-gray-600 font-mono font-bold mb-4">#{selectedName.number}</span>
                        <div className="text-center">
                            <h3 className="text-5xl font-arabic text-emerald-400 mb-6 drop-shadow-lg">{selectedName.name}</h3>
                            <h4 className="text-2xl font-bold text-white mb-2">{selectedName.transliteration}</h4>
                            <p className="text-emerald-500 font-semibold mb-8">{selectedName.en.meaning}</p>
                            
                            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6 text-left">
                                    <h5 className="text-white font-bold mb-2 flex items-center gap-2">
                                        <Gem size={16} className="text-emerald-500" />
                                        Bienfaits
                                    </h5>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {namesDetails.find(n => n.number === selectedName.number)?.benefits || "Contempler ce Nom dans vos prières permet de rapprocher le cœur d'Allah et de renforcer votre connexion spirituelle."}
                                    </p>
                                </div>
                                
                                {namesDetails.find(n => n.number === selectedName.number)?.dua && (
                                    <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-6 text-left">
                                        <h5 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                                            <Heart size={16} className="text-emerald-500" />
                                            Invocation (Dua)
                                        </h5>
                                        <p className="text-emerald-100/90 text-sm leading-relaxed italic">
                                            "{namesDetails.find(n => n.number === selectedName.number)?.dua}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
