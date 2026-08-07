import React, { useState } from 'react';
import AdhkarList from '../components/AdhkarList';
import adhkarData from '../data/adhkar.json';
import { BookOpen, ChevronDown, Search } from 'lucide-react';

export default function Adhkar() {
    const categories = ['Toutes', ...new Set(adhkarData.map(a => a.category))];
    const [selectedCategory, setSelectedCategory] = useState('Toutes');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="pt-8 px-4 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-white flex justify-center items-center gap-3">
                <BookOpen size={28} /> Invocations
            </h2>
            
            <div className="w-full max-w-sm mx-auto mb-8 flex flex-col gap-4">
                {/* Search Bar */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search size={20} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher une invocation..."
                        className="w-full bg-[#111] border border-[#333] hover:border-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white py-4 pl-12 pr-4 rounded-xl transition-all shadow-lg text-base"
                    />
                </div>

                {/* Category Dropdown */}
                <div className="relative z-20">
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full flex items-center justify-between bg-[#111] border border-[#333] hover:border-gray-500 text-white py-4 px-6 rounded-xl transition-all shadow-lg"
                    >
                        <span className="font-bold text-lg">{selectedCategory}</span>
                        <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-[#0a0a0a] border border-[#333] rounded-xl overflow-hidden shadow-2xl z-30 max-h-64 overflow-y-auto custom-scrollbar">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => { 
                                        setSelectedCategory(cat); 
                                        setIsDropdownOpen(false); 
                                    }}
                                    className={`w-full text-left px-6 py-4 hover:bg-[#1a1a1a] transition-colors border-b border-[#222] last:border-0 ${selectedCategory === cat ? 'bg-[#111] font-bold text-white' : 'text-gray-400'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            <AdhkarList category={selectedCategory} searchQuery={searchQuery} />
        </div>
    );
}
