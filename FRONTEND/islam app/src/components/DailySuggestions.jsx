import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Heart, Activity, Star, CheckCircle2, Circle, ArrowUpRight } from 'lucide-react';

export default function DailySuggestions() {
    const navigate = useNavigate();
    const todayStr = new Date().toISOString().split('T')[0];

    const defaultGoals = [
        { id: 'hizb', label: 'Lire 1 Hizb / Page', path: '/quran', icon: BookOpen },
        { id: 'adhkar', label: 'Réciter les Adhkar', path: '/adhkar', icon: Heart },
        { id: 'tasbih', label: '100 Istighfar (Tasbih)', path: '/tasbih', icon: Activity },
        { id: 'names', label: 'Méditer 1 Nom d\'Allah', path: '/names', icon: Star }
    ];

    const [completed, setCompleted] = useState(() => {
        try {
            const saved = localStorage.getItem('daily_goals_status');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.date === todayStr) {
                    return parsed.completed || {};
                }
            }
        } catch (e) {
            console.error('Error reading daily goals:', e);
        }
        return {};
    });

    useEffect(() => {
        try {
            localStorage.setItem('daily_goals_status', JSON.stringify({
                date: todayStr,
                completed
            }));
        } catch (e) {
            console.error('Error saving daily goals:', e);
        }
    }, [completed, todayStr]);

    const toggleGoal = (id, e) => {
        e.stopPropagation();
        setCompleted(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const completedCount = Object.values(completed).filter(Boolean).length;
    const progressPercent = Math.round((completedCount / defaultGoals.length) * 100);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4 px-1">
                <span className="text-sm font-bold uppercase tracking-wider text-gray-200">Objectifs du jour</span>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md border border-emerald-400/20">{completedCount}/{defaultGoals.length}</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#1a1a1a] rounded-full h-1.5 mb-4 overflow-hidden border border-[#333]">
                <div 
                    className="bg-white h-full transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {/* List of Goals */}
            <div className="space-y-1.5">
                {defaultGoals.map((goal) => {
                    const Icon = goal.icon;
                    const isDone = !!completed[goal.id];

                    return (
                        <div 
                            key={goal.id}
                            onClick={() => navigate(goal.path)}
                            className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all border ${
                                isDone 
                                    ? 'bg-[#0f1711] border-emerald-900/40 text-gray-400' 
                                    : 'bg-[#111] hover:bg-[#181818] border-[#262626] text-gray-200'
                            }`}
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <button 
                                    onClick={(e) => toggleGoal(goal.id, e)}
                                    className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                                    title={isDone ? "Marquer non accompli" : "Marquer comme fait"}
                                >
                                    {isDone ? (
                                        <CheckCircle2 size={16} className="text-emerald-400" />
                                    ) : (
                                        <Circle size={16} className="text-gray-500 group-hover:text-gray-300" />
                                    )}
                                </button>
                                <span className={`text-xs font-medium truncate ${isDone ? 'line-through text-gray-500' : ''}`}>
                                    {goal.label}
                                </span>
                            </div>

                            <ArrowUpRight size={14} className="text-gray-600 group-hover:text-white transition-colors flex-shrink-0" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
