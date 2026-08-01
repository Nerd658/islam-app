import React, { useState, useEffect } from 'react';
import { fetchUpcomingEvents } from '../api/fetchEvents';
import { CalendarDays } from 'lucide-react';

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUpcomingEvents().then(data => {
            setEvents(data);
            setLoading(false);
        });
    }, []);

    return (
        <div className="pt-8 px-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-8">
                <CalendarDays size={32} className="text-emerald-400" />
                <h2 className="text-3xl font-bold">Grands Événements</h2>
            </div>
            
            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <p className="animate-pulse text-xl text-emerald-300">Calcul des dates lunaires en cours...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {events.map((event, index) => (
                        <div key={event.name} className={`relative p-6 rounded-3xl shadow-xl overflow-hidden border ${index === 0 ? 'bg-gradient-to-r from-emerald-600 to-teal-500 border-emerald-400' : 'bg-slate-800/80 border-slate-700'}`}>
                            {index === 0 && (
                                <div className="absolute top-0 right-0 bg-amber-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-bl-xl">
                                    Prochain
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl">{event.icon}</span>
                                    <div>
                                        <h3 className="text-xl font-bold">{event.name}</h3>
                                        <p className="text-gray-300 text-sm">
                                            {event.day} {event.hijriMonthName} {event.targetHijriYear} 
                                            <span className="mx-2">•</span> 
                                            Vers le {event.gregorianDate}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-center bg-black/20 p-3 rounded-2xl min-w-[80px]">
                                    <span className="block text-3xl font-bold font-mono text-white">{event.daysLeft}</span>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200">Jours</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    <p className="text-xs text-center text-gray-400 mt-6 pb-6">
                        * Les dates exactes peuvent varier de +/- 1 jour en fonction de l'observation de la lune.
                    </p>
                </div>
            )}
        </div>
    );
}
