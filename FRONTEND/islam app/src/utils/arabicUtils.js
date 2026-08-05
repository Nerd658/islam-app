/**
 * Utility functions for Arabic text processing.
 */

/**
 * Removes Arabic diacritics (Tashkeel) from text to allow for easier string comparison.
 * @param {string} text - The Arabic text with diacritics.
 * @returns {string} - The Arabic text without diacritics.
 */
export function stripArabicDiacritics(text) {
    if (!text) return '';
    // Regex for Arabic diacritics (Harakat)
    return text.replace(/[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '');
}

/**
 * Normalizes Arabic text for loose comparison (e.g., Alif variations to simple Alif).
 * @param {string} text - Arabic text.
 * @returns {string} - Normalized Arabic text.
 */
export function normalizeArabic(text) {
    if (!text) return '';
    let normalized = stripArabicDiacritics(text);
    
    // Normalize Alif forms (Madda, Hamza above, Hamza below, Wasla) to simple Alif
    normalized = normalized.replace(/[أإآٱ]/g, 'ا');
    
    // Normalize Ya and Alif Maksura
    normalized = normalized.replace(/[يى]/g, 'ي');
    
    // Normalize Ta Marbuta and Ha
    normalized = normalized.replace(/ة/g, 'ه');
    
    // Normalize Waw with Hamza
    normalized = normalized.replace(/ؤ/g, 'و');

    // Normalize Hamza on line or Ya
    normalized = normalized.replace(/[ئء]/g, 'ء');

    return normalized;
}

/**
 * Calculates Levenshtein distance between two strings to measure similarity.
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} - The distance (lower means more similar)
 */
export function levenshteinDistance(a, b) {
    const matrix = [];
    let i, j;

    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1 // deletion
                    )
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

/**
 * Calculates a similarity score between 0 and 100 for two strings.
 */
export function calculateSimilarity(str1, str2) {
    const s1 = normalizeArabic(str1).trim();
    const s2 = normalizeArabic(str2).trim();

    if (!s1 || !s2) return 0;
    
    const distance = levenshteinDistance(s1, s2);
    const maxLength = Math.max(s1.length, s2.length);
    
    if (maxLength === 0) return 100;
    
    return Math.max(0, Math.round(((maxLength - distance) / maxLength) * 100));
}
