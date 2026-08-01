import React, { useState } from 'react';
import AdhkarList from '../components/AdhkarList';
import adhkarData from '../data/adhkar.json';
import { BookOpen } from 'lucide-react';

export default function Adhkar() {
    // Extract unique categories from the JSON dynamically
    const categories = [...new Set(adhkarData.map(a => a.category))];
    const [selectedCategory, setSelectedCategory] = useState(categories[0] || 'Matin');

    return (
        <div className="pt-8 px-4 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-white flex justify-center items-center gap-3">
                <BookOpen size={28} /> Invocations
            </h2>
            
            <div className="flex overflow-x-auto pb-4 mb-6 hide-scrollbar gap-3 snap-x">
                {categories.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`whitespace-nowrap snap-center py-2 px-6 rounded-full font-bold transition-all ${selectedCategory === cat ? 'bg-white text-black shadow-lg scale-105' : 'bg-[#111] text-gray-500 hover:text-white border border-[#333]'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            
            <AdhkarList category={selectedCategory} />
        </div>
    );
}
