import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Layers, Moon, Calculator, Type, RefreshCw, Smartphone } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function MoreHub() {
    const features = [
        { path: '/events', label: 'Dates Islamiques', icon: CalendarDays, desc: 'Calendrier hégirien et événements', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { path: '/zakat', label: 'Calculateur de Zakat', icon: Calculator, desc: 'Zakat Al-Maal (Or, Argent) avec cours en direct', color: 'text-amber-400', bg: 'bg-amber-400/10' },
        { path: '/moon', label: 'Observation Lunaire', icon: Moon, desc: 'Phases lunaires et visibilité du croissant', color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { path: '/islamic-names', label: 'Prénoms Islamiques', icon: Type, desc: '210 prénoms authentiques (Filles & Garçons)', color: 'text-rose-400', bg: 'bg-rose-400/10' },
    ];

    const {
        needRefresh: [needRefresh],
        updateServiceWorker,
    } = useRegisterSW();

    const [isChecking, setIsChecking] = useState(false);
    const [updateStatus, setUpdateStatus] = useState('');

    const handleUpdateCheck = () => {
        setIsChecking(true);
        setUpdateStatus('');
        
        if (needRefresh) {
            updateServiceWorker(true);
            setTimeout(() => setIsChecking(false), 1000);
        } else {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistration().then(registration => {
                    if (registration) {
                        registration.update().then(() => {
                            setTimeout(() => {
                                setIsChecking(false);
                                setUpdateStatus('up_to_date');
                                setTimeout(() => setUpdateStatus(''), 3000);
                            }, 800);
                        }).catch(() => {
                            setTimeout(() => {
                                setIsChecking(false);
                                setUpdateStatus('error');
                                setTimeout(() => setUpdateStatus(''), 3000);
                            }, 800);
                        });
                    } else {
                        // No SW registered
                        setTimeout(() => {
                            setIsChecking(false);
                            setUpdateStatus('up_to_date');
                            setTimeout(() => setUpdateStatus(''), 3000);
                        }, 800);
                    }
                }).catch(() => {
                    setTimeout(() => {
                        setIsChecking(false);
                        setUpdateStatus('error');
                        setTimeout(() => setUpdateStatus(''), 3000);
                    }, 800);
                });
            } else {
                setTimeout(() => {
                    setIsChecking(false);
                    setUpdateStatus('up_to_date');
                    setTimeout(() => setUpdateStatus(''), 3000);
                }, 800);
            }
        }
    };

    return (
        <div className="pt-8 px-4 max-w-5xl mx-auto pb-24">
            <PageHeader 
                icon={<Layers size={32} />} 
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
                            className="bg-theme-surface border border-theme-border hover:border-theme-text-muted/50 rounded-2xl p-5 flex items-start gap-4 transition-all hover:bg-theme-surface-hover shadow-lg group"
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
                })}
            </div>

            <div className="mt-12">
                <h2 className="text-xl font-bold text-theme-text mb-6">Paramètres de l'Application</h2>
                <div className="bg-theme-surface border border-theme-border rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-theme-text-muted/10 text-theme-text-muted">
                            <Smartphone size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-theme-text text-lg mb-1">Mise à jour (PWA)</h3>
                            <p className="text-theme-text-muted text-sm">Vérifier manuellement s'il y a une nouvelle version de l'application disponible.</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto relative z-50">
                        <button 
                            onClick={handleUpdateCheck}
                            disabled={isChecking}
                            className={
                                needRefresh 
                                    ? "bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/20 animate-pulse w-full sm:w-auto cursor-pointer pointer-events-auto" 
                                    : "bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-500/20 w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer pointer-events-auto"
                            }
                        >
                            <RefreshCw size={20} className={isChecking ? "animate-spin" : ""} /> 
                            {needRefresh ? "Installer la mise à jour" : isChecking ? "Vérification..." : "Vérifier la mise à jour"}
                        </button>
                        
                        {/* Feedback messages */}
                        {updateStatus === 'up_to_date' && !needRefresh && (
                            <span className="text-sm font-bold text-emerald-500 animate-in fade-in slide-in-from-top-2 mt-2">
                                ✓ L'application est déjà à jour !
                            </span>
                        )}
                        {updateStatus === 'error' && (
                            <span className="text-sm font-bold text-red-500 animate-in fade-in slide-in-from-top-2 mt-2">
                                ✗ Impossible de vérifier
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
