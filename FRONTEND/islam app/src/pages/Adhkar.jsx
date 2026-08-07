import React, { useState } from 'react';
import AdhkarList from '../components/AdhkarList';
import adhkarData from '../data/adhkar.json';
import { BookOpen, ChevronDown, Search } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function Adhkar() {
    const categories = ['Toutes', ...new Set(adhkarData.map(a => a.category))];
    const [selectedCategory, setSelectedCategory] = useState('Toutes');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="min-h-screen pb-24 p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                <PageHeader 
                    icon={<BookOpen size={32} />} 
                    title="Adhkar & Invocations" 
                    subtitle="Protégez-vous avec les évocations du matin, du soir et d'après la prière." 
                />
            
                <div className="w-full max-w-xl mx-auto mb-10 flex flex-col sm:flex-row gap-4">
                {/* Search Bar */}
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search size={20} className="text-theme-primary" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Chercher (ex: matin, protection...)"
                        className="w-full bg-theme-surface border border-theme-border hover:border-theme-primary/50 focus:border-theme-primary focus:ring-1 focus:ring-theme-primary text-theme-text py-3.5 pl-12 pr-4 rounded-xl transition-all shadow-lg text-sm"
                    />
                </div>

                {/* Category Dropdown */}
                <div className="relative z-20 sm:w-56">
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full flex items-center justify-between bg-theme-surface border border-theme-border hover:border-theme-primary/50 focus:border-theme-primary text-theme-text py-3.5 px-5 rounded-xl transition-all shadow-lg"
                    >
                        <span className="font-bold text-sm truncate">{selectedCategory}</span>
                        <ChevronDown size={18} className={`text-theme-primary transition-transform duration-300 ml-2 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isDropdownOpen && (
                        <div className="absolute top-full right-0 w-full sm:w-72 mt-3 bg-theme-surface/95 backdrop-blur-xl border border-theme-primary/30 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-50 max-h-72 overflow-y-auto custom-scrollbar ring-1 ring-white/10 overflow-hidden">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => { 
                                        setSelectedCategory(cat); 
                                        setIsDropdownOpen(false); 
                                    }}
                                    className={`w-full text-left px-5 py-4 hover:bg-theme-surface-hover transition-colors border-b border-theme-border/50 last:border-0 text-sm ${selectedCategory === cat ? 'bg-theme-primary/10 font-bold text-theme-primary' : 'text-theme-text'}`}
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
        </div>
    );
}
