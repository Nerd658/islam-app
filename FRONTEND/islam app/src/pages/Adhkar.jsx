import React, { useState } from 'react';
import AdhkarList from '../components/AdhkarList';
import { Sun, Moon } from 'lucide-react';

export default function Adhkar() {
    const [timeOfDay, setTimeOfDay] = useState('morning');

    return (
        <div className="pt-8 px-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">Adhkar du {timeOfDay === 'morning' ? 'Matin' : 'Soir'}</h2>
            
            <div className="flex justify-center mb-8 bg-[#111] p-1 rounded-xl border border-[#333]">
                <button 
                    onClick={() => setTimeOfDay('morning')}
                    className={`flex-1 py-3 px-6 rounded-lg font-bold transition-colors flex justify-center items-center gap-2 ${timeOfDay === 'morning' ? 'bg-white text-black shadow' : 'text-gray-500 hover:text-white'}`}
                >
                    <Sun size={20} /> Matin
                </button>
                <button 
                    onClick={() => setTimeOfDay('evening')}
                    className={`flex-1 py-3 px-6 rounded-lg font-bold transition-colors flex justify-center items-center gap-2 ${timeOfDay === 'evening' ? 'bg-white text-black shadow' : 'text-gray-500 hover:text-white'}`}
                >
                    <Moon size={20} /> Soir
                </button>
            </div>
            <AdhkarList time={timeOfDay} />
        </div>
    );
}
