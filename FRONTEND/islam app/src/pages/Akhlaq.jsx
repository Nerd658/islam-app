import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { HeartHandshake, BookOpen, Sparkles, Tag } from 'lucide-react';
import akhlaqData from '../data/akhlaq.json';
import ActionSkeleton from '../components/ActionSkeleton';

export default function Akhlaq() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 400);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="pt-8 px-4 max-w-4xl mx-auto pb-24">
            <PageHeader 
                icon={<HeartHandshake size={32} className="text-blue-400" />} 
                title="Bon Comportement (Akhlaq)" 
                subtitle="Les nobles caractères enseignés par le Prophète ﷺ pour perfectionner notre âme." 
            />

            {loading ? (
                <ActionSkeleton />
            ) : (
                <div className="mt-8 space-y-6">
                    {akhlaqData.map((item) => (
                        <div key={item.id} className="bg-theme-surface border border-theme-border hover:border-blue-400/50 rounded-2xl p-6 shadow-lg transition-all hover:shadow-blue-500/10 group">
                            
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 font-bold group-hover:scale-110 transition-transform">
                                        <HeartHandshake size={20} />
                                    </div>
                                    <h3 className="font-bold text-theme-text text-xl">{item.title}</h3>
                                </div>
                                <span className="text-2xl font-arabic text-theme-text-muted" dir="rtl">{item.arabic}</span>
                            </div>
                            
                            <p className="text-theme-text-muted leading-relaxed mb-6">
                                {item.description}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-3 border-t border-theme-border pt-4">
                                <div className="flex items-center gap-1.5 text-xs text-theme-text-muted/80 bg-theme-bg px-3 py-1.5 rounded-md border border-theme-border">
                                    <Sparkles size={14} className="text-yellow-400" />
                                    <span>{item.benefits}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-theme-text-muted/80 bg-theme-bg px-3 py-1.5 rounded-md border border-theme-border">
                                    <BookOpen size={14} className="text-emerald-500" />
                                    <span>{item.reference}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-theme-text-muted/80 bg-theme-bg px-3 py-1.5 rounded-md border border-theme-border">
                                    <Tag size={14} className="text-purple-400" />
                                    <span>{item.category}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
