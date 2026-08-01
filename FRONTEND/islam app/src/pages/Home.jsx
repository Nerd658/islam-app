import {useState } from 'react'
import { Link } from 'react-router-dom';
import SearchInput from '../components/SearchInput';
import LocationSuggestions from '../components/LocationSuggestions';
import Header from '../components/Header';
import PrayerTimesList from '../components/PrayerTimesList';
import useLocationSearch from '../hooks/useLocationSearch';
import { fetchPrayerTimes } from '../api/fetchPrayerTimes';
import axios from 'axios';

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

      <div  className='overflow-hidden text-white min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-violet-900 pr-8 pl-8 flex flex-col items-center  pt-20'>
        < Header />
        
        <form onSubmit={handleSubmit}  className='flex flex-col items-center justify-center mt-10 space-y-2 w-full'>
          
          <button 
             type="button" 
             onClick={handleLocateMe}
             disabled={loading}
             className="mb-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-6 rounded-full shadow-lg flex items-center gap-2 transition transform hover:scale-105"
          >
             📍 Me localiser automatiquement
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

            <div className=' font-semibold text-blue-300  text-sm sm:text-lg  text-center'>
              {value}

            </div>


            {/* Bouton de recherche */}
              { !prayerTimes && (
              <button
                disabled={loading}
                className='mt-4 mx-64 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-2 px-2 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-2xl text-base'
                type="submit"
              >
                {loading ? 'Chargement...' : 'Rechercher'}
              </button>)

              }
          

              {prayerTimes &&  <PrayerTimesList prayerTimes={prayerTimes} /> }

            {error && <p className="text-red-400 mt-2 bg-red-900/50 p-2 rounded">{error}</p>}

        </form>

        <div className="mt-12 mb-8 w-full max-w-md mx-auto">
            <Link to="/names" className="block p-6 rounded-3xl bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 shadow-xl shadow-orange-900/20 transition-all transform hover:scale-105 border border-amber-400/30 text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 text-8xl text-white/10 font-arabic group-hover:rotate-12 transition-transform">الله</div>
                <h3 className="text-2xl font-bold mb-2">Les 99 Noms d'Allah</h3>
                <p className="text-amber-100 text-sm">Découvrez leurs sens et méditez sur Ses attributs parfaits.</p>
            </Link>
        </div>

      </div>
    </> 
  )
}

