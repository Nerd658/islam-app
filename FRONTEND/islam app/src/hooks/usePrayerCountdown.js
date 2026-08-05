import { useState, useEffect } from 'react';

/**
 * Extracts the next upcoming prayer from a prayerTimes object and
 * returns a live countdown string that updates every second.
 *
 * @param {object|null} prayerTimes - Object with prayer keys (fajr, dhuhr, etc.)
 * @returns {{ nextPrayer: object|null, timeLeft: string }}
 */
export function usePrayerCountdown(prayerTimes) {
    const [nextPrayer, setNextPrayer] = useState(null);
    const [timeLeft, setTimeLeft] = useState('');

    const MAIN_PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

    useEffect(() => {
        if (!prayerTimes) {
            setNextPrayer(null);
            setTimeLeft('');
            return;
        }

        const computeNext = () => {
            const now = new Date();
            const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

            let upcoming = null;
            let minDiff = Infinity;

            MAIN_PRAYERS.forEach(key => {
                const timeStr = prayerTimes[key] || prayerTimes[key.toUpperCase()];
                if (!timeStr) return;

                const [h, m] = timeStr.split(':').map(Number);
                const pSeconds = h * 3600 + m * 60;
                let diff = pSeconds - currentSeconds;
                if (diff < 0) diff += 86400; // wrap to next occurrence

                if (diff < minDiff) {
                    minDiff = diff;
                    upcoming = { key, timeStr, diffSeconds: diff };
                }
            });

            if (upcoming) {
                setNextPrayer(upcoming);
                const hrs = Math.floor(upcoming.diffSeconds / 3600);
                const mins = Math.floor((upcoming.diffSeconds % 3600) / 60);
                const secs = upcoming.diffSeconds % 60;
                setTimeLeft(
                    `${hrs > 0 ? String(hrs).padStart(2, '0') + 'h ' : ''}${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`
                );
            }
        };

        computeNext();
        const interval = setInterval(computeNext, 1000);
        return () => clearInterval(interval);
    }, [prayerTimes]);

    return { nextPrayer, timeLeft };
}
