import React from 'react'

export default function PrayerTimesList({prayerTimes}) {
    const { hijriDate, ...times } = prayerTimes;

    return (
    <>
        <div className="w-full px-4 text-center">
            {hijriDate && (
                <div className="text-xl font-bold text-yellow-300 mb-4 bg-black/20 inline-block px-4 py-2 rounded-lg">
                    📅 Date Hégirienne : {hijriDate}
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 max-w-3xl mx-auto mt-4 pb-10">
                {Object.entries(times).map(([key, value], index) => (
                    <div
                        key={index}
                        className={`flex items-center justify-between px-6 py-4 text-white rounded-xl shadow-md backdrop-blur-sm ${key === 'fajr' || key === 'maghrib' ? 'bg-green-600/40 border border-green-400' : 'bg-white/10'}`}
                    >
                    {/* Nom de la prière */}
                    <h3 className="text-md font-semibold capitalize">{key}</h3>
                    {/* Heure de la prière */}
                    <p className="text-md font-mono font-bold text-lg">{value}</p>
                    </div>
                ))}
            </div>
        </div>
    </>
)
}
