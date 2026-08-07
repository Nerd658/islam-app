import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, MessageCircle, Settings, HelpCircle, HeartHandshake } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function MoreHub() {
    const features = [
        { path: '/events', label: 'Dates Islamiques', icon: CalendarDays, desc: 'Calendrier hégirien et événements', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        // L'imam IA est masqué pour l'instant
        // { path: '/chat', label: 'Imam Virtuel IA', icon: MessageCircle, desc: 'Posez vos questions (en cours)', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    ];

    return (
        <div className="pt-8 px-4 max-w-5xl mx-auto pb-24">
            <PageHeader 
                icon={<HelpCircle size={32} />} 
                title="Plus" 
                subtitle="Fonctionnalités supplémentaires et paramètres." 
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
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

                <div className="bg-[#0a0a0a] border border-[#222] hover:border-[#444] rounded-2xl p-5 flex items-start gap-4 transition-all hover:bg-[#111] opacity-50 cursor-not-allowed">
                     <div className="p-3 rounded-xl bg-gray-500/10 text-gray-400">
                         <Settings size={24} />
                     </div>
                     <div>
                         <h3 className="font-bold text-gray-100 text-lg mb-1">Paramètres</h3>
                         <p className="text-gray-500 text-sm">Bientôt disponible</p>
                     </div>
                </div>

                <div className="bg-[#0a0a0a] border border-[#222] hover:border-[#444] rounded-2xl p-5 flex items-start gap-4 transition-all hover:bg-[#111] opacity-50 cursor-not-allowed">
                     <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
                         <HeartHandshake size={24} />
                     </div>
                     <div>
                         <h3 className="font-bold text-gray-100 text-lg mb-1">Faire un don</h3>
                         <p className="text-gray-500 text-sm">Bientôt disponible</p>
                     </div>
                </div>
            </div>
        </div>
    );
}
