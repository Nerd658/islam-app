import React from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import PageHeader from '../components/PageHeader';
import { Target, BookOpen, Heart, Activity, Star, CheckCircle2, Circle, ArrowRight, Gem, Award } from 'lucide-react';

export default function Goals() {
    const navigate = useNavigate();

    const goalCategories = [
        {
            id: 'quran',
            title: 'Lecture & Récitation du Coran',
            icon: BookOpen,
            path: '/quran',
            color: 'from-emerald-500/20 to-teal-500/5',
            borderColor: 'border-emerald-500/30',
            goals: [
                { id: 'hizb_1', label: 'Lire 1 Hizb complet' },
                { id: 'page_5', label: 'Lire 5 pages du Coran' },
                { id: 'listen_sourate', label: 'Écouter une Sourate avec récitateur' }
            ]
        },
        {
            id: 'adhkar',
            title: 'Invocations & Protections',
            icon: Heart,
            path: '/adhkar',
            color: 'from-blue-500/20 to-indigo-500/5',
            borderColor: 'border-blue-500/30',
            goals: [
                { id: 'adhkar_matin', label: 'Réciter les Adhkar du Matin' },
                { id: 'adhkar_soir', label: 'Réciter les Adhkar du Soir' },
                { id: 'adhkar_sommeil', label: 'Réciter les invocations avant de dormir' }
            ]
        },
        {
            id: 'tasbih',
            title: 'Dhikr & Tasbih',
            icon: Activity,
            path: '/tasbih',
            color: 'from-purple-500/20 to-pink-500/5',
            borderColor: 'border-purple-500/30',
            goals: [
                { id: 'istighfar_100', label: 'Faire 100 fois Istighfar (Astaghfirullah)' },
                { id: 'subhanallah_100', label: 'Faire 100 fois SubhanAllah wa bihamdihi' },
                { id: 'salawat_100', label: 'Prier 100 fois sur le Prophète (Salawat)' }
            ]
        },
        {
            id: 'names',
            title: 'Méditation des 99 Noms d\'Allah',
            icon: Star,
            path: '/names',
            color: 'from-amber-500/20 to-yellow-500/5',
            borderColor: 'border-amber-500/30',
            goals: [
                { id: 'names_3', label: 'Lire et apprendre 3 Beaux Noms d\'Allah' },
                { id: 'names_meditate', label: 'Méditer sur le sens de Ar-Rahman & Ar-Rahim' }
            ]
        }
    ];

    const allGoalsCount = goalCategories.reduce((acc, cat) => acc + cat.goals.length, 0);

    const [completed, setCompleted] = useLocalStorage('daily_goals_completed', {}, { ttl: 86400000 });

    const toggleGoal = (id) => {
        setCompleted(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const completedCount = Object.values(completed).filter(Boolean).length;
    const progressPercent = Math.round((completedCount / allGoalsCount) * 100);

    return (
        <div className="pt-8 px-4 max-w-4xl mx-auto mb-24">
            {/* Header */}
            <PageHeader 
                icon={<Target size={32} />}
                title="Programme & Objectifs du Jour"
                subtitle="Organisez votre journée spirituelle. Accomplissez vos objectifs quotidiens de lecture, d'invocations et de rappel."
            />

            {/* Overall Progress Card */}
            <div className="bg-[#0a0a0a] border border-[#333] p-6 sm:p-8 rounded-3xl mb-10 shadow-xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white text-black rounded-2xl font-bold">
                            <Award size={28} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Progression Quotidienne</h3>
                            <p className="text-sm text-gray-400">
                                {completedCount === allGoalsCount ? "🎉 Bravo ! Tous les objectifs sont accomplis !" : `${completedCount} sur ${allGoalsCount} objectifs complétés`}
                            </p>
                        </div>
                    </div>
                    <span className="text-3xl font-mono font-bold text-white bg-[#111] border border-[#333] px-5 py-2 rounded-2xl">
                        {progressPercent}%
                    </span>
                </div>

                <div className="w-full bg-[#1a1a1a] rounded-full h-3 overflow-hidden border border-[#333]">
                    <div 
                        className="bg-white h-full transition-all duration-500 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {goalCategories.map((category) => {
                    const CategoryIcon = category.icon;
                    const categoryCompleted = category.goals.filter(g => completed[g.id]).length;

                    return (
                        <div 
                            key={category.id} 
                            className={`bg-gradient-to-b ${category.color} bg-[#0a0a0a] border ${category.borderColor} p-6 rounded-3xl flex flex-col justify-between transition-all duration-300 hover:border-gray-500`}
                        >
                            <div>
                                {/* Category Title */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-[#111] border border-[#333] rounded-xl text-white">
                                            <CategoryIcon size={22} />
                                        </div>
                                        <h3 className="font-bold text-lg text-white">{category.title}</h3>
                                    </div>
                                    <span className="text-xs font-mono bg-[#111] border border-[#333] px-3 py-1 rounded-full text-gray-400">
                                        {categoryCompleted}/{category.goals.length}
                                    </span>
                                </div>

                                {/* Goals List */}
                                <div className="space-y-3 mb-6">
                                    {category.goals.map((goal) => {
                                        const isDone = !!completed[goal.id];

                                        return (
                                            <div 
                                                key={goal.id}
                                                onClick={() => toggleGoal(goal.id)}
                                                className={`flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer transition-all border ${
                                                    isDone 
                                                        ? 'bg-emerald-950/20 border-emerald-800/40 text-gray-400' 
                                                        : 'bg-[#111] hover:bg-[#161616] border-[#262626] text-gray-200'
                                                }`}
                                            >
                                                <button className="flex-shrink-0 text-gray-400">
                                                    {isDone ? (
                                                        <CheckCircle2 size={20} className="text-emerald-400" />
                                                    ) : (
                                                        <Circle size={20} className="text-gray-500" />
                                                    )}
                                                </button>
                                                <span className={`text-sm font-medium ${isDone ? 'line-through text-gray-500' : ''}`}>
                                                    {goal.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Action Redirect Button */}
                            <button 
                                onClick={() => navigate(category.path)}
                                className="w-full flex items-center justify-center gap-2 bg-[#111] hover:bg-white hover:text-black border border-[#333] text-white py-3 px-4 rounded-2xl transition-all duration-300 font-semibold text-sm group"
                            >
                                <span>Accomplir dans l'application</span>
                                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
