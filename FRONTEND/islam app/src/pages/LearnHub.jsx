import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Scroll, Star, Mic, Languages, BookText, GraduationCap, ShieldCheck, Gamepad2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function LearnHub() {
    const features = [
        { path: '/fundamentals', label: 'Fondements', icon: ShieldCheck, desc: 'Piliers de l\'Islam et de la Foi', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { path: '/islamic-quiz', label: 'Quiz Islamique', icon: Gamepad2, desc: 'Testez vos connaissances', color: 'text-pink-400', bg: 'bg-pink-400/10' },
        { path: '/hadiths', label: 'Hadiths', icon: Scroll, desc: 'Paroles prophétiques authentiques', color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { path: '/names', label: "99 Noms d'Allah", icon: Star, desc: 'Apprentissage et méditation', color: 'text-amber-400', bg: 'bg-amber-400/10' },
        { path: '/stories', label: 'Histoires', icon: BookText, desc: 'Récits des Prophètes et Compagnons', color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
        { path: '/knowledge', label: 'Savoir & Pratique', icon: GraduationCap, desc: 'Tutos ablutions, prière et liens utiles', color: 'text-rose-400', bg: 'bg-rose-400/10' },
        { path: '/memorization', label: 'Mémorisation', icon: Mic, desc: 'Suivi de votre apprentissage', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
        { path: '/arabic/alphabet', label: 'Langue Arabe', icon: Languages, desc: 'Alphabet, vocabulaire et grammaire', color: 'text-purple-400', bg: 'bg-purple-400/10' }
    ];
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="pt-8 px-4 max-w-5xl mx-auto pb-24">
            <PageHeader 
                icon={<GraduationCap size={32} />} 
                title="Apprendre" 
                subtitle="Enrichissez vos connaissances religieuses à votre rythme." 
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                {loading ? (
                    Array.from({ length: 8 }).map((_, idx) => (
                        <div key={idx} className="bg-theme-surface border border-theme-border rounded-2xl p-5 flex items-start gap-4 animate-pulse">
                            <div className="w-12 h-12 rounded-xl bg-[#222]"></div>
                            <div className="flex-1 mt-1">
                                <div className="h-5 bg-[#222] rounded w-24 mb-2"></div>
                                <div className="h-3 bg-[#222] rounded w-full"></div>
                                <div className="h-3 bg-[#222] rounded w-3/4 mt-1"></div>
                            </div>
                        </div>
                    ))
                ) : (
                    features.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path}
                                className="bg-theme-surface border border-theme-border hover:border-theme-primary/30 rounded-2xl p-5 flex items-start gap-4 transition-all hover:bg-theme-surface-hover hover:shadow-lg group"
                            >
                                <div className={`p-3 rounded-xl ${item.bg} ${item.color} transition-transform group-hover:scale-110`}>
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-theme-text text-lg mb-1">{item.label}</h3>
                                    <p className="text-theme-text-muted text-sm">{item.desc}</p>
                                </div>
                            </Link>
                        )
                    })
                )}
            </div>
        </div>
    );
}
