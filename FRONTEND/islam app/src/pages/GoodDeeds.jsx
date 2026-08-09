import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { HandHeart, BookOpen, Gift, Tag } from 'lucide-react';
import goodDeedsData from '../data/good_deeds.json';
import ActionSkeleton from '../components/ActionSkeleton';

export default function GoodDeeds() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 400);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="pt-8 px-4 max-w-4xl mx-auto pb-24">
            <PageHeader 
                icon={<HandHeart size={32} className="text-emerald-500" />} 
                title="Bonnes Actions (Hasanat)" 
                subtitle="Des actions simples du quotidien pour accumuler des récompenses et se rapprocher d'Allah." 
            />

            {loading ? (
                <ActionSkeleton />
            ) : (
                <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none gap-6 pb-8 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 mt-8 hide-scrollbar">
                    {goodDeedsData.map((deed) => (
                        <div key={deed.id} className="snap-center shrink-0 w-[85%] sm:w-auto bg-theme-surface border border-theme-border hover:border-emerald-500/50 rounded-2xl p-6 shadow-lg transition-all hover:shadow-emerald-500/10 group flex flex-col">
                            
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex shrink-0 items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 font-bold group-hover:scale-110 transition-transform">
                                        <HandHeart size={20} />
                                    </div>
                                    <h3 className="font-bold text-theme-text text-xl leading-tight">{deed.title}</h3>
                                </div>
                                <span className="text-2xl font-arabic text-theme-text-muted shrink-0" dir="rtl">{deed.arabic}</span>
                            </div>
                            
                            <p className="text-theme-text-muted leading-relaxed mb-6 flex-1">
                                {deed.description}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-2 border-t border-theme-border pt-4 mt-auto">
                                <div className="flex items-center gap-1.5 text-xs text-theme-text-muted/80 bg-theme-bg px-2.5 py-1 rounded-md border border-theme-border">
                                    <Gift size={14} className="text-amber-500" />
                                    <span>{deed.reward}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-theme-text-muted/80 bg-theme-bg px-2.5 py-1 rounded-md border border-theme-border">
                                    <BookOpen size={14} className="text-blue-500" />
                                    <span>{deed.reference}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-theme-text-muted/80 bg-theme-bg px-2.5 py-1 rounded-md border border-theme-border">
                                    <Tag size={14} className="text-purple-500" />
                                    <span>{deed.category}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
