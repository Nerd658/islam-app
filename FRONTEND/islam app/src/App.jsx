import {  useEffect, useState } from 'react'
import axios from 'axios'
import SearchInput from './components/SearchInput';

import Header from './components/Header';


function App() {
  const [search, setSearch] = useState('');
  const [result, setResult] = useState([]);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState(''); 
  const [error, setError] = useState('');
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [country_code, setCountry_code] = useState('');
  const [value, setValue] = useState('');

  useEffect(()=>{
    const fetchData = async () => {
      if (search.length < 2) {
      return;
    } 
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(search)}&format=json&addressdetails=1&limit=10`);

      const data = response.data;
      const cleaned = data
        .filter(item => item.address)
        .map(item => {
          const {city, town, village, state, country, province} =  item.address;
          return {
            display : `${city || town || village || province || ''} , ${state || ''} ,  ${country}`,	 
            importance: item.importance, 
            city : city || town || village || province || '',
            state: state || '',
            country: country,
            country_code: item.address.country_code.toUpperCase(),
          };
        })
        .sort((a, z) => z.importance - a.importance).slice(0, 5);

      setResult(cleaned);
      console.log(cleaned);

    }
    
    catch (error) {
      console.error(error);
      setError(error.message);
      setResult([]);

    } 
    }
    
    const delayDebouce = setTimeout(fetchData, 1000);
    return () => clearTimeout(delayDebouce);

  } ,[search])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!city || !country_code) {
      setError('Please enter a city and country');
      return;
    }
    setError("");
    setLoading(true);
    const response2 = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/prayer-times?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country_code)}`);

        const data = response.data;

        setPrayerTimes(data);
        
        setLoading(false);
        setCity('');
        setCountry('');
        setCountry_code('');
        
        

      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    }
    response2();
    

    
  }


  return (
    <>  

      <div  className='overflow-hidden text-white min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-violet-900 pr-8 pl-8 flex flex-col items-center  pt-28'>
        < Header />
        
          <form onSubmit={handleSubmit}  className='flex flex-col items-center justify-center mt-10 space-y-2'>
          
            <SearchInput
                search={search}
                setSearch={setSearch}
                setError={setError}
                setValue={setValue}
                setPrayerTimes={setPrayerTimes} 
            />

            <div className="mx-auto mt-10 space-y-2">
              {result.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setValue(item.display);
                    setResult([]);
                    setPrayerTimes(null);
                    setSearch('');
                    setError('');
                    setCity(item.city);
                    setCountry(item.country);
                    setCountry_code(item.country_code);
        
                    
                  }
                    

                  }
                  className="p-2 bg-gradient-to-r from-blue-500/30 to-violet-500/30 rounded shadow-sm  cursor-pointer hover:bg-gradient-to-r hover:from-blue-500/50 hover:to-violet-500/50 transition-colors duration-200"
                >
                  {item.display}
                </div>
              ))}
            </div>

            <div className=' font-semibold text-blue-300  text-sm sm:text-lg  text-center'>
              {value}

            </div>
            
              { !prayerTimes && (
              <button
                disabled={loading}
                className='mt-4 mx-64 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-2 px-2 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-2xl text-base'
                type="submit"
              >
                {loading ? 'Chargement...' : 'Rechercher'}
              </button>)

              }
          

              {prayerTimes && (
                <div className="w-full px-4 ">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 max-w-3xl mx-auto mt-4 pb-10">
                      {Object.entries(prayerTimes).map(([key, value], index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between px-6 py-4 bg-white/10 text-white rounded-xl shadow-md backdrop-blur-sm"
                        >
                          {/* Nom de la prière */}
                          <h3 className="text-md font-semibold capitalize">{key}</h3>
                          {/* Heure de la prière */}
                          <p className="text-md font-mono">{value}</p>
                        </div>
                      ))}
                    </div>
                </div>
            )}


          
          {error && <p>{error} hello </p>}



        </form>

    
      </div>

    </> 
  )
}
export default App;


    {/* <form
      onSubmit={handleSubmit} 
      >
          <div className='mx-64 w-full h-full grid grid-cols-2 gap-6'>
              <input
              className=' mt-10 space-y-2'
              placeholder='  triuver une ville'
              value= {search}
              onChange = {(e) => setSearch(e.target.value)}
              
              />   
        </div>  

        <div className="mx-64 mt-10 space-y-2">
          {result.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setValue(item.display);
                setResult([]);
                setPrayerTimes(null);
                setSearch('');
                
                setCity(item.city);
                setCountry(item.country);
                setCountry_code(item.country_code);
    
                
              }
                

              }
              className="p-2 bg-yellow-500 rounded shadow-sm  cursor-pointer hover:bg-yellow-600 transition-colors duration-200"
            >
              {item.display}
            </div>
          ))}
        </div>

        <div className='mx-64 mt-8'>
          {value}

        </div>
         <button
          disabled={loading}

          className='mt-8 mx-64' 
          type="submit"
        >
          {loading ? 'en cours ...' : <span>Rechercher</span>}
          
        </button>
      

      {prayerTimes && (
        <div className='mx-64 mt-10'>

          <h2> heure de priere de votre zone </h2>

          <p>Fajr: {prayerTimes.fajr} </p>
          <p>Dhuhr: {prayerTimes.dhuhr}</p>
          <p>Asr: {prayerTimes.asr}</p>
          <p>Maghrib: {prayerTimes.maghrib}</p>
          <p>Isha: {prayerTimes.isha}</p>
        </div>
      )}
      <br />
      {error && <p>{error} hello </p>}



      </form> */}
/**

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Search, MapPin, Clock, Star, Sunrise, Sun, Sunset, Moon } from 'lucide-react'

function App() {
  const [search, setSearch] = useState('');
  const [result, setResult] = useState([]);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState(''); 
  const [error, setError] = useState('');
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [country_code, setCountry_code] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (search.length < 2) {
        setResult([]);
        return;
      }

      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(search)}&format=json&addressdetails=1&limit=10`);
        const data = response.data;
        const cleaned = data
          .filter(item => item.address)
          .map(item => {
            const { city, town, village, state, country, province } = item.address;
            return {
              display: `${city || town || village || province || ''}, ${state || ''}, ${country}`,
              importance: item.importance,
              city: city || town || village || province || state ||'',
              state: state || '',
              country: country,
              country_code: item.address.country_code.toUpperCase(),
            };
          })
          .sort((a, z) => z.importance - a.importance).slice(0, 5);

        setResult(cleaned);
      } catch (error) {
        console.error(error);
        setError(error.message);
        setResult([]);
      }
    };

    const delayDebounce = setTimeout(fetchData, 500);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!city || !country_code) {
      setError('Veuillez sélectionner une ville');
      return;
    }
    setError("");
    setLoading(true);

    const fetchPrayerTimes = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/prayer-times?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country_code)}`);
        setPrayerTimes(response.data);
        setLoading(false);
        setCity('');
        setCountry('');
        setCountry_code('');
      } catch (error) {
        console.error(error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  };

  const getPrayerIcon = (prayer) => {
    switch(prayer) {
      case 'fajr': return <Sunrise className="w-5 h-5" />;
      case 'dhuhr': return <Sun className="w-5 h-5" />;
      case 'asr': return <Sun className="w-5 h-5" />;
      case 'maghrib': return <Sunset className="w-5 h-5" />;
      case 'isha': return <Moon className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-violet-900 p-4 ">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="text-center mb-12 pt-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full mb-6 shadow-2xl">
            <Clock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 via-violet-300 to-indigo-300 bg-clip-text text-transparent mb-2">
            Horaires de Prière
          </h1>
          <p className="text-slate-300 text-lg">Trouvez les heures de prière pour votre ville</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-2xl blur-sm"></div>
            <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
              <div className="flex items-center p-4">
                <Search className="w-5 h-5 text-slate-400 mr-3" />
                <input
                  className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none text-lg"
                  placeholder="Rechercher une ville..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {result.length > 0 && (
            <div className="space-y-2 animate-in slide-in-from-top-4 duration-300">
              {result.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setValue(item.display);
                    setCity(item.city);
                    setCountry(item.country);
                    setCountry_code(item.country_code);
                    setResult([]);
                    setPrayerTimes(null);
                    setSearch('');
                  }}
                  className="group relative cursor-pointer transform transition-all duration-200 hover:scale-[1.02]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-violet-500/30 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  <div className="relative bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 group-hover:border-blue-400/50 transition-colors duration-200">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-blue-400 mr-3 group-hover:text-violet-400 transition-colors duration-200" />
                      <span className="text-slate-200 group-hover:text-white transition-colors duration-200">
                        {item.display}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {value && (
            <div className="animate-in slide-in-from-top-4 duration-300">
              <div className="relative bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-xl p-4 border border-blue-400/30">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 mr-3" />
                  <span className="text-blue-100 font-medium">{value}</span>
                </div>
              </div>
            </div>
          )}

          <button
            disabled={loading || !value}
            type="submit"
            className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center">
              {loading ? 'Chargement...' : 'Rechercher'}
            </div>
          </button>

          {prayerTimes && (
            <div className="space-y-4 mt-10 text-slate-200">
              <h2 className="text-xl font-semibold text-white">Heures de prière</h2>
              {Object.entries(prayerTimes).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-3">
                  {getPrayerIcon(key)}
                  <span className="capitalize w-20">{key}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          )}
          

          {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default App;
**/