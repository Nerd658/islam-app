import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, Heart, Activity, CalendarDays, MessageCircle, Moon, Star, Compass, Target, Scroll, Languages, ChevronDown, ChevronRight, Layers, Sparkles, HelpCircle, GraduationCap, BookMarked } from 'lucide-react';

export default function Navigation() {
    const location = useLocation();
    const isArabicActive = location.pathname.startsWith('/arabic');
    const [arabicExpanded, setArabicExpanded] = useState(true);

    const navItems = [
        { path: '/', label: 'Accueil', icon: Home },
        { path: '/goals', label: 'Objectifs', icon: Target },
        { path: '/quran', label: 'Coran', icon: BookOpen },
        { path: '/hadiths', label: 'Hadiths', icon: Scroll },
        { path: '/wird', label: 'Wird', icon: BookMarked },
        { 
            path: '/arabic/alphabet', 
            label: 'Arabe', 
            icon: Languages,
            hasSubmenu: true,
            subItems: [
                { path: '/arabic/alphabet', label: 'Alphabet', icon: BookOpen },
                { path: '/arabic/vocabulary', label: 'Vocabulaire', icon: Layers },
                { path: '/arabic/tajweed', label: 'Tajweed', icon: Sparkles },
                { path: '/arabic/quiz', label: 'Quiz Test', icon: HelpCircle },
                { path: '/arabic/grammar', label: 'Grammaire', icon: GraduationCap }
            ]
        },
        { path: '/adhkar', label: 'Adhkar', icon: Heart },
        { path: '/tasbih', label: 'Tasbih', icon: Activity },
        { path: '/names', label: '99 Noms', icon: Star },
        { path: '/qibla', label: 'Qibla', icon: Compass },
        { path: '/events', label: 'Dates', icon: CalendarDays },
        { path: '/chat', label: 'Imam', icon: MessageCircle }
    ];

    return (
        <nav className="fixed bottom-0 md:top-0 md:bottom-auto md:left-0 w-full md:w-64 md:h-screen bg-[#0a0a0a]/95 md:bg-[#050505] backdrop-blur-md md:backdrop-blur-none border-t md:border-t-0 md:border-r border-[#333] px-2 md:px-4 py-3 md:py-6 z-50 overflow-y-auto custom-scrollbar">
            <div className="max-w-6xl md:max-w-none mx-auto md:mx-0 flex md:flex-col justify-between md:justify-start items-center md:items-stretch h-full">
                
                <div className="w-full">
                    {/* Logo Desktop */}
                    <div className="hidden md:flex items-center gap-3 text-white mb-6 px-4">
                        <Moon size={28} strokeWidth={1.5} className="text-gray-100" />
                        <span className="font-bold tracking-tight text-xl">IslamApp</span>
                    </div>

                    <div className="flex md:flex-col justify-between md:justify-start items-center md:items-stretch w-full md:w-auto md:gap-1.5 flex-grow md:flex-grow-0">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            
                            if (item.hasSubmenu) {
                                return (
                                    <div key={item.path} className="flex flex-col w-full">
                                        <NavLink
                                            to={item.path}
                                            onClick={() => setArabicExpanded(!arabicExpanded)}
                                            className={() =>
                                                `flex flex-col md:flex-row items-center justify-between gap-1 md:gap-3 p-2 md:px-4 md:py-2.5 rounded-xl transition-all duration-200 ${
                                                    isArabicActive 
                                                        ? 'text-white md:bg-[#1a1a1a] md:border md:border-[#333] shadow-sm font-semibold' 
                                                        : 'text-gray-500 hover:text-gray-200 md:hover:bg-[#111] md:border md:border-transparent'
                                                }`
                                            }
                                        >
                                            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3">
                                                <Icon size={24} strokeWidth={1.5} className="md:w-5 md:h-5" />
                                                <span className="text-[10px] md:text-sm mt-1 md:mt-0 font-medium">{item.label}</span>
                                            </div>
                                            <span className="hidden md:block">
                                                {arabicExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                            </span>
                                        </NavLink>

                                        {/* Subsections Collapsible Menu */}
                                        {isArabicActive && arabicExpanded && (
                                            <div className="hidden md:flex flex-col pl-7 pr-2 py-1 space-y-1 border-l border-[#222] ml-4 mt-1">
                                                {item.subItems.map(sub => {
                                                    const SubIcon = sub.icon;
                                                    const isSubActive = location.pathname === sub.path;
                                                    return (
                                                        <NavLink
                                                            key={sub.path}
                                                            to={sub.path}
                                                            className={`flex items-center gap-2 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                                                                isSubActive 
                                                                    ? 'text-emerald-400 bg-emerald-950/40 font-semibold' 
                                                                    : 'text-gray-400 hover:text-white hover:bg-[#111]'
                                                            }`}
                                                        >
                                                            <SubIcon size={13} />
                                                            <span>{sub.label}</span>
                                                        </NavLink>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex flex-col md:flex-row items-center md:justify-start gap-1 md:gap-3 p-2 md:px-4 md:py-2.5 rounded-xl transition-all duration-200 ${
                                            isActive 
                                                ? 'text-white md:bg-[#1a1a1a] md:border md:border-[#333] shadow-sm font-semibold' 
                                                : 'text-gray-500 hover:text-gray-200 md:hover:bg-[#111] md:border md:border-transparent'
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

            </div>
        </nav>
    );
}
