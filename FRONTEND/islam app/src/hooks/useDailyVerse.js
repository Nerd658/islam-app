import dailyVerses from '../data/daily_verses.json';

export default function useDailyVerse() {
    // Get the current day of the month (1-31)
    const currentDay = new Date().getDate();
    
    // Map the day to an index between 0 and 29
    const index = (currentDay - 1) % 30;
    
    // Get the verse at the calculated index
    const verse = dailyVerses[index] || dailyVerses[0];
    
    return {
        arabic: verse.arabic,
        translation: verse.translation,
        reference: verse.reference
    };
}
