import React from 'react';
import adhkarData from '../data/adhkar.json';
import DhikrCard from './DhikrCard';

export default function AdhkarList({ category, searchQuery }) {
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

    return (
        <div className="space-y-6 pb-32">
            {filteredAdhkar.map((dhikr, index) => (
                <DhikrCard 
                    key={dhikr.id || index} 
                    arabic={dhikr.arabic} 
                    translation={dhikr.translation} 
                    count={dhikr.count}
                    source={dhikr.source}
                />
            ))}
        </div>
    );
}
