import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Layers, Moon, Calculator, Type } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function MoreHub() {
    const features = [
        { path: '/events', label: 'Dates Islamiques', icon: CalendarDays, desc: 'Calendrier hégirien et événements', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { path: '/zakat', label: 'Calculateur de Zakat', icon: Calculator, desc: 'Zakat Al-Maal (Or, Argent) avec cours en direct', color: 'text-amber-400', bg: 'bg-amber-400/10' },
        { path: '/moon', label: 'Observation Lunaire', icon: Moon, desc: 'Phases lunaires et visibilité du croissant', color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { path: '/islamic-names', label: 'Prénoms Islamiques', icon: Type, desc: '210 prénoms authentiques (Filles & Garçons)', color: 'text-rose-400', bg: 'bg-rose-400/10' },
    ];

    return (
        <div className="pt-8 px-4 max-w-5xl mx-auto pb-24">
            <PageHeader 
                icon={<Layers size={32} />} 
                title="Plus" 
                subtitle="Fonctionnalités supplémentaires et paramètres." 
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                {features.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link 
                            key={item.path} 
                            to={item.path}
                            className="bg-theme-surface border border-theme-border hover:border-theme-text-muted/50 rounded-2xl p-5 flex items-start gap-4 transition-all hover:bg-theme-surface-hover shadow-lg group"
                        >
                            <div className={`p-3 rounded-xl ${item.bg} ${item.color} transition-transform group-hover:scale-110`}>
                                <Icon size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-theme-text text-lg mb-1">{item.label}</h3>
                                <p className="text-theme-text-muted text-sm">{item.desc}</p>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
