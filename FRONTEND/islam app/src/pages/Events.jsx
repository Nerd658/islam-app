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
                <CalendarDays size={32} className="text-white" />
                <h2 className="text-3xl font-bold text-white">Grands Événements</h2>
            </div>
            
            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <p className="text-xl text-gray-300">Calcul des dates lunaires en cours...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {events.map((event, index) => {
                        const Icon = event.icon;
                        return (
                        <div key={event.name} className={`relative p-6 rounded-2xl overflow-hidden border ${index === 0 ? 'bg-white text-black' : 'bg-[#0a0a0a] border-[#333] text-white'}`}>
                            {index === 0 && (
                                <div className="absolute top-0 right-0 bg-gray-200 text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                                    Prochain
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="flex-shrink-0 flex items-center justify-center w-12 h-12">
                                        <Icon size={32} />
                                    </span>
                                    <div>
                                        <h3 className="text-xl font-bold">{event.name}</h3>
                                        <p className={`text-sm ${index === 0 ? 'text-gray-700' : 'text-gray-400'}`}>
                                            {event.day} {event.hijriMonthName} {event.targetHijriYear} 
                                            <span className="mx-2">•</span> 
                                            Vers le {event.gregorianDate}
                                        </p>
                                    </div>
                                </div>
                                <div className={`text-center p-3 rounded-xl min-w-[80px] ${index === 0 ? 'bg-black text-white' : 'bg-[#111] border border-[#333]'}`}>
                                    <span className="block text-3xl font-bold font-mono">{event.daysLeft}</span>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Jours</span>
                                </div>
                            </div>
                        </div>
                        );
                    })}
                    <p className="text-xs text-center text-gray-400 mt-6 pb-6">
                        * Les dates exactes peuvent varier de +/- 1 jour en fonction de l'observation de la lune.
                    </p>
                </div>
            )}
        </div>
    );
}
