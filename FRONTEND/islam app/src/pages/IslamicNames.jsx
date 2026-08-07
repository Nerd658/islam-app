import React, { useState, useMemo } from 'react';
import { Type, Search, User, UserCheck } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import namesData from '../data/islamic_names.json';

export default function IslamicNames() {
    const [names, setNames] = useState(namesData);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGender, setFilterGender] = useState('all'); // all, male, female



    const filteredNames = useMemo(() => {
        return names.filter(n => {
            const matchesGender = filterGender === 'all' || n.gender === filterGender;
            const matchesSearch = n.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  n.meaning.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesGender && matchesSearch;
        });
    }, [names, searchTerm, filterGender]);

    return (
        <div className="pt-8 px-4 max-w-5xl mx-auto pb-24">
            <PageHeader 
                icon={<Type size={32} />} 
                title="Prénoms Islamiques" 
                subtitle="Découvrez notre sélection de prénoms authentiques pour garçons et filles." 
            />

            <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full md:flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-text-muted w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Rechercher par prénom ou signification..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-theme-surface border border-theme-border rounded-xl pl-12 pr-4 py-3.5 text-theme-text outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme-primary transition-all shadow-sm"
                    />
                </div>
                
                <div className="flex bg-theme-surface border border-theme-border rounded-xl p-1.5 w-full md:w-auto shadow-sm">
                    <button 
                        onClick={() => setFilterGender('all')}
                        className={`flex-1 md:px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${filterGender === 'all' ? 'bg-theme-surface-hover text-theme-text shadow-sm border border-theme-border' : 'text-theme-text-muted hover:text-theme-text'}`}
                    >
                        Tous
                    </button>
                    <button 
                        onClick={() => setFilterGender('male')}
                        className={`flex-1 md:px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors flex justify-center items-center gap-2 ${filterGender === 'male' ? 'bg-theme-surface-hover text-theme-text shadow-sm border border-theme-border' : 'text-theme-text-muted hover:text-theme-text'}`}
                    >
                        <User size={16} className={filterGender === 'male' ? 'text-blue-400' : ''} /> Garçons
                    </button>
                    <button 
                        onClick={() => setFilterGender('female')}
                        className={`flex-1 md:px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors flex justify-center items-center gap-2 ${filterGender === 'female' ? 'bg-theme-surface-hover text-theme-text shadow-sm border border-theme-border' : 'text-theme-text-muted hover:text-theme-text'}`}
                    >
                        <UserCheck size={16} className={filterGender === 'female' ? 'text-rose-400' : ''} /> Filles
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
                {filteredNames.length > 0 ? filteredNames.map(name => (
                        <div key={name.id} className="bg-theme-surface border border-theme-border hover:border-theme-primary/50 transition-all rounded-3xl p-6 flex flex-col h-full group shadow-lg hover:shadow-theme-primary/5">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-xl font-bold text-theme-text group-hover:text-theme-primary transition-colors">{name.name}</h3>
                                <span dir="rtl" className="text-2xl font-arabic text-theme-text-muted group-hover:text-theme-text transition-colors">{name.arabic}</span>
                            </div>
                            
                            <p className="text-sm text-theme-text-muted mb-6 flex-1 leading-relaxed">
                                {name.meaning}
                            </p>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-theme-border">
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${
                                    name.gender === 'male' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}>
                                    {name.gender === 'male' ? 'Garçon' : 'Fille'}
                                </span>
                                
                                {name.origin && (
                                    <span className="text-[10px] text-theme-text-muted/60 font-mono uppercase tracking-widest">{name.origin}</span>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-16 text-center text-theme-text-muted bg-theme-surface border border-theme-border rounded-3xl">
                            <Type size={32} className="mx-auto mb-3 opacity-20" />
                            Aucun prénom ne correspond à votre recherche.
                        </div>
                    )}
                </div>
        </div>
    );
}
