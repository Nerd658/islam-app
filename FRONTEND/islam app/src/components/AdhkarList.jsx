import React, { useState } from 'react';
import adhkarData from '../data/adhkar.json';

export default function AdhkarList() {
    const [time, setTime] = useState('morning');

    const filteredAdhkar = adhkarData.filter(a => a.time === time);

    return (
        <div className="w-full max-w-3xl mx-auto mt-16 mb-16 px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Invocations (Adhkar)</h2>
            <div className="flex justify-center space-x-4 mb-8">
                <button 
                    onClick={() => setTime('morning')}
                    className={`px-8 py-3 rounded-full font-bold transition-all shadow-lg transform hover:scale-105 ${time === 'morning' ? 'bg-amber-400 text-slate-900' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                >
                    Matin 🌅
                </button>
                <button 
                    onClick={() => setTime('evening')}
                    className={`px-8 py-3 rounded-full font-bold transition-all shadow-lg transform hover:scale-105 ${time === 'evening' ? 'bg-indigo-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                >
                    Soir 🌙
                </button>
            </div>

            <div className="space-y-6">
                {filteredAdhkar.map((dhikr) => (
                    <div key={dhikr.id} className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl border border-white/10">
                        <p className="text-2xl sm:text-3xl text-right font-arabic leading-loose mb-6 text-amber-300" dir="rtl">{dhikr.arabic}</p>
                        <p className="text-lg text-gray-200 italic mb-6 leading-relaxed">{dhikr.translation}</p>
                        <div className="flex justify-between items-center text-sm font-semibold">
                            <span className="bg-white/20 px-4 py-2 rounded-full text-white">Répéter : {dhikr.count} fois</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
