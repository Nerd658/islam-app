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
            <h2 className="text-3xl font-bold text-center mb-8 text-theme-text flex justify-center items-center gap-3">
                <BookOpen size={28} className="text-theme-primary" /> Invocations
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
                        className="w-full bg-theme-surface border border-theme-border hover:border-theme-text-muted focus:border-theme-primary focus:ring-1 focus:ring-theme-primary text-theme-text py-4 pl-12 pr-4 rounded-xl transition-all shadow-lg text-base"
                    />
                </div>

                {/* Category Dropdown */}
                <div className="relative z-20">
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full flex items-center justify-between bg-theme-surface border border-theme-border hover:border-theme-text-muted text-theme-text py-4 px-6 rounded-xl transition-all shadow-lg"
                    >
                        <span className="font-bold text-lg">{selectedCategory}</span>
                        <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-theme-surface border border-theme-border rounded-xl overflow-hidden shadow-2xl z-30 max-h-64 overflow-y-auto custom-scrollbar">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => { 
                                        setSelectedCategory(cat); 
                                        setIsDropdownOpen(false); 
                                    }}
                                    className={`w-full text-left px-6 py-4 hover:bg-theme-surface-hover transition-colors border-b border-theme-border last:border-0 ${selectedCategory === cat ? 'bg-theme-surface-hover font-bold text-theme-primary' : 'text-theme-text-muted'}`}
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
