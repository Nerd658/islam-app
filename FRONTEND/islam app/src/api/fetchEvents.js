import axios from 'axios';

const eventsList = [
    { name: 'Ramadan (Début)', day: 1, month: 9, icon: '🌙' },
    { name: 'Aïd al-Fitr (Fin du Ramadan)', day: 1, month: 10, icon: '🎉' },
    { name: 'Arafat (Le grand jour du Hajj)', day: 9, month: 12, icon: '🕋' },
    { name: 'Aïd al-Adha (Tabaski)', day: 10, month: 12, icon: '🐑' },
    { name: 'Nouvel An Hégirien', day: 1, month: 1, icon: '🎆' },
    { name: 'Achoura', day: 10, month: 1, icon: '🕌' }
];

export const fetchUpcomingEvents = async () => {
    // 1. Get current date
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    try {
        const resDate = await axios.get(`${import.meta.env.VITE_ALADHAN_API_URL}/v1/gToH?date=${dd}-${mm}-${yyyy}`);
        const currentHijri = resDate.data.data.hijri;
        const currentHMonth = currentHijri.month.number;
        const currentHYear = parseInt(currentHijri.year);
        const currentHDay = parseInt(currentHijri.day);

        // 3. Calculate the next occurrence for each event
        const promises = eventsList.map(async (event) => {
            let targetYear = currentHYear;
            
            // If the event's month has already passed, or it's today/past today in the same month -> Next Year
            if (event.month < currentHMonth || (event.month === currentHMonth && event.day <= currentHDay)) {
                targetYear += 1;
            }

            const targetDateStr = `${String(event.day).padStart(2, '0')}-${String(event.month).padStart(2, '0')}-${targetYear}`;
            
            // 4. Fetch the Gregorian equivalent of the future Hijri date
            const res = await axios.get(`${import.meta.env.VITE_ALADHAN_API_URL}/v1/hToG?date=${targetDateStr}`);
            const gregStr = res.data.data.gregorian.date; // DD-MM-YYYY
            const [gDay, gMonth, gYear] = gregStr.split('-');
            const targetGregorian = new Date(`${gYear}-${gMonth}-${gDay}T00:00:00`);
            
            // Reset today's time to midnight for accurate day difference
            const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const diffTime = targetGregorian - todayMidnight;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return {
                ...event,
                targetHijriYear: targetYear,
                gregorianDate: `${gDay}/${gMonth}/${gYear}`,
                daysLeft: diffDays,
                hijriMonthName: res.data.data.hijri.month.fr || res.data.data.hijri.month.en
            };
        });

        const results = await Promise.all(promises);
        // Sort events by the closest upcoming date
        return results.filter(r => r !== null).sort((a, b) => a.daysLeft - b.daysLeft);
    } catch (error) {
        console.error("Erreur de récupération des événements:", error);
        return [];
    }
};
