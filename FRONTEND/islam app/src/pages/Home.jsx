import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchInput from '../components/SearchInput';
import LocationSuggestions from '../components/LocationSuggestions';
import Header from '../components/Header';
import PrayerTimesList from '../components/PrayerTimesList';
import useLocationSearch from '../hooks/useLocationSearch';
import { fetchPrayerTimes } from '../api/fetchPrayerTimes';
import axios from 'axios';
import { 
    MapPin, 
    BookOpen, 
    Heart, 
    Activity, 
    Star, 
    Target, 
    Compass, 
    MessageCircle, 
    Sparkles, 
    ArrowRight,
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
                const response = await axios.get(`${import.meta.env.VITE_NOMINATIM_API_URL}/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`, {
                    headers: {
                        'Accept-Language': 'fr',
                        'User-Agent': 'IslamApp/1.0 (test@example.com)'
                    }
                });
                
                const address = response.data.address;
                const currentCity = address.city || address.town || address.village || address.county;
                const currentCountryCode = address.country_code;
                
                if (currentCity && currentCountryCode) {
                    setCity(currentCity);
                    setCountry_code(currentCountryCode);
                    setValue(`${currentCity}, ${address.country}`);
                    
                    const data = await fetchPrayerTimes(currentCity, currentCountryCode);
                    setPrayerTimes(data);
                } else {
                    setError("Impossible de déterminer votre ville.");
                }
            } catch (err) {
                setError("Erreur lors de la géolocalisation.");
            } flex: {
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
        } catch (err) {
            setError(err.message || "Erreur lors de la récupération des horaires.");
            setLoading(false);
        }
    };

    const quickLinks = [
        { title: 'Le Noble Coran', desc: '114 sourates avec récitations audio', path: '/quran', icon: BookOpen },
        { title: 'Vos Objectifs', desc: 'Programme quotidien et suivi des actes', path: '/goals', icon: Target },
        { title: 'Adhkar & Invocations', desc: 'La Citadelle du Musulman classée', path: '/adhkar', icon: Heart },
        { title: 'Tasbih Virtuel', desc: 'Compteur digital et Istighfar', path: '/tasbih', icon: Activity },
        { title: 'Les 99 Noms d\'Allah', desc: 'Attributs et méditation', path: '/names', icon: Star },
        { title: 'Boussole Qibla', desc: 'Direction exacte de la Kaaba', path: '/qibla', icon: Compass },
        { title: 'Imam Virtuel AI', desc: 'Posez vos questions sur l\'Islam', path: '/chat', icon: MessageCircle }
    ];

    return (
        <div className="min-h-screen flex flex-col items-center pt-4 pb-24 px-4 max-w-5xl mx-auto">
            <Header />

            {/* Hero Banner */}
            <div className="text-center mt-8 mb-10 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#111] border border-[#333] rounded-full text-xs text-gray-400 font-medium mb-4">
                    <Sparkles size={14} className="text-gray-200" />
                    <span>Bienvenue sur votre espace spirituel</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
                    Horaires de Prière & Outils
                </h1>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                    Recherchez votre ville pour obtenir vos horaires exacts ou explorez nos outils quotidiens.
                </p>
            </div>

            {/* Search Card */}
            <div className="w-full max-w-xl bg-[#0a0a0a] border border-[#333] p-6 sm:p-8 rounded-3xl mb-12 shadow-2xl">
                <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
                    
                    <button 
                        type="button" 
                        onClick={handleLocateMe}
                        disabled={loading}
                        className="w-full bg-[#111] hover:bg-[#1a1a1a] border border-[#333] text-gray-200 font-medium py-3 px-6 rounded-2xl flex items-center justify-center gap-2 transition disabled:opacity-50 text-sm"
                    >
                        <MapPin size={18} className="text-gray-400" />
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
                    </div>

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

                    {value && (
                        <div className="font-semibold text-white text-sm text-center bg-[#111] border border-[#333] px-4 py-2 rounded-xl w-full">
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
                <div className="w-full mb-16">
                    <PrayerTimesList prayerTimes={prayerTimes} />
                </div>
            )}

            {/* Feature Quick Access Hub Grid */}
            <div className="w-full mt-4">
                <div className="flex items-center justify-between mb-8 border-b border-[#222] pb-4">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Accès Rapide</h2>
                    <span className="text-xs text-gray-500 font-mono">Modules d'application</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quickLinks.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path}
                                className="group bg-[#0a0a0a] hover:bg-[#111] border border-[#222] hover:border-gray-500 p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="p-3 bg-[#111] border border-[#333] rounded-xl text-white w-fit mb-4 group-hover:scale-105 transition-transform">
                                        <Icon size={22} />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-gray-200">{item.title}</h3>
                                    <p className="text-gray-400 text-xs leading-relaxed mb-4">{item.desc}</p>
                                </div>

                                <div className="flex items-center gap-1 text-xs font-semibold text-gray-400 group-hover:text-white transition-colors">
                                    <span>Ouvrir</span>
                                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Daily Verse Inspiration Card */}
            <div className="w-full mt-16 bg-[#0a0a0a] border border-[#333] p-8 rounded-3xl text-center relative overflow-hidden">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Rappel du Jour</div>
                <p className="text-2xl sm:text-3xl font-arabic text-white mb-4 leading-loose" dir="rtl">
                    "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ"
                </p>
                <p className="text-gray-300 text-sm max-w-lg mx-auto italic mb-2">
                    "N'est-ce pas par l'évocation d'Allah que les cœurs se tranquillisent ?"
                </p>
                <span className="text-xs text-gray-500 font-mono">(Sourate Ar-Ra'd : Verset 28)</span>
            </div>
        </div>
    );
}
