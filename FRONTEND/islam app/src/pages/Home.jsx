import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchInput from '../components/SearchInput';
import LocationSuggestions from '../components/LocationSuggestions';
import Header from '../components/Header';
import PrayerTimesList from '../components/PrayerTimesList';
import DailySuggestions from '../components/DailySuggestions';
import useLocationSearch from '../hooks/useLocationSearch';
import useDailyVerse from '../hooks/useDailyVerse';
import { fetchPrayerTimes } from '../api/fetchPrayerTimes';
import axios from 'axios';
import { 
    MapPin, 
    Search
} from 'lucide-react';

export default function Home() {
    const [search, setSearch] = useState('');
    const [result, setResult] = useState([]);
    const [city, setCity] = useState('');
    const [error, setError] = useState('');
    const [prayerTimes, setPrayerTimes] = useState(null);
    const [loading, setLoading] = useState(false);
    const [country_code, setCountry_code] = useState('');
    const [value, setValue] = useState('');

    useLocationSearch(search, setResult, setError);
    const { arabic, translation, reference } = useDailyVerse();
    const todayDate = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

    useEffect(() => {
        const savedData = localStorage.getItem('last_city_data');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                const now = new Date().getTime();
                if (now - parsed.timestamp < 6 * 60 * 60 * 1000) {
                    setCity(parsed.city);
                    setCountry_code(parsed.country_code);
                    setValue(parsed.value);
                    
                    fetchPrayerTimes(parsed.city, parsed.country_code).then(data => {
                        setPrayerTimes(data);
                    }).catch(err => {
                        console.error(err);
                    });
                }
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    const handleLocateMe = () => {
        if (!navigator.geolocation) {
            setError("La géolocalisation n'est pas supportée par votre navigateur.");
            return;
        }
        setLoading(true);
        setError("");
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            try {
                const response = await axios.get(`${import.meta.env.VITE_NOMINATIM_API_URL}/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&email=contact@islam1811.web.app`, {
                    headers: {
                        'Accept-Language': 'fr'
                    }
                });
                
                const address = response.data.address;
                const currentCity = address.city || address.town || address.village || address.county;
                const currentCountryCode = address.country_code;
                
                if (currentCity && currentCountryCode) {
                    setCity(currentCity);
                    setCountry_code(currentCountryCode);
                    const newValue = `${currentCity}, ${address.country}`;
                    setValue(newValue);
                    
                    const data = await fetchPrayerTimes(currentCity, currentCountryCode);
                    setPrayerTimes(data);

                    localStorage.setItem('last_city_data', JSON.stringify({
                        city: currentCity,
                        country_code: currentCountryCode,
                        value: newValue,
                        timestamp: new Date().getTime()
                    }));
                } else {
                    setError("Impossible de déterminer votre ville.");
                }
            } catch (err) {
                setError("Erreur lors de la géolocalisation.");
            } finally {
                setLoading(false);
            }
        }, () => {
            setError("Impossible d'obtenir votre position.");
            setLoading(false);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!city || !country_code) {
            setError('Veuillez sélectionner une ville dans la liste.');
            return;
        }
        setError("");
        setLoading(true);

        try {
            const data = await fetchPrayerTimes(city, country_code);
            setPrayerTimes(data);
            setLoading(false);

            localStorage.setItem('last_city_data', JSON.stringify({
                city,
                country_code,
                value,
                timestamp: new Date().getTime()
            }));
        } catch (err) {
            setError(err.message || "Erreur lors de la récupération des horaires.");
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen flex flex-col items-center pt-4 pb-24 px-4 max-w-5xl mx-auto">
            <Header />

            {/* Hero Banner */}
            <div className="text-center mt-4 sm:mt-8 mb-10 max-w-2xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
                    As-salamu alaykum
                </h1>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed px-4">
                    Bienvenue sur IslamApp. Consultez vos horaires de prière et suivez vos objectifs spirituels.
                </p>
            </div>

            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                
                {/* Left Column: Search & Prayer Times */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Search Card */}
                    <div className="w-full bg-[#0a0a0a] border border-[#333] p-6 sm:p-8 rounded-3xl shadow-2xl">
                        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
                            
                            <button 
                                type="button" 
                                onClick={handleLocateMe}
                                disabled={loading}
                                className="w-full bg-[#111] hover:bg-[#1a1a1a] border border-[#333] text-gray-200 font-medium py-3 px-6 rounded-2xl flex items-center justify-center gap-2 transition disabled:opacity-50 text-sm"
                            >
                                <MapPin size={18} className="text-emerald-400" />
                                <span>Me localiser automatiquement</span>
                            </button>

                            <div className="w-full relative">
                                <SearchInput
                                    search={search}
                                    setSearch={setSearch}
                                    setError={setError}
                                    setValue={setValue}
                                    setPrayerTimes={setPrayerTimes} 
                                />

                                <LocationSuggestions
                                    result={result}
                                    setValue={setValue}
                                    setResult={setResult}
                                    setSearch={setSearch}
                                    setError={setError}
                                    setCity={setCity}
                                    setCountry_code={setCountry_code}
                                    setPrayerTimes={setPrayerTimes}
                                />
                            </div>

                            {value && (
                                <div className="font-semibold text-emerald-400 text-sm text-center bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-xl w-full">
                                    📍 {value}
                                </div>
                            )}

                            <button
                                disabled={loading}
                                className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3.5 px-8 rounded-2xl transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                                type="submit"
                            >
                                <Search size={18} />
                                <span>{loading ? 'Recherche en cours...' : 'Obtenir les horaires'}</span>
                            </button>

                            {error && (
                                <p className="text-red-400 text-xs bg-red-950/40 border border-red-900/50 p-3 rounded-xl w-full text-center mt-2">
                                    {error}
                                </p>
                            )}
                        </form>
                    </div>

                    {/* Prayer Times Result */}
                    {prayerTimes && (
                        <div className="w-full">
                            <PrayerTimesList prayerTimes={prayerTimes} />
                        </div>
                    )}
                </div>

                {/* Right Column: Widgets */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    {/* Daily Suggestions Widget */}
                    <div className="bg-[#0a0a0a] border border-[#333] rounded-3xl p-6 shadow-2xl">
                        <DailySuggestions />
                    </div>

                    {/* Daily Verse Inspiration Card */}
                    <div className="w-full bg-[#0a0a0a] border border-[#333] p-8 rounded-3xl text-center relative overflow-hidden transition-opacity duration-500 opacity-100 shadow-2xl">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-transparent opacity-50"></div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Rappel du Jour</div>
                        <p className="text-2xl sm:text-3xl font-arabic text-white mb-4 leading-loose transition-all duration-500" dir="rtl">
                            "{arabic}"
                        </p>
                        <p className="text-gray-300 text-sm max-w-lg mx-auto italic mb-3 transition-all duration-500">
                            "{translation}"
                        </p>
                        <span className="text-xs text-emerald-500/80 font-mono bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">{reference}</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
