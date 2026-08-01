import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Heart, Activity, CalendarDays, MessageCircle } from 'lucide-react';

export default function Navigation() {
    const navItems = [
        { path: '/', label: 'Accueil', icon: Home },
        { path: '/quran', label: 'Coran', icon: BookOpen },
        { path: '/adhkar', label: 'Adhkar', icon: Heart },
        { path: '/tasbih', label: 'Tasbih', icon: Activity },
        { path: '/events', label: 'Dates', icon: CalendarDays },
        { path: '/chat', label: 'Imam', icon: MessageCircle }
    ];

    return (
        <nav className="fixed bottom-0 w-full bg-[#0a0a0a] border-t border-[#333] px-2 py-3 z-50">
            <div className="max-w-md mx-auto flex justify-between items-center">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex flex-col items-center p-2 rounded-lg transition-colors duration-200 ${
                                    isActive 
                                        ? 'text-white' 
                                        : 'text-gray-500 hover:text-gray-300'
                                }`
                            }
                        >
                            <Icon size={24} strokeWidth={1.5} />
                            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
}
