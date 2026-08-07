import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, Target, Compass, BookMarked, Music } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function PracticeHub() {
    const features = [
        { path: '/adhkar', label: 'Adhkar', icon: Heart, desc: 'Invocations quotidiennes et situations', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { path: '/tasbih', label: 'Tasbih', icon: Activity, desc: 'Chapelet numérique', color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { path: '/wird', label: 'Wird', icon: BookMarked, desc: 'Votre programme de lecture', color: 'text-purple-400', bg: 'bg-purple-400/10' },
        { path: '/goals', label: 'Objectifs', icon: Target, desc: 'Suivi de vos objectifs journaliers', color: 'text-rose-400', bg: 'bg-rose-400/10' },
        { path: '/qibla', label: 'Qibla', icon: Compass, desc: 'Direction de la prière', color: 'text-amber-400', bg: 'bg-amber-400/10' },
        { path: '/nasheeds', label: 'Nasheeds', icon: Music, desc: 'Chants islamiques (Vocal Only disponible)', color: 'text-indigo-400', bg: 'bg-indigo-400/10' }
    ];

    return (
        <div className="pt-8 px-4 max-w-5xl mx-auto pb-24">
            <PageHeader 
                icon={<Heart size={32} />} 
                title="Pratiquer" 
                subtitle="Outils pour vous accompagner dans votre adoration quotidienne." 
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                {features.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link 
                            key={item.path} 
                            to={item.path}
                            className="bg-[#0a0a0a] border border-[#222] hover:border-[#444] rounded-2xl p-5 flex items-start gap-4 transition-all hover:bg-[#111] group"
                        >
                            <div className={`p-3 rounded-xl ${item.bg} ${item.color} transition-transform group-hover:scale-110`}>
                                <Icon size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-100 text-lg mb-1">{item.label}</h3>
                                <p className="text-gray-500 text-sm">{item.desc}</p>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
