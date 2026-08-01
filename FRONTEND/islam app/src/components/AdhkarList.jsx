import React from 'react';
import adhkarData from '../data/adhkar.json';

export default function AdhkarList({ time }) {
    const filteredAdhkar = adhkarData.filter(a => a.time === time);

    return (
        <div className="space-y-6 pb-24">


            <div className="space-y-6">
                {filteredAdhkar.map((dhikr) => (
                    <div key={dhikr.id} className="bg-[#0a0a0a] p-6 sm:p-8 rounded-2xl border border-[#333] transition-colors hover:border-gray-500">
                        <p className="text-2xl sm:text-3xl text-right font-arabic leading-loose mb-6 text-white" dir="rtl">{dhikr.arabic}</p>
                        <p className="text-sm sm:text-base text-gray-400 mb-6 leading-relaxed">{dhikr.translation}</p>
                        <div className="flex justify-between items-center text-sm font-semibold">
                            <span className="bg-[#222] border border-[#444] px-4 py-2 rounded-full text-white">Répéter : {dhikr.count} fois</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
