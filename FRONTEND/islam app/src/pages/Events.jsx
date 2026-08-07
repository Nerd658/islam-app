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
    const [todayHijri, setTodayHijri] = useState(null);
    const [showAllEvents, setShowAllEvents] = useState(false);
    
    // Converter state
    const [convMode, setConvMode] = useState('g2h'); // g2h or h2g
    const [gDate, setGDate] = useState('');
    const [hDate, setHDate] = useState({ year: 1446, month: 1, day: 1 });
    const [convResult, setConvResult] = useState('');

    useEffect(() => {
        const fetchToday = async () => {
            try {
                const res = await fetch(`https://ummahapi.com/api/moon?apikey=${import.meta.env.VITE_UMMAH_API_KEY}`);
                if (res.ok) {
                    const data = await res.json();
                    setTodayHijri(data.data.hijri);
                    
                    // Set next event based on real API date
                    const sorted = [...eventsData].sort((a, b) => {
                        if (a.hijri_month !== b.hijri_month) return a.hijri_month - b.hijri_month;
                        return a.hijri_day - b.hijri_day;
                    });
                    
                    setEvents(sorted);
                    const currentM = data.data.hijri.month;
                    const currentD = data.data.hijri.day;
                    const next = sorted.find(
                        e => e.hijri_month > currentM || (e.hijri_month === currentM && e.hijri_day >= currentD)
                    );
                    setNextEventId(next ? next.id : sorted[0].id);
                }
            } catch (err) {
                console.error("Failed to fetch today date");
                // fallback
                setEvents(eventsData);
            }
        };
        
        fetchToday();
    }, []);

    const handleConvert = async () => {
        if (convMode === 'g2h' && gDate) {
            const [y, m, d] = gDate.split('-');
            const res = await fetch(`https://ummahapi.com/api/moon/hijri?year=${y}&month=${m}&day=${d}&apikey=${import.meta.env.VITE_UMMAH_API_KEY}`);
            const data = await res.json();
            setConvResult(data.data.hijri.date_formatted);
        } else if (convMode === 'h2g') {
            const res = await fetch(`https://ummahapi.com/api/moon/gregorian?year=${hDate.year}&month=${hDate.month}&day=${hDate.day}&apikey=${import.meta.env.VITE_UMMAH_API_KEY}`);
            const data = await res.json();
            setConvResult(new Date(data.data.gregorian.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }));
        }
    };

    return (
        <div className="pt-8 px-4 max-w-2xl mx-auto pb-24">
            <div className="flex items-center justify-center gap-3 mb-8">
                <CalendarDays size={32} className="text-theme-primary" />
                <h2 className="text-3xl font-bold text-theme-text tracking-tight">Calendrier & Événements</h2>
            </div>
            
            {todayHijri && (
                <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 sm:p-8 text-center mb-10 relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-theme-primary via-theme-accent to-transparent opacity-50"></div>
                    <p className="text-theme-accent font-bold uppercase tracking-widest text-xs mb-3">Aujourd'hui</p>
                    <h3 className="text-2xl sm:text-3xl font-bold text-theme-text mb-2">{todayHijri.day} {todayHijri.month_arabic} ({todayHijri.month_name}) {todayHijri.year}</h3>
                    <p className="text-theme-text-muted text-sm max-w-md mx-auto">Le calendrier islamique est basé sur l'observation lunaire.</p>
                </div>
            )}

            {/* Convertisseur */}
            <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 sm:p-8 mb-12 shadow-lg">
                <h3 className="text-lg font-bold text-theme-text mb-6 flex items-center gap-2">
                    <Clock size={20} className="text-theme-primary" /> Convertisseur de Dates
                </h3>
                
                <div className="flex bg-theme-bg rounded-xl p-1.5 mb-6 border border-theme-border">
                    <button 
                        onClick={() => setConvMode('g2h')}
                        className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${convMode === 'g2h' ? 'bg-theme-surface-hover text-theme-primary shadow-sm border border-theme-border' : 'text-theme-text-muted hover:text-theme-text'}`}
                    >
                        Grégorien ➔ Hégirien
                    </button>
                    <button 
                        onClick={() => setConvMode('h2g')}
                        className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${convMode === 'h2g' ? 'bg-theme-surface-hover text-theme-primary shadow-sm border border-theme-border' : 'text-theme-text-muted hover:text-theme-text'}`}
                    >
                        Hégirien ➔ Grégorien
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    {convMode === 'g2h' ? (
                        <input type="date" value={gDate} onChange={e => setGDate(e.target.value)} className="flex-1 bg-theme-bg border border-theme-border focus:border-theme-primary focus:ring-1 focus:ring-theme-primary rounded-xl px-4 py-3 text-theme-text outline-none transition-all" />
                    ) : (
                        <div className="flex flex-1 gap-2">
                            <input type="number" placeholder="Jour" value={hDate.day} onChange={e => setHDate({...hDate, day: e.target.value})} className="w-1/3 bg-theme-bg border border-theme-border focus:border-theme-primary rounded-xl px-3 py-3 text-theme-text outline-none text-center" />
                            <input type="number" placeholder="Mois" value={hDate.month} onChange={e => setHDate({...hDate, month: e.target.value})} className="w-1/3 bg-theme-bg border border-theme-border focus:border-theme-primary rounded-xl px-3 py-3 text-theme-text outline-none text-center" />
                            <input type="number" placeholder="Année" value={hDate.year} onChange={e => setHDate({...hDate, year: e.target.value})} className="w-1/3 bg-theme-bg border border-theme-border focus:border-theme-primary rounded-xl px-3 py-3 text-theme-text outline-none text-center" />
                        </div>
                    )}
                    <button onClick={handleConvert} className="bg-theme-primary hover:bg-emerald-500 text-theme-bg px-6 py-3 rounded-xl font-bold transition-colors shadow-lg active:scale-95">
                        Convertir
                    </button>
                </div>

                {convResult && (
                    <div className="bg-theme-primary/10 text-center py-4 rounded-xl text-theme-primary font-bold border border-theme-primary/20 animate-in fade-in zoom-in duration-300">
                        {convResult}
                    </div>
                )}
            </div>

            <h3 className="text-2xl font-bold text-theme-text mb-6">
                {showAllEvents ? 'Tous les événements' : 'Prochains événements'}
            </h3>
            
            <div className="space-y-4 relative">
                {events.map((event, index) => {
                    const isNext = event.id === nextEventId;
                    
                    // Logic to determine if this event should be shown when not in 'showAll' mode
                    let shouldShow = true;
                    if (!showAllEvents && nextEventId) {
                        const nextIdx = events.findIndex(e => e.id === nextEventId);
                        // Show the next event and the 2 following it (wrap around if needed)
                        const showIndices = [nextIdx, (nextIdx + 1) % events.length, (nextIdx + 2) % events.length];
                        shouldShow = showIndices.includes(index);
                    } else if (!showAllEvents) {
                        // Fallback if API fails and nextEventId is null
                        shouldShow = index < 3;
                    }

                    if (!shouldShow) return null;

                    return (
                        <div 
                            key={event.id} 
                            className={`relative p-6 rounded-3xl overflow-hidden border transition-all duration-300 ${
                                isNext 
                                    ? 'bg-theme-surface-hover border-theme-accent/40 shadow-lg shadow-theme-accent/5' 
                                    : 'bg-theme-surface border-theme-border hover:border-theme-text-muted/30'
                            }`}
                        >
                            {isNext && (
                                <div className="absolute top-0 right-0 bg-theme-accent text-theme-bg text-xs font-extrabold px-4 py-1.5 rounded-bl-2xl shadow-sm uppercase tracking-wider">
                                    Bientôt
                                </div>
                            )}
                            
                            <div className="flex flex-col gap-3">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className={`text-xl font-bold mb-1 ${isNext ? 'text-theme-accent' : 'text-theme-text'}`}>{event.name}</h3>
                                        <p className="text-sm font-medium text-theme-text-muted">
                                            {event.hijri_day} {MONTHS[event.hijri_month]}
                                        </p>
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${getBadgeStyle(event.category)}`}>
                                        {getCategoryIcon(event.category)}
                                        <span className="hidden sm:inline">{event.category}</span>
                                    </div>
                                </div>
                                
                                <p className="text-sm text-theme-text-muted mt-2 leading-relaxed">
                                    {event.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
                
                <div className="pt-4 flex justify-center">
                    <button 
                        onClick={() => setShowAllEvents(!showAllEvents)}
                        className="bg-theme-surface-hover border border-theme-border text-theme-text font-semibold px-6 py-3 rounded-2xl hover:bg-[#222] transition-colors shadow-sm"
                    >
                        {showAllEvents ? 'Voir moins' : 'Voir tout le calendrier'}
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-theme-border">
                    <p className="text-xs text-center text-theme-text-muted/60">
                        Les dates exactes peuvent varier en fonction de l'observation de la lune.
                    </p>
                </div>
            </div>
        </div>
    );
}
