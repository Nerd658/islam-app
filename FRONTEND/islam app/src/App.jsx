import {useState } from 'react'
import SearchInput from './components/SearchInput';
import LocationSuggestions from './components/LocationSuggestions';
import Header from './components/Header';
import PrayerTimesList from './components/PrayerTimesList';
import useLocationSearch from './hooks/useLocationSearch';
import { fetchPrayerTimes } from './api/fetchPrayerTimes';


function App() {
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
        
        <form onSubmit={handleSubmit}  className='flex flex-col items-center justify-center mt-10 space-y-2'>
          
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


          
            {error && <p>{error} hello </p>}



        </form>

    
      </div>

    </> 
  )
}
export default App;

