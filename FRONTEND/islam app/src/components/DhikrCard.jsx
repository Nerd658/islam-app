import React from 'react';

export default function DhikrCard({ arabic, translation, count }) {
    return (
        <div className="bg-[#0a0a0a] p-6 sm:p-8 rounded-2xl border border-[#333] transition-colors hover:border-gray-500">
            <p className="text-2xl sm:text-3xl text-right font-arabic leading-loose mb-6 text-white" dir="rtl">
                {arabic}
            </p>
            <p className="text-sm sm:text-base text-gray-400 mb-6 leading-relaxed">
                {translation}
            </p>
            <div className="flex justify-between items-center text-sm font-semibold">
                <span className="bg-[#222] border border-[#444] px-4 py-2 rounded-full text-white">
                    Répéter : {count} fois
                </span>
            </div>
        </div>
    );
}
