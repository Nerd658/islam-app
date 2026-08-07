import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import guideData from '../data/guide.json';
import { 
    HelpCircle, MapPin, BookOpen, Heart, MessageCircle, 
    Calculator, Video, ChevronDown, ChevronUp, Play
} from 'lucide-react';
import PageHeader from '../components/PageHeader';

const IconMap = {
    MapPin, BookOpen, Heart, MessageCircle, Calculator, Video
};

export default function Guide() {
    const [openSection, setOpenSection] = useState(null);

    const toggleSection = (id) => {
        setOpenSection(openSection === id ? null : id);
    };

    return (
        <div className="pt-8 px-4 max-w-4xl mx-auto pb-24">
            <PageHeader 
                icon={<HelpCircle size={32} />} 
                title="Guide d'Utilisation" 
                subtitle="Découvrez comment utiliser toutes les fonctionnalités de la plateforme." 
            />

            <div className="mt-8 space-y-4">
                {guideData.map((section, index) => {
                    const Icon = IconMap[section.icon] || HelpCircle;
                    const isOpen = openSection === section.id;
                    const number = (index + 1).toString().padStart(2, '0');

                    return (
                        <div 
                            key={section.id} 
                            className={`bg-theme-surface border ${isOpen ? 'border-theme-primary shadow-lg shadow-theme-primary/10' : 'border-theme-border'} rounded-2xl overflow-hidden transition-all duration-300`}
                        >
                            <button 
                                onClick={() => toggleSection(section.id)}
                                className="w-full flex items-center justify-between p-5 sm:p-6 bg-theme-surface hover:bg-theme-surface-hover transition-colors text-left"
                            >
                                <div className="flex items-center gap-4 sm:gap-6">
                                    <span className="text-xl font-bold text-theme-text-muted/30 font-mono hidden sm:block">
                                        {number}
                                    </span>
                                    <div className={`p-3 rounded-xl transition-colors ${isOpen ? 'bg-theme-primary text-black' : 'bg-theme-bg text-theme-text'}`}>
                                        <Icon size={24} />
                                    </div>
                                    <div>
                                        <h2 className={`font-bold text-lg sm:text-xl transition-colors ${isOpen ? 'text-theme-primary' : 'text-theme-text'}`}>
                                            {section.title}
                                        </h2>
                                        {!isOpen && (
                                            <p className="text-theme-text-muted text-sm mt-1 line-clamp-1">
                                                {section.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-theme-text-muted shrink-0 ml-4">
                                    {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                </div>
                            </button>

                            {isOpen && (
                                <div className="p-5 sm:p-6 pt-0 sm:pt-0 animate-in slide-in-from-top-2 duration-300">
                                    <div className="pl-0 sm:pl-[5.5rem]">
                                        <p className="text-theme-text mb-6 text-base leading-relaxed">
                                            {section.description}
                                        </p>
                                        
                                        <h3 className="font-bold text-theme-text mb-3 flex items-center gap-2">
                                            <Play size={16} className="text-theme-primary" />
                                            Comment faire :
                                        </h3>
                                        <ul className="space-y-3 mb-8">
                                            {section.steps.map((step, idx) => (
                                                <li key={idx} className="flex gap-3 text-theme-text-muted">
                                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-theme-bg border border-theme-border flex items-center justify-center text-xs font-bold text-theme-text mt-0.5">
                                                        {idx + 1}
                                                    </span>
                                                    <span className="leading-relaxed">{step}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <Link 
                                            to={section.link}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-theme-bg hover:bg-[#1a1a1a] border border-theme-border text-theme-text font-bold rounded-xl transition-colors text-sm"
                                        >
                                            {section.linkText}
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            
            {/* Quick Tips */}
            <div className="mt-12 bg-theme-primary/10 border border-theme-primary/20 rounded-2xl p-6 text-center">
                <h3 className="font-bold text-theme-primary text-lg mb-2">Astuce Rapide</h3>
                <p className="text-theme-text-muted text-sm max-w-lg mx-auto">
                    Vous pouvez installer IslamApp sur votre téléphone ! Cliquez sur "Ajouter à l'écran d'accueil" depuis le menu de votre navigateur pour l'utiliser comme une application native, même sans connexion internet.
                </p>
            </div>
        </div>
    );
}
