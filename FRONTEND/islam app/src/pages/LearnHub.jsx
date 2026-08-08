import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Scroll, Star, Mic, Languages, BookText, GraduationCap, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function LearnHub() {
    const features = [
        { path: '/fundamentals', label: 'Fondements', icon: ShieldCheck, desc: 'Piliers de l\'Islam et de la Foi', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { path: '/hadiths', label: 'Hadiths', icon: Scroll, desc: 'Paroles prophétiques authentiques', color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { path: '/names', label: "99 Noms d'Allah", icon: Star, desc: 'Apprentissage et méditation', color: 'text-amber-400', bg: 'bg-amber-400/10' },
        { path: '/stories', label: 'Histoires', icon: BookText, desc: 'Récits des Prophètes et Compagnons', color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
        { path: '/knowledge', label: 'Savoir & Pratique', icon: GraduationCap, desc: 'Tutos ablutions, prière et liens utiles', color: 'text-rose-400', bg: 'bg-rose-400/10' },
        { path: '/memorization', label: 'Mémorisation', icon: Mic, desc: 'Suivi de votre apprentissage', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
        { path: '/arabic/alphabet', label: 'Langue Arabe', icon: Languages, desc: 'Alphabet, vocabulaire et grammaire', color: 'text-purple-400', bg: 'bg-purple-400/10' }
    ];

    return (
        <div className="pt-8 px-4 max-w-5xl mx-auto pb-24">
            <PageHeader 
                icon={<GraduationCap size={32} />} 
                title="Apprendre" 
                subtitle="Enrichissez vos connaissances religieuses à votre rythme." 
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
