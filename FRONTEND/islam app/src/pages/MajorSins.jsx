import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { ShieldAlert, BookOpen, Tag } from 'lucide-react';
import majorSinsData from '../data/major_sins.json';
import MajorSinsSkeleton from '../components/MajorSinsSkeleton';

export default function MajorSins() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 400);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="pt-8 px-4 max-w-4xl mx-auto pb-24">
            <PageHeader 
                icon={<ShieldAlert size={32} className="text-red-500" />} 
                title="Les Grands Péchés (Al-Kaba'ir)" 
                subtitle="Découvrez et comprenez les actes majeurs interdits en Islam pour mieux vous en préserver." 
            />

            <div className="mt-8">
                {loading ? (
                    <MajorSinsSkeleton />
                ) : (
                    <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
                        {majorSinsData.map((sin) => (
                            <div key={sin.id} className="snap-center shrink-0 w-[85%] sm:w-[350px] bg-theme-surface border border-theme-border hover:border-red-900/50 rounded-2xl p-6 shadow-lg transition-all hover:shadow-red-900/10 group relative overflow-hidden flex flex-col">
                                <div className="absolute top-0 right-0 w-2 h-full bg-red-500/20 group-hover:bg-red-500/80 transition-colors"></div>
                                
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex shrink-0 items-center justify-center w-10 h-10 rounded-full bg-red-950/30 border border-red-900/50 text-red-500 font-bold">
                                            {sin.id}
                                        </div>
                                        <h3 className="font-bold text-theme-text text-xl leading-tight">{sin.title}</h3>
                                    </div>
                                    <span className="text-2xl font-arabic text-theme-text-muted shrink-0" dir="rtl">{sin.arabic}</span>
                                </div>
                                
                                <p className="text-theme-text-muted leading-relaxed mb-6 flex-1">
                                    {sin.description}
                                </p>
                                
                                <div className="flex flex-wrap items-center gap-2 border-t border-theme-border pt-4 mt-auto">
                                    <div className="flex items-center gap-1.5 text-xs text-theme-text-muted/70 bg-theme-bg px-2.5 py-1 rounded-md border border-theme-border">
                                        <BookOpen size={14} />
                                        <span>{sin.reference}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-theme-text-muted/70 bg-theme-bg px-2.5 py-1 rounded-md border border-theme-border">
                                        <Tag size={14} />
                                        <span>{sin.category}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
