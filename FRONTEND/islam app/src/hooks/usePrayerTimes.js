import { useState, useCallback } from 'react';
import axios from 'axios';
import { fetchPrayerTimes } from '../api/fetchPrayerTimes';

const CACHE_KEY = 'last_city_data';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

function loadCachedCity() {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || !parsed.timestamp) return null;
        if (Date.now() - parsed.timestamp > CACHE_TTL_MS) return null;
        return parsed; // { city, country_code, label, prayerTimes, timestamp }
    } catch {
        return null;
    }
}

function saveCityCache(data) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ ...data, timestamp: Date.now() }));
    } catch {
        // localStorage may be full — fail silently
    }
}

/**
 * Manages prayer time fetching, geolocation, and city search state.
 * Provides a single hook surface for the Home page.
 *
 * @returns {{
 *   prayerTimes: object|null,
 *   loading: boolean,
 *   error: string,
 *   city: string,
 *   countryCode: string,
 *   locationLabel: string,
 *   setCity: Function,
 *   setCountryCode: Function,
 *   setLocationLabel: Function,
 *   setPrayerTimes: Function,
 *   setError: Function,
 *   handleSubmit: Function,
 *   handleLocateMe: Function,
 *   cachedCity: object|null
 * }}
 */
export function usePrayerTimes() {
    const cached = loadCachedCity();

    const [prayerTimes, setPrayerTimes] = useState(cached?.prayerTimes ?? null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [city, setCity] = useState(cached?.city ?? '');
    const [countryCode, setCountryCode] = useState(cached?.country_code ?? '');
    const [locationLabel, setLocationLabel] = useState(cached?.label ?? '');

    const fetchAndSet = useCallback(async (cityName, code, label) => {
        setLoading(true);
        setError('');
        try {
            const data = await fetchPrayerTimes(cityName, code);
            setPrayerTimes(data);
            saveCityCache({ city: cityName, country_code: code, label, prayerTimes: data });
        } catch (err) {
            setError(err.message || 'Erreur lors de la récupération des horaires.');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!city || !countryCode) {
            setError('Veuillez sélectionner une ville dans la liste.');
            return;
        }
        await fetchAndSet(city, countryCode, locationLabel);
    }, [city, countryCode, locationLabel, fetchAndSet]);

    const handleLocateMe = useCallback(() => {
        if (!navigator.geolocation) {
            setError("La géolocalisation n'est pas supportée par votre navigateur.");
            return;
        }
        setLoading(true);
        setError('');
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude: lat, longitude: lon } = position.coords;
                    const response = await axios.get(
                        `${import.meta.env.VITE_NOMINATIM_API_URL}/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`,
                        { headers: { 'Accept-Language': 'fr', 'User-Agent': 'IslamApp/1.0 (contact@islamapp.fr)' } }
                    );
                    const address = response.data.address;
                    const resolvedCity = address.city || address.town || address.village || address.county;
                    const resolvedCode = address.country_code;

                    if (!resolvedCity || !resolvedCode) {
                        setError('Impossible de déterminer votre ville.');
                        setLoading(false);
                        return;
                    }

                    const label = `${resolvedCity}, ${address.country}`;
                    setCity(resolvedCity);
                    setCountryCode(resolvedCode);
                    setLocationLabel(label);
                    await fetchAndSet(resolvedCity, resolvedCode, label);
                } catch {
                    setError('Erreur lors de la géolocalisation.');
                    setLoading(false);
                }
            },
            () => {
                setError("Impossible d'obtenir votre position.");
                setLoading(false);
            }
        );
    }, [fetchAndSet]);

    return {
        prayerTimes,
        loading,
        error,
        city,
        countryCode,
        locationLabel,
        setCity,
        setCountryCode,
        setLocationLabel,
        setPrayerTimes,
        setError,
        handleSubmit,
        handleLocateMe,
        cachedCity: cached
    };
}
