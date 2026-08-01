import {useState } from 'react'
import { Link } from 'react-router-dom';
import SearchInput from '../components/SearchInput';
import LocationSuggestions from '../components/LocationSuggestions';
import Header from '../components/Header';
import PrayerTimesList from '../components/PrayerTimesList';
import useLocationSearch from '../hooks/useLocationSearch';
import { fetchPrayerTimes } from '../api/fetchPrayerTimes';
import axios from 'axios';
import { MapPin } from 'lucide-react';

export default function Home() {
  const [search, setSearch] = useState('');
  const [result, setResult] = useState([]);
  const [city, setCity] = useState('');
  // const [country, setCountry] = useState(''); 
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
      setError('veuillez bien ecrire le nom');
      return;
    }
    setError("");
    setLoading(true);

    try {
      const data = await fetchPrayerTimes(city, country_code)
      
      setPrayerTimes(data);
      setLoading(false);
      setCity('');
      setCountry_code('');
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
    
  }


  return (
    <>  

      <div className='overflow-hidden min-h-screen flex flex-col items-center pt-6'>
        < Header />
        
        <form onSubmit={handleSubmit}  className='flex flex-col items-center justify-center mt-10 space-y-2 w-full'>
          
          <button 
             type="button" 
             onClick={handleLocateMe}
             disabled={loading}
             className="mb-8 bg-white text-black hover:bg-gray-200 font-medium py-3 px-6 rounded-full flex items-center gap-2 transition disabled:opacity-50"
          >
             <MapPin className="w-5 h-5 text-gray-700" /> Me localiser automatiquement
          </button>

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

            <div className='font-medium text-gray-300 text-sm mt-4 text-center'>
              {value}
            </div>


            {/* Bouton de recherche */}
              <button
                disabled={loading}
                className='mt-8 mx-auto block bg-[#111] hover:bg-[#222] border border-[#333] text-white font-medium py-3 px-12 rounded-full transition disabled:opacity-50'
                type="submit"
              >
                {loading ? 'Recherche...' : 'Rechercher'}
              </button>)
          

              {prayerTimes &&  <PrayerTimesList prayerTimes={prayerTimes} /> }

            {error && <p className="text-red-400 mt-2 bg-red-900/50 p-2 rounded">{error}</p>}

        </form>

        <div className="mt-16 mb-8 w-full max-w-md mx-auto px-4">
            <Link to="/names" className="block p-6 rounded-2xl bg-[#0a0a0a] hover:bg-[#111] border border-[#333] hover:border-gray-500 transition-colors text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mt-2 -mr-2 text-6xl text-white/5 font-arabic group-hover:rotate-12 transition-transform">الله</div>
                <h3 className="text-xl font-semibold mb-2 text-white">Les 99 Noms d'Allah</h3>
                <p className="text-gray-400 text-sm">Découvrez leurs sens et méditez sur Ses attributs parfaits.</p>
            </Link>
        </div>

      </div>
    </> 
  )
}

