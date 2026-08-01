import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Heart, Activity, CalendarDays, MessageCircle, Moon } from 'lucide-react';

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
        <nav className="fixed bottom-0 md:top-0 md:bottom-auto w-full bg-[#0a0a0a]/95 backdrop-blur-md border-t md:border-t-0 md:border-b border-[#333] px-2 md:px-8 py-3 md:py-4 z-50">
            <div className="max-w-6xl mx-auto flex justify-between items-center h-full">
                
                {/* Logo Desktop */}
                <div className="hidden md:flex items-center gap-2 text-white mr-8">
                    <Moon size={24} strokeWidth={1.5} />
                    <span className="font-semibold tracking-tight text-lg">IslamApp</span>
                </div>

                <div className="flex justify-between items-center w-full md:w-auto md:gap-8 flex-grow md:flex-grow-0">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex flex-col md:flex-row items-center gap-1 md:gap-2 p-2 md:px-4 md:py-2 rounded-lg transition-colors duration-200 ${
                                        isActive 
                                            ? 'text-white md:bg-[#111] md:border md:border-[#333]' 
                                            : 'text-gray-500 hover:text-gray-300 md:hover:bg-[#111]/50'
                                    }`
                                }
                            >
                                <Icon size={24} strokeWidth={1.5} className="md:w-5 md:h-5" />
                                <span className="text-[10px] md:text-sm mt-1 md:mt-0 font-medium">{item.label}</span>
                            </NavLink>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
