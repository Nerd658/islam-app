import React, { useState, useEffect } from 'react';
import { CalendarDays, Star, BookOpen, Clock } from 'lucide-react';
import eventsData from '../data/islamic_events.json';

const MONTHS = [
    '',
    'Muharram',
    'Safar',
    'Rabi\' al-Awwal',
    'Rabi\' ath-Thani',
    'Joumada al-Oula',
    'Joumada ath-Thania',
    'Rajab',
    'Cha\'bane',
    'Ramadan',
    'Chawwal',
    'Dhou al-Qi\'da',
    'Dhou al-Hijja'
];

const getBadgeStyle = (category) => {
    switch (category) {
        case 'Fête':
            return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
        case 'Historique':
            return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        case 'Sunnah':
            return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        default:
            return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
};

const getCategoryIcon = (category) => {
    switch (category) {
        case 'Fête':
            return <Star size={16} />;
        case 'Historique':
            return <BookOpen size={16} />;
        case 'Sunnah':
            return <Clock size={16} />;
        default:
            return <Star size={16} />;
    }
};

const getCurrentHijriDate = () => {
    try {
        const d = new Date();
        const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic', { month: 'numeric', day: 'numeric' });
        const parts = formatter.formatToParts(d);
        const m = parseInt(parts.find(p => p.type === 'month')?.value || '0', 10);
        const day = parseInt(parts.find(p => p.type === 'day')?.value || '0', 10);
        return { month: m, day };
    } catch (e) {
        return { month: 1, day: 1 };
    }
};

export default function Events() {
    const [events, setEvents] = useState([]);
    const [nextEventId, setNextEventId] = useState(null);

    useEffect(() => {
        const sorted = [...eventsData].sort((a, b) => {
            if (a.hijri_month !== b.hijri_month) {
                return a.hijri_month - b.hijri_month;
            }
            return a.hijri_day - b.hijri_day;
        });
        
        setEvents(sorted);

        const current = getCurrentHijriDate();
        if (current.month && current.day) {
            const next = sorted.find(
                e => e.hijri_month > current.month || (e.hijri_month === current.month && e.hijri_day >= current.day)
            );
            setNextEventId(next ? next.id : sorted[0].id);
        } else {
            setNextEventId(sorted[0].id);
        }
    }, []);

    return (
        <div className="pt-8 px-4 max-w-2xl mx-auto pb-24">
            <div className="flex items-center justify-center gap-3 mb-8">
                <CalendarDays size={32} className="text-white" />
                <h2 className="text-3xl font-bold text-white">Dates Islamiques</h2>
            </div>
            
            <div className="space-y-4">
                {events.map((event) => {
                    const isNext = event.id === nextEventId;
                    
                    return (
                        <div 
                            key={event.id} 
                            className={`relative p-5 rounded-2xl overflow-hidden border transition-all ${
                                isNext 
                                    ? 'bg-[#111] border-emerald-500/30 ring-1 ring-emerald-500/20' 
                                    : 'bg-[#0a0a0a] border-[#333]'
                            }`}
                        >
                            {isNext && (
                                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                    Prochain événement
                                </div>
                            )}
                            
                            <div className="flex flex-col gap-3">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">{event.name}</h3>
                                        <p className="text-sm text-gray-400">
                                            {event.hijri_day} {MONTHS[event.hijri_month]}
                                        </p>
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${getBadgeStyle(event.category)}`}>
                                        {getCategoryIcon(event.category)}
                                        <span>{event.category}</span>
                                    </div>
                                </div>
                                
                                <p className="text-sm text-gray-300">
                                    {event.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
                
                <div className="mt-8 pt-6 border-t border-[#333]">
                    <p className="text-xs text-center text-gray-500">
                        Les dates exactes peuvent varier en fonction de l'observation de la lune.
                    </p>
                </div>
            </div>
        </div>
    );
}
