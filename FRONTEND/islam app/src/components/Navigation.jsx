import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Heart, Activity } from 'lucide-react';

export default function Navigation() {
    const navItems = [
        { path: '/', label: 'Accueil', icon: Home },
        { path: '/quran', label: 'Coran', icon: BookOpen },
        { path: '/adhkar', label: 'Adhkar', icon: Heart },
        { path: '/tasbih', label: 'Tasbih', icon: Activity }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-lg border-t border-white/10 px-6 py-3 z-50 shadow-2xl">
            <div className="max-w-md mx-auto flex justify-between items-center">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => 
                                `flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
                                    isActive ? 'text-emerald-400 scale-110' : 'text-gray-400 hover:text-gray-200'
                                }`
                            }
                        >
                            <Icon size={24} className="mb-1" />
                            <span className="text-xs font-semibold">{item.label}</span>
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
}
