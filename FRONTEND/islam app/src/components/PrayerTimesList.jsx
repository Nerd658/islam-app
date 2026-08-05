import React, { useState, useRef } from 'react';
import { Calendar, Clock, Gem, Play, Pause } from 'lucide-react';
import { usePrayerCountdown } from '../hooks/usePrayerCountdown';

const PRAYER_NAMES_FR = {
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

const MAIN_PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

const ADHAN_URL = 'https://media.assabile.com/assabile/adhan_3435370/0bf83c80b583.mp3';

/**
 * Displays the full prayer times grid for a given day, with a live
 * countdown to the next prayer and an optional adhan playback button.
 *
 * @param {{ prayerTimes: object|null }} props
 */
export default function PrayerTimesList({ prayerTimes }) {
    const { nextPrayer, timeLeft } = usePrayerCountdown(prayerTimes);
    const [isPlayingAdhan, setIsPlayingAdhan] = useState(false);
    const adhanAudioRef = useRef(null);

    const toggleAdhan = () => {
        if (!adhanAudioRef.current) {
            adhanAudioRef.current = new Audio(ADHAN_URL);
            adhanAudioRef.current.onended = () => setIsPlayingAdhan(false);
        }

        if (isPlayingAdhan) {
            adhanAudioRef.current.pause();
            setIsPlayingAdhan(false);
        } else {
            adhanAudioRef.current.play();
            setIsPlayingAdhan(true);
        }
    };

    if (!prayerTimes) return null;

    const { hijriDate, ...times } = prayerTimes;

    return (
        <div className="w-full max-w-3xl mx-auto mt-8 px-4">
            {/* Hijri Date Badge */}
            {hijriDate && (
                <div className="flex items-center justify-center gap-2 text-gray-300 bg-[#111] border border-[#333] py-2.5 px-5 rounded-full text-sm font-semibold mb-6 mx-auto w-fit shadow-md">
                    <Calendar size={16} className="text-gray-400" />
                    <span>Date Hégirienne : {hijriDate}</span>
                </div>
            )}

            {/* Live Next Prayer Countdown Card */}
            {nextPrayer && (
                <div className="mb-8 p-6 bg-[#0a0a0a] border border-[#333] rounded-3xl text-center relative overflow-hidden shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Gem size={14} /> Prochaine Prière
                        </span>

                        <button
                            onClick={toggleAdhan}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
                                isPlayingAdhan
                                    ? 'bg-emerald-950 border-emerald-700 text-emerald-300 animate-pulse'
                                    : 'bg-[#111] border-[#333] text-gray-300 hover:text-white'
                            }`}
                        >
                            {isPlayingAdhan ? <Pause size={14} /> : <Play size={14} />}
                            <span>{isPlayingAdhan ? "Adhan en cours..." : "Écouter l'Adhan"}</span>
                        </button>
                    </div>

                    <h3 className="text-3xl font-extrabold text-white mb-2 capitalize">
                        {PRAYER_NAMES_FR[nextPrayer.key] || nextPrayer.key} à {nextPrayer.timeStr}
                    </h3>

                    <div className="inline-block bg-[#111] border border-[#333] px-6 py-2 rounded-2xl">
                        <span className="text-xs text-gray-400 block mb-0.5">Temps restant</span>
                        <span className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 tracking-wider">
                            {timeLeft}
                        </span>
                    </div>
                </div>
            )}

            {/* Prayer Times Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(times).map(([key, value]) => {
                    const label = PRAYER_NAMES_FR[key.toLowerCase()] || key;
                    const isMainPrayer = MAIN_PRAYERS.includes(key.toLowerCase());
                    const isUpcoming = nextPrayer && nextPrayer.key === key.toLowerCase();

                    return (
                        <div
                            key={key}
                            className={`flex items-center justify-between px-5 py-4 rounded-xl border transition-all ${
                                isUpcoming
                                    ? 'bg-emerald-950/40 border-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                                    : isMainPrayer
                                        ? 'bg-[#111] border-[#444] text-white shadow-md'
                                        : 'bg-[#0a0a0a] border-[#222] text-gray-400'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Clock size={18} className={isUpcoming ? 'text-emerald-400' : isMainPrayer ? 'text-white' : 'text-gray-600'} />
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
