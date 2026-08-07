import React from 'react';
import adhkarData from '../data/adhkar.json';
import DhikrCard from './DhikrCard';

export default function AdhkarList({ category }) {
    // Filter data dynamically based on selected category
    const filteredAdhkar = adhkarData.filter(a => a.category === category);

    return (
        <div className="space-y-6 pb-24">
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
