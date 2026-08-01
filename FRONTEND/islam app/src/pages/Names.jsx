import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';

export default function Names() {
    const [names, setNames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_ALADHAN_API_URL}/v1/asmaAlHusna`)
            .then(res => {
                setNames(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur de récupération des 99 noms:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="pt-8 px-4 max-w-5xl mx-auto mb-24">
            <div className="flex items-center justify-center gap-3 mb-8">
                <Star size={32} className="text-white" />
                <h2 className="text-3xl font-bold text-center text-white">Les 99 Noms d'Allah</h2>
                <Star size={32} className="text-white" />
            </div>
            
            <p className="text-center text-gray-400 mb-10 max-w-2xl mx-auto">
                "C'est à Allah qu'appartiennent les noms les plus beaux. Invoquez-Le par ces noms." (Coran 7:180)
            </p>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-xl text-gray-300">Chargement des Noms grandioses...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {names.map(name => (
                        <div key={name.number} className="relative group bg-[#0a0a0a] hover:bg-[#111] border border-[#333] hover:border-gray-500 p-6 rounded-2xl transition-all duration-300 flex flex-col items-center text-center">
                            <span className="absolute top-4 left-4 text-gray-600 font-bold text-sm">{name.number}</span>
                            
                            <h3 className="text-5xl font-arabic text-white mb-4 mt-6 leading-tight">
                                {name.name}
                            </h3>
                            
                            <h4 className="text-xl font-bold text-white mb-2 tracking-wide">
                                {name.transliteration}
                            </h4>
                            
                            <p className="text-gray-300 text-sm">
                                {name.en.meaning}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
