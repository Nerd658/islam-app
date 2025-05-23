import {  useEffect, useState } from 'react'
import axios from 'axios'


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
      <form
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
                
                setCity(item.city);
                setCountry(item.country);
                setCountry_code(item.country_code);
                setResult([]);
                setPrayerTimes(null);
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
      {error && <p>{error} </p>}



      </form>


    </> 
  )
}
export default App;