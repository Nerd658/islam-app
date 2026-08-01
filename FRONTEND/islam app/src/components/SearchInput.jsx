import React from 'react';
import { Search } from 'lucide-react';

export default function SearchInput({ search, setSearch, setError, setValue, setPrayerTimes }) {
    return (
        <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <input
                type="text" 
                placeholder="Tapez le nom d'une ville (ex: Paris, Casablanca...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => {
                    setError('');
                    setValue('');
                    setPrayerTimes(null);   
                }}
                className="w-full bg-[#111] border border-[#333] text-white py-3.5 pl-12 pr-4 rounded-xl outline-none focus:border-gray-500 transition-colors shadow-inner text-sm"
            />
        </div>  
    );
}
