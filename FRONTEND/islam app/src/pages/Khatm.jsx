import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Target, CheckCircle2, RotateCcw, ChevronRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function Khatm() {
  const TOTAL_PAGES = 604;
  
  // States
  const [currentPage, setCurrentPage] = useState(1);
  const [targetDays, setTargetDays] = useState(30);
  const [pagesPerDay, setPagesPerDay] = useState(0);
  const [savedPlan, setSavedPlan] = useState(false);

  useEffect(() => {
    // Load from local storage
    const saved = localStorage.getItem('khatm_plan');
    if (saved) {
      const parsed = JSON.parse(saved);
      setCurrentPage(parsed.currentPage || 1);
      setTargetDays(parsed.targetDays || 30);
      setSavedPlan(true);
    }
  }, []);

  useEffect(() => {
    // Calculate pages per day
    const remainingPages = TOTAL_PAGES - currentPage + 1;
    if (targetDays > 0) {
      setPagesPerDay(Math.ceil(remainingPages / targetDays));
    } else {
      setPagesPerDay(0);
    }
  }, [currentPage, targetDays]);

  const handleSave = () => {
    localStorage.setItem('khatm_plan', JSON.stringify({ currentPage, targetDays }));
    setSavedPlan(true);
  };

  const handleReset = () => {
    if (window.confirm('Voulez-vous réinitialiser votre plan actuel ?')) {
      localStorage.removeItem('khatm_plan');
      setCurrentPage(1);
      setTargetDays(30);
      setSavedPlan(false);
    }
  };

  const progressPercentage = Math.round((currentPage / TOTAL_PAGES) * 100);

  return (
    <div className="pt-8 px-4 max-w-3xl mx-auto pb-24">
      <PageHeader 
        icon={<BookOpen size={32} />} 
        title="Planificateur de Khatm" 
        subtitle="Organisez votre lecture du Coran pour le terminer dans les temps." 
      />

      <div className="mt-8 bg-theme-surface border border-theme-border rounded-3xl p-6 sm:p-8 shadow-xl">
        {!savedPlan ? (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-2xl font-bold text-theme-text mb-6">Créer un nouveau plan</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-theme-text-muted mb-2">Page actuelle (1 à 604)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="604" 
                  value={currentPage}
                  onChange={(e) => setCurrentPage(Math.min(604, Math.max(1, Number(e.target.value))))}
                  className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-theme-text focus:outline-none focus:border-theme-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-theme-text-muted mb-2">Objectif (en jours)</label>
                <div className="flex gap-2">
                  {[15, 30, 60, 90].map(days => (
                    <button
                      key={days}
                      onClick={() => setTargetDays(days)}
                      className={`flex-1 py-2 rounded-lg font-bold transition-all border ${
                        targetDays === days 
                          ? 'bg-theme-primary text-black border-theme-primary' 
                          : 'bg-theme-bg text-theme-text border-theme-border hover:border-theme-primary/50'
                      }`}
                    >
                      {days}j
                    </button>
                  ))}
                </div>
                <input 
                  type="number" 
                  min="1" 
                  value={targetDays}
                  onChange={(e) => setTargetDays(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 mt-3 text-theme-text focus:outline-none focus:border-theme-primary transition-colors"
                  placeholder="Ou saisissez un nombre libre"
                />
              </div>
            </div>

            <div className="mt-8 p-6 bg-theme-bg border border-theme-border rounded-2xl text-center">
              <h3 className="text-lg font-bold text-theme-text mb-2">Votre rythme idéal :</h3>
              <div className="text-4xl font-black text-theme-primary mb-2">
                {pagesPerDay} <span className="text-xl text-theme-text-muted">pages / jour</span>
              </div>
              <p className="text-sm text-theme-text-muted font-medium">
                Soit environ <strong className="text-theme-text">{Math.ceil(pagesPerDay / 5)} pages</strong> après chaque prière obligatoire.
              </p>
            </div>

            <button 
              onClick={handleSave}
              className="w-full mt-4 flex justify-center items-center gap-2 bg-theme-primary text-black font-bold py-4 rounded-xl hover:scale-[1.01] transition-transform shadow-lg"
            >
              <Target size={20} /> Démarrer ce plan
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-in zoom-in duration-300">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold text-theme-text">Votre Suivi</h2>
              <button 
                onClick={handleReset}
                className="text-theme-text-muted hover:text-red-400 transition-colors p-2"
                title="Recommencer"
              >
                <RotateCcw size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-theme-bg border border-theme-border rounded-2xl flex flex-col items-center justify-center text-center">
                <Calendar className="text-theme-primary mb-2" size={24} />
                <span className="text-2xl font-black text-theme-text">{targetDays}</span>
                <span className="text-xs font-bold text-theme-text-muted uppercase">Jours restants</span>
              </div>
              <div className="p-4 bg-theme-bg border border-theme-border rounded-2xl flex flex-col items-center justify-center text-center">
                <BookOpen className="text-theme-primary mb-2" size={24} />
                <span className="text-2xl font-black text-theme-text">{pagesPerDay}</span>
                <span className="text-xs font-bold text-theme-text-muted uppercase">Pages par jour</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold text-theme-text-muted mb-2">
                <span>Page {currentPage} / 604</span>
                <span className="text-theme-primary">{progressPercentage}%</span>
              </div>
              <div className="w-full h-4 bg-theme-bg border border-theme-border rounded-full overflow-hidden">
                <div 
                  className="h-full bg-theme-primary transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <div className="p-5 bg-theme-primary/10 border border-theme-primary/20 rounded-2xl">
              <h3 className="font-bold text-theme-text mb-4">Mettre à jour ma progression</h3>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  min="1" 
                  max="604" 
                  value={currentPage}
                  onChange={(e) => {
                    const val = Math.min(604, Math.max(1, Number(e.target.value)));
                    setCurrentPage(val);
                  }}
                  className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-theme-text focus:outline-none focus:border-theme-primary"
                />
                <button 
                  onClick={handleSave}
                  className="px-6 py-3 bg-theme-primary text-black font-bold rounded-xl hover:scale-105 transition-transform shrink-0"
                >
                  Valider
                </button>
              </div>
              <p className="text-xs text-theme-text-muted mt-3 font-medium">
                Conseil : Lisez {Math.ceil(pagesPerDay / 5)} pages après chaque prière pour maintenir le rythme.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
