import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Target, CheckCircle2, RotateCcw, ChevronRight, Moon, Flame } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const JUZ_START_PAGES = [
  1, 22, 42, 62, 82, 102, 122, 142, 162, 182, 
  202, 222, 242, 262, 282, 302, 322, 342, 362, 382, 
  402, 422, 442, 462, 482, 502, 522, 542, 562, 582
];

export default function Khatm() {
  const TOTAL_PAGES = 604;
  
  // States
  const [currentPage, setCurrentPage] = useState(1);
  const [targetDays, setTargetDays] = useState(30);
  const [savedPlan, setSavedPlan] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [history, setHistory] = useState({}); // { 'YYYY-MM-DD': pagesRead }
  const [juzSelect, setJuzSelect] = useState(1);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('khatm_plan_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCurrentPage(parsed.currentPage || 1);
        setTargetDays(parsed.targetDays || 30);
        setStartDate(parsed.startDate);
        setEndDate(parsed.endDate);
        setHistory(parsed.history || {});
        setSavedPlan(true);
      } else {
        // Migrate old data if exists
        const oldSaved = localStorage.getItem('khatm_plan');
        if (oldSaved) {
          const parsed = JSON.parse(oldSaved);
          setCurrentPage(parsed.currentPage || 1);
          setTargetDays(parsed.targetDays || 30);
          handleSaveNewPlan(parsed.currentPage || 1, parsed.targetDays || 30);
          localStorage.removeItem('khatm_plan');
        }
      }
    } catch (e) {
      console.error("Erreur lors du chargement du plan Khatm", e);
      localStorage.removeItem('khatm_plan_v2');
      localStorage.removeItem('khatm_plan');
    }
  }, []);

  const getTodayStr = () => new Date().toISOString().split('T')[0];

  const handleSaveNewPlan = (startPage = currentPage, days = targetDays) => {
    const finalStart = Number(startPage) || 1;
    const finalDays = Number(days) || 30;
    
    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + finalDays);
    
    const plan = {
      currentPage: finalStart,
      targetDays: finalDays,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      history: {}
    };
    
    localStorage.setItem('khatm_plan_v2', JSON.stringify(plan));
    setStartDate(plan.startDate);
    setEndDate(plan.endDate);
    setHistory(plan.history);
    setSavedPlan(true);
  };

  const handleUpdateProgress = () => {
    const today = getTodayStr();
    
    // Save to local storage
    try {
      const saved = localStorage.getItem('khatm_plan_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        const pagesReadToday = currentPage > parsed.currentPage ? currentPage - parsed.currentPage : 0;
        
        const newHistory = { ...parsed.history };
        if (pagesReadToday > 0) {
          newHistory[today] = (newHistory[today] || 0) + pagesReadToday;
        }

        const updatedPlan = {
          ...parsed,
          currentPage: currentPage,
          history: newHistory
        };
        
        localStorage.setItem('khatm_plan_v2', JSON.stringify(updatedPlan));
        setHistory(newHistory);
      }
    } catch (e) {
      console.error("Erreur mise à jour plan", e);
    }
  };

  const handleReset = () => {
    if (window.confirm('Voulez-vous réinitialiser votre plan actuel ?')) {
      localStorage.removeItem('khatm_plan_v2');
      setCurrentPage(1);
      setTargetDays(30);
      setSavedPlan(false);
      setHistory({});
    }
  };

  // Calculations
  const validCurrentPage = Number(currentPage) || 1;
  const remainingPages = TOTAL_PAGES - validCurrentPage + 1;
  let remainingDays = Number(targetDays) || 30;
  
  if (endDate) {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (remainingDays < 1) remainingDays = 1; // avoid division by zero
  }

  const pagesPerDay = Math.ceil(remainingPages / remainingDays);
  const progressPercentage = Math.round((currentPage / TOTAL_PAGES) * 100);

  // Generate last 7 days array for streak
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-theme-text">Nouveau plan</h2>
              <button 
                onClick={() => {
                  setTargetDays(30);
                  setCurrentPage(1);
                  setJuzSelect(1);
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-lg text-sm font-bold hover:bg-indigo-500/20 transition-colors"
              >
                <Moon size={16} /> Mode Ramadan
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Juz Selection */}
              <div>
                <label className="block text-sm font-bold text-theme-text-muted mb-2">Où en êtes-vous ? (Sélection par Juz)</label>
                <div className="flex gap-2">
                  <select 
                    value={juzSelect}
                    onChange={(e) => {
                      const juz = Number(e.target.value);
                      setJuzSelect(juz);
                      setCurrentPage(JUZ_START_PAGES[juz - 1]);
                    }}
                    className="flex-1 bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-theme-text focus:outline-none focus:border-theme-primary transition-colors"
                  >
                    {JUZ_START_PAGES.map((page, idx) => (
                      <option key={idx} value={idx + 1}>Juz {idx + 1}</option>
                    ))}
                  </select>
                  <input 
                    type="number" 
                    min="1" 
                    max="604" 
                    value={currentPage}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCurrentPage(val === '' ? '' : Math.min(604, Number(val)));
                    }}
                    className="w-24 bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-theme-text focus:outline-none focus:border-theme-primary transition-colors text-center"
                    title="Page exacte"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-theme-text-muted mb-2">Objectif de fin (en jours)</label>
                <div className="flex gap-2 mb-3">
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
                  onChange={(e) => {
                    const val = e.target.value;
                    setTargetDays(val === '' ? '' : Number(val));
                  }}
                  className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-theme-text focus:outline-none focus:border-theme-primary transition-colors"
                  placeholder="Ou saisissez un nombre libre"
                />
              </div>
            </div>

            <div className="mt-8 p-6 bg-theme-bg border border-theme-border rounded-2xl text-center">
              <h3 className="text-lg font-bold text-theme-text mb-2">Votre rythme idéal :</h3>
              <div className="text-4xl font-black text-theme-primary mb-2">
                {Math.ceil((TOTAL_PAGES - (Number(currentPage) || 1) + 1) / (Number(targetDays) || 30))} <span className="text-xl text-theme-text-muted">pages / jour</span>
              </div>
              <p className="text-sm text-theme-text-muted font-medium">
                Soit environ <strong className="text-theme-text">{Math.ceil(Math.ceil((TOTAL_PAGES - (Number(currentPage) || 1) + 1) / (Number(targetDays) || 30)) / 5)} pages</strong> après chaque prière obligatoire.
              </p>
            </div>

            <button 
              onClick={() => handleSaveNewPlan(currentPage, targetDays)}
              className="w-full flex justify-center items-center gap-2 bg-theme-primary text-black font-bold py-4 rounded-xl hover:scale-[1.01] transition-transform shadow-lg"
            >
              <Target size={20} /> Démarrer ce plan
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-in zoom-in duration-300">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-theme-text flex items-center gap-2">
                  Votre Suivi <Flame className="text-orange-500" />
                </h2>
                <p className="text-sm text-theme-text-muted mt-1">
                  Fin prévue le <strong className="text-theme-text">{formatDate(endDate)}</strong>
                </p>
              </div>
              <button 
                onClick={handleReset}
                className="text-theme-text-muted hover:text-red-400 transition-colors p-2"
                title="Recommencer"
              >
                <RotateCcw size={20} />
              </button>
            </div>

            {/* Streak Calendar */}
            <div className="bg-theme-bg border border-theme-border rounded-2xl p-4">
              <h3 className="text-xs font-bold text-theme-text-muted uppercase mb-3 flex items-center justify-between">
                Série (7 derniers jours)
              </h3>
              <div className="flex justify-between items-center gap-1">
                {last7Days.map((dayStr, idx) => {
                  const pagesRead = history[dayStr] || 0;
                  const isToday = dayStr === getTodayStr();
                  const dateObj = new Date(dayStr);
                  const dayName = dateObj.toLocaleDateString('fr-FR', { weekday: 'short' });
                  
                  let bg = "bg-[#222] border-[#333]"; // Not read
                  let text = "text-gray-500";
                  if (pagesRead > 0) {
                    if (pagesRead >= pagesPerDay) {
                      bg = "bg-emerald-500/20 border-emerald-500"; // Reached goal
                      text = "text-emerald-400";
                    } else {
                      bg = "bg-yellow-500/20 border-yellow-500"; // Partial
                      text = "text-yellow-400";
                    }
                  }

                  return (
                    <div key={dayStr} className="flex flex-col items-center gap-1">
                      <div 
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg border flex items-center justify-center font-bold text-xs sm:text-sm ${bg} ${text} ${isToday ? 'ring-2 ring-theme-primary ring-offset-2 ring-offset-theme-surface' : ''}`}
                        title={`${pagesRead} pages lues`}
                      >
                        {pagesRead > 0 ? '✓' : ''}
                      </div>
                      <span className="text-[10px] text-theme-text-muted capitalize">{dayName.charAt(0)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-theme-bg border border-theme-border rounded-2xl flex flex-col items-center justify-center text-center">
                <Calendar className="text-theme-primary mb-2" size={24} />
                <span className="text-2xl font-black text-theme-text">{remainingDays}</span>
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
              <h3 className="font-bold text-theme-text mb-4">Actualiser ma lecture</h3>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  min={currentPage} 
                  max="604" 
                  value={currentPage}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCurrentPage(val === '' ? '' : Math.min(604, Number(val)));
                  }}
                  className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-theme-text focus:outline-none focus:border-theme-primary"
                />
                <button 
                  onClick={handleUpdateProgress}
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
