import React, { useState, useEffect } from 'react';
import adhkarData from '../data/adhkar.json';
import DhikrCard from './DhikrCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdhkarList({ category, searchQuery }) {
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 4;

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [category, searchQuery]);

    // Filter data dynamically based on selected category and search query
    const filteredAdhkar = adhkarData.filter(a => {
        const matchesCategory = category === 'Toutes' || a.category === category;
        const matchesSearch = !searchQuery || 
            (a.translation && a.translation.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (a.arabic && a.arabic.includes(searchQuery)) ||
            (a.source && a.source.toLowerCase().includes(searchQuery.toLowerCase()));
        
        return matchesCategory && matchesSearch;
    });

    if (filteredAdhkar.length === 0) {
        return (
            <div className="text-center text-gray-500 py-12">
                Aucune invocation trouvée.
            </div>
        );
    }

    const totalPages = Math.ceil(filteredAdhkar.length / ITEMS_PER_PAGE);
    const paginatedAdhkar = filteredAdhkar.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="pb-32">
            <div className="space-y-6">
                {paginatedAdhkar.map((dhikr, index) => (
                    <DhikrCard 
                        key={dhikr.id || index} 
                        arabic={dhikr.arabic} 
                        translation={dhikr.translation} 
                        count={dhikr.count}
                        source={dhikr.source}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-xl border transition-all ${currentPage === 1 ? 'bg-theme-surface border-theme-border text-theme-text-muted/30 cursor-not-allowed' : 'bg-theme-surface-hover border-theme-border text-theme-text hover:text-theme-primary shadow-sm'}`}
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div className="text-theme-text-muted font-mono bg-theme-surface px-4 py-2 rounded-xl border border-theme-border shadow-sm">
                        Page {currentPage} / {totalPages}
                    </div>
                    <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-xl border transition-all ${currentPage === totalPages ? 'bg-theme-surface border-theme-border text-theme-text-muted/30 cursor-not-allowed' : 'bg-theme-surface-hover border-theme-border text-theme-text hover:text-theme-primary shadow-sm'}`}
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            )}
        </div>
    );
}
