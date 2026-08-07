import React, { useState, useEffect } from 'react';
import { Moon as MoonIcon, Star, RefreshCw } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function Moon() {
    const [moonData, setMoonData] = useState(null);
    const [phasesData, setPhasesData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMoonData = async () => {
            try {
                const [moonRes, phasesRes] = await Promise.all([
                    fetch(`https://ummahapi.com/api/moon?apikey=${import.meta.env.VITE_UMMAH_API_KEY}`),
                    fetch(`https://ummahapi.com/api/moon/phases?count=3&apikey=${import.meta.env.VITE_UMMAH_API_KEY}`)
                ]);
                
                if (moonRes.ok) setMoonData((await moonRes.json()).data);
                if (phasesRes.ok) setPhasesData((await phasesRes.json()).data.new_moons);
            } catch (err) {
                console.error("Failed to fetch moon data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMoonData();
    }, []);

    const renderMoonIcon = (phase) => {
        // Un icône approximatif pour le style, on utilise l'icône de base
        return <MoonIcon size={48} className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" />;
    };

    return (
        <div className="pt-8 px-4 max-w-4xl mx-auto pb-24">
            <PageHeader 
                icon={<MoonIcon size={32} />} 
                title="Observation Lunaire" 
                subtitle="Phases de la lune, visibilité du croissant et prochaines nouvelles lunes." 
            />

            {loading ? (
                <div className="flex justify-center items-center py-20 text-blue-500">
                    <RefreshCw className="animate-spin w-8 h-8" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {/* Status Actuel */}
                    {moonData && (
                        <div className="bg-[#111] border border-[#333] rounded-3xl p-8 relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 text-blue-500/10 blur-xl">
                                <MoonIcon size={120} />
                            </div>
                            
                            <h3 className="text-lg font-bold text-white mb-6">Aujourd'hui</h3>
                            
                            <div className="flex items-center gap-6 mb-8">
                                {renderMoonIcon(moonData.moon.phase)}
                                <div>
                                    <p className="text-2xl font-bold text-blue-400 capitalize">{moonData.moon.phase}</p>
                                    <p className="text-sm text-gray-400">Illumination : {Math.round(parseFloat(moonData.moon.illumination_pct || 0))}%</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#333]">
                                    <p className="text-xs text-gray-500 mb-1">Date Hégirienne (Calculée)</p>
                                    <p className="font-medium text-white">{moonData.hijri.day} {moonData.hijri.month_arabic} ({moonData.hijri.month_name}) {moonData.hijri.year}</p>
                                    {moonData.hijri.is_sacred_month && (
                                        <span className="inline-block mt-2 text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded uppercase font-bold">Mois Sacré</span>
                                    )}
                                </div>
                                
                                <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#333]">
                                    <p className="text-xs text-gray-500 mb-1">Visibilité du Croissant ce soir</p>
                                    <p className="font-medium text-white capitalize">{moonData.moon.crescent_visibility}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Prochaines Nouvelles Lunes */}
                    {phasesData && (
                        <div className="bg-[#0a0a0a] border border-[#222] rounded-3xl p-8">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Star size={20} className="text-amber-500" /> Prochaines Nouvelles Lunes
                            </h3>
                            
                            <div className="space-y-4">
                                {phasesData.map((phase, i) => (
                                    <div key={i} className="p-4 rounded-xl border border-[#333] hover:border-blue-500/50 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-blue-400 font-bold">{phase.expected_crescent.hijri_month_starting}</span>
                                            <span className="text-xs text-gray-500 font-mono">{phase.new_moon.hijri.year}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                                            <div>
                                                <p className="text-gray-500 text-xs">Conjonction Astronomique</p>
                                                <p className="text-gray-300">{new Date(phase.new_moon.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs">Date estimée du 1er</p>
                                                <p className="text-gray-300">{new Date(phase.expected_crescent.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-600 mt-6 text-center">
                                Les dates de début de mois sont des estimations basées sur la visibilité calculée du croissant.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
