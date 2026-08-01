import React from "react";
import { useEffect } from "react";
import axios from "axios";
import cleanLocationResults from "@/utils/cleanLocationResults";

function useLocationSearch( search, setResult, setError) {
    useEffect(()=>{
    const fetchData = async () => {
      if (search.length < 2) {
      return;
    } 
    try {
      const response = await axios.get(`${import.meta.env.VITE_NOMINATIM_API_URL}/search?q=${encodeURIComponent(search)}&format=json&addressdetails=1&limit=10`, {
        headers: {
            'Accept-Language': 'fr',
            'User-Agent': 'IslamApp/1.0 (test@example.com)'
        }
      });

      const data = response.data;
      const cleaned = cleanLocationResults(data);
        

      setResult(cleaned);
      console.log(cleaned );

    }
    
    catch (error) {
        console.error(error);
      setError(error.message);
      setResult([]);

    } 
    }
    
    const delayDebouce = setTimeout(fetchData, 500);
    return () => clearTimeout(delayDebouce);

  } ,[search, setResult, setError])
}

export default useLocationSearch