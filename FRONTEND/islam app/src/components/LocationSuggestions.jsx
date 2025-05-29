import React from 'react'

export default function LocationSuggestions({result, setValue, setResult, setSearch, setError, setCity, setCountry_code, setPrayerTimes}) {
    return (
        <>
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
                            setCountry_code(item.country_code);
        
                    
                            }
                    

                        }
                        className="p-2 bg-gradient-to-r from-blue-500/30 to-violet-500/30 rounded shadow-sm  cursor-pointer hover:bg-gradient-to-r hover:from-blue-500/50 hover:to-violet-500/50 transition-colors duration-200"
                    >
                        {item.display}
                    </div>
                ))}
            </div>
        </>
    )
}
