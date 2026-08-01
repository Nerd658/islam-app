import React from 'react';
import { MapPin } from 'lucide-react';

export default function LocationSuggestions({ result, setValue, setResult, setSearch, setError, setCity, setCountry_code, setPrayerTimes }) {
    if (!result || result.length === 0) return null;

    return (
        <div className="absolute top-full left-0 w-full mt-2 bg-[#0a0a0a] border border-[#333] rounded-2xl shadow-2xl overflow-hidden z-50 max-h-60 overflow-y-auto custom-scrollbar">
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
                    }}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#1a1a1a] cursor-pointer transition-colors duration-150 border-b border-[#181818] last:border-0 text-gray-200 hover:text-white text-sm"
                >
                    <MapPin size={16} className="text-gray-500 flex-shrink-0" />
                    <span className="truncate">{item.display}</span>
                </div>
            ))}
        </div>
    );
}
