import React from 'react';
import { Calendar, Clock } from 'lucide-react';

export default function PrayerTimesList({ prayerTimes }) {
    if (!prayerTimes) return null;
    const { hijriDate, ...times } = prayerTimes;

    const prayerTranslations = {
        fajr: 'Fajr (Aube)',
        sunrise: 'Chourouk (Lever du soleil)',
        dhuhr: 'Dhuhr (Midi)',
        asr: 'Asr (Après-midi)',
        sunset: 'Coucher du soleil',
        maghrib: 'Maghrib (Coucher)',
        isha: 'Isha (Nuit)',
        imsak: 'Imsak',
        midnight: 'Milieu de la nuit'
    };

    return (
        <div className="w-full max-w-3xl mx-auto mt-8 px-4">
            {hijriDate && (
                <div className="flex items-center justify-center gap-2 text-[#aaa] bg-[#111] border border-[#333] py-2.5 px-5 rounded-full text-sm font-semibold mb-6 mx-auto w-fit">
                    <Calendar size={16} />
                    <span>Date Hégirienne : {hijriDate}</span>
                </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(times).map(([key, value]) => {
                    const label = prayerTranslations[key.toLowerCase()] || key;
                    const isMainPrayer = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].includes(key.toLowerCase());

                    return (
                        <div
                            key={key}
                            className={`flex items-center justify-between px-5 py-4 rounded-xl border transition-all ${
                                isMainPrayer 
                                    ? 'bg-[#111] border-[#444] text-white shadow-md' 
                                    : 'bg-[#0a0a0a] border-[#222] text-gray-400'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Clock size={18} className={isMainPrayer ? 'text-white' : 'text-gray-600'} />
                                <h3 className="font-medium text-sm sm:text-base capitalize">
                                    {label}
                                </h3>
                            </div>
                            <p className="font-mono font-bold text-base sm:text-lg text-white">
                                {value}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
