import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Names() {
    const [names, setNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
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

    const filteredNames = names.filter(name => 
        name.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
        name.en.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
        name.name.includes(searchTerm)
    );

    const totalPages = Math.ceil(filteredNames.length / itemsPerPage);
    const paginatedNames = filteredNames.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Reset pagination when searching
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

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

            <div className="max-w-md mx-auto mb-10 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input 
                    type="text" 
                    placeholder="Rechercher (ex: Rahman, Merciful...)" 
                    className="w-full bg-[#111] border border-[#333] text-white py-3 pl-12 pr-4 rounded-full outline-none focus:border-gray-500 transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
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
                            <div key={name.number} className="relative group bg-[#0a0a0a] hover:bg-[#111] border border-[#333] hover:border-gray-500 p-6 rounded-2xl transition-all duration-300 flex flex-col items-center text-center">
                                <span className="absolute top-4 left-4 text-gray-600 font-bold text-sm">{name.number}</span>
                                
                                <h3 className="text-5xl font-arabic text-white mb-4 mt-6 leading-tight">
                                    {name.name}
                                </h3>
                                
                                <h4 className="text-xl font-bold text-white mb-2 tracking-wide">
                                    {name.transliteration}
                                </h4>
                                
                                <p className="text-gray-300 text-sm">
                                    {name.en.meaning}
                                </p>
                            </div>
                        ))}
                    </div>
                    
                    {totalPages > 1 && (
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
        </div>
    );
}
