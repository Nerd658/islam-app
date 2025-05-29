import React from 'react'

export default function PrayerTimesList({prayerTimes}) {
    return (
    <>
            
                <div className="w-full px-4 ">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 max-w-3xl mx-auto mt-4 pb-10">
                        {Object.entries(prayerTimes).map(([key, value], index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between px-6 py-4 bg-white/10 text-white rounded-xl shadow-md backdrop-blur-sm"
                            >
                            {/* Nom de la prière */}
                            <h3 className="text-md font-semibold capitalize">{key}</h3>
                            {/* Heure de la prière */}
                            <p className="text-md font-mono">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            
    </>
)
}
