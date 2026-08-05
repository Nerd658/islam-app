import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, CheckCircle2, Circle, RotateCcw, Calendar, ChevronDown, ChevronUp, Info } from 'lucide-react';

/*
 * Wird — Daily Quran Reading Programme
 *
 * A structured daily reading plan that divides the 30 Juz of the Quran
 * across a 30-day cycle. Each day shows the assigned Juz with its
 * main surahs, a completion tracker, and cumulative statistics.
 *
 * State is persisted per-day in localStorage. Completing a day logs it
 * to the session history.
 */

const JUZ_DATA = [
    { juz: 1,  surahs: 'Al-Fatiha (1) — Al-Baqarah (1–141)',          pages: '1–21',   theme: 'Fondements de la foi et règles de la communauté' },
    { juz: 2,  surahs: 'Al-Baqarah (142–252)',                          pages: '22–41',  theme: 'Règles islamiques, histoire d\'Ibrahim' },
    { juz: 3,  surahs: 'Al-Baqarah (253) — Al-Imran (92)',             pages: '42–61',  theme: 'Droits de la famille, bataille d\'Ohoud' },
    { juz: 4,  surahs: 'Al-Imran (93–200)',                             pages: '62–81',  theme: 'Unité de la communauté, personnes du Livre' },
    { juz: 5,  surahs: 'An-Nisa (1–147)',                               pages: '82–101', theme: 'Droits des femmes, héritage, hypocrisie' },
    { juz: 6,  surahs: 'An-Nisa (148) — Al-Ma\'idah (82)',             pages: '102–121', theme: 'Législation, alliance, peuple du Livre' },
    { juz: 7,  surahs: 'Al-Ma\'idah (83–120)',                          pages: '122–141', theme: 'Nourriture, jihad, mission de Jésus' },
    { juz: 8,  surahs: 'Al-An\'am (1–110)',                             pages: '142–161', theme: 'Monothéisme, argument contre l\'idolâtrie' },
    { juz: 9,  surahs: 'Al-An\'am (111–165) — Al-A\'raf (87)',         pages: '162–181', theme: 'Éthique, histoires des prophètes' },
    { juz: 10, surahs: 'Al-A\'raf (88–206)',                            pages: '182–201', theme: 'Histoire de Moïse et des prophètes' },
    { juz: 11, surahs: 'Al-Anfal (1–40) — At-Tawba (93)',              pages: '202–221', theme: 'Bataille de Badr, la Grande Absolution' },
    { juz: 12, surahs: 'Hud (1–5)',                                     pages: '222–241', theme: 'Histoires des prophètes, punitions divines' },
    { juz: 13, surahs: 'Yusuf (1–52)',                                  pages: '242–261', theme: 'Histoire de Youssouf (Joseph)' },
    { juz: 14, surahs: 'Al-Hijr (1–99) — An-Nahl (128)',               pages: '262–281', theme: 'Bénédictions d\'Allah, Jugement dernier' },
    { juz: 15, surahs: 'Al-Isra (1–98) — Al-Kahf (74)',                pages: '282–301', theme: 'Voyage nocturne, compagnons de la Caverne' },
    { juz: 16, surahs: 'Al-Kahf (75–110) — Ta-Ha (135)',               pages: '302–321', theme: 'Dhul-Qarnayn, Moïse et Al-Khadir' },
    { juz: 17, surahs: 'Al-Anbiya (1–112)',                             pages: '322–341', theme: 'Les prophètes, le Jour du Jugement' },
    { juz: 18, surahs: 'Al-Mu\'minun (1–118)',                          pages: '342–361', theme: 'Qualités des croyants, humilité' },
    { juz: 19, surahs: 'Al-Furqan (21–77)',                             pages: '362–381', theme: 'La distinction, Création, Patience' },
    { juz: 20, surahs: 'An-Naml (56–93)',                               pages: '382–401', theme: 'Prophète Soulaymane, miracles' },
    { juz: 21, surahs: 'Al-Ankabut (46–69)',                            pages: '402–421', theme: 'Alliance avec Allah, patience dans l\'épreuve' },
    { juz: 22, surahs: 'Al-Ahzab (31–73)',                              pages: '422–441', theme: 'Conduite islamique, famille du Prophète' },
    { juz: 23, surahs: 'Ya-Sin (28–83)',                                pages: '442–461', theme: 'Résurrection, pouvoir d\'Allah' },
    { juz: 24, surahs: 'Az-Zumar (32–75)',                              pages: '462–481', theme: 'Sincérité, miséricorde d\'Allah' },
    { juz: 25, surahs: 'Fussilat (47–54)',                              pages: '482–501', theme: 'Décrets d\'Allah, foi et désespoir' },
    { juz: 26, surahs: 'Al-Ahqaf (1–35)',                               pages: '502–521', theme: 'Obéissance aux parents, signes d\'Allah' },
    { juz: 27, surahs: 'Adh-Dhariyat (31–60)',                         pages: '522–541', theme: 'Serments divins, récits des prophètes' },
    { juz: 28, surahs: 'Al-Mujadila (1–22)',                            pages: '542–561', theme: 'Famille, droits, hypocrisie' },
    { juz: 29, surahs: 'Al-Mulk (1–30)',                                pages: '562–581', theme: 'Grandeur d\'Allah, courtes sourates de foi' },
    { juz: 30, surahs: 'An-Naba\' (1–40)',                              pages: '582–604', theme: 'Jugement dernier, courtes sourates essentielles' }
];

const WIRD_TASKS = [
    { id: 'read',    label: 'Lire le Juz complet',          description: 'Lecture avec compréhension du sens' },
    { id: 'listen',  label: 'Écouter la récitation audio',  description: 'Renforcez votre mémorisation' },
    { id: 'reflect', label: 'Méditer sur un verset',        description: 'Choisissez un verset et réfléchissez à sa signification' },
    { id: 'revise',  label: 'Réviser le Juz précédent',     description: 'La mémorisation nécessite la répétition' }
];

function loadStorage(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

function formatDateFr(date) {
    return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

export default function Wird() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Day of month (1-based) used to select the Juz
    const dayOfMonth = today.getDate();
    const juzIndex = (dayOfMonth - 1) % 30;
    const currentJuz = JUZ_DATA[juzIndex];

    const [tasks, setTasks] = useState(() =>
        loadStorage(`wird_tasks_${todayStr}`, {})
    );
    const [history, setHistory] = useState(() =>
        loadStorage('wird_history', [])
    );
    const [expanded, setExpanded] = useState(true);

    const completedCount = WIRD_TASKS.filter(t => tasks[t.id]).length;
    const progressPercent = Math.round((completedCount / WIRD_TASKS.length) * 100);
    const isComplete = completedCount === WIRD_TASKS.length;

    // Persist tasks
    useEffect(() => {
        localStorage.setItem(`wird_tasks_${todayStr}`, JSON.stringify(tasks));
    }, [tasks, todayStr]);

    // Log completion to history when all tasks are done
    useEffect(() => {
        if (!isComplete) return;
        const alreadyLogged = history.some(entry => entry.date === todayStr);
        if (alreadyLogged) return;

        const newEntry = {
            date: todayStr,
            juz: currentJuz.juz,
            completedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        };
        const updated = [newEntry, ...history].slice(0, 60); // keep 2 months
        setHistory(updated);
        localStorage.setItem('wird_history', JSON.stringify(updated));
    }, [isComplete, history, todayStr, currentJuz.juz]);

    const toggleTask = useCallback((id) => {
        setTasks(prev => ({ ...prev, [id]: !prev[id] }));
    }, []);

    const resetDay = useCallback(() => {
        setTasks({});
        localStorage.removeItem(`wird_tasks_${todayStr}`);
    }, [todayStr]);

    const totalDaysCompleted = history.length;
    const totalJuzRead = history.reduce((acc, entry) => acc + 1, 0);

    return (
        <div className="pt-8 px-4 max-w-3xl mx-auto mb-24">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center p-3 bg-[#111] border border-[#333] rounded-2xl mb-4 text-white">
                    <BookOpen size={32} />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Wird Quotidien</h1>
                <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
                    Programme de lecture du Coran — un Juz par jour, le Coran complet en 30 jours.
                </p>
                <p className="text-gray-600 text-xs mt-2 font-mono capitalize">{formatDateFr(today)}</p>
            </div>

            {/* Today's Juz Card */}
            <div className="bg-[#0a0a0a] border border-[#333] rounded-3xl overflow-hidden mb-6 shadow-2xl">
                <div className="p-6 sm:p-8">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                                Aujourd'hui — Juz {currentJuz.juz} / 30
                            </span>
                            <h2 className="text-xl sm:text-2xl font-bold text-white">{currentJuz.surahs}</h2>
                        </div>
                        <span className="bg-[#111] border border-[#333] text-white font-mono font-bold px-4 py-2 rounded-xl text-sm flex-shrink-0 ml-4">
                            p. {currentJuz.pages}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 mb-6">
                        <Info size={13} className="text-gray-500 flex-shrink-0" />
                        <p className="text-gray-400 text-sm">{currentJuz.theme}</p>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-2">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500 font-medium">
                                {completedCount}/{WIRD_TASKS.length} tâches
                            </span>
                            <span className={`text-xs font-bold font-mono ${isComplete ? 'text-emerald-400' : 'text-gray-400'}`}>
                                {progressPercent}%
                            </span>
                        </div>
                        <div className="w-full bg-[#1a1a1a] rounded-full h-2 overflow-hidden border border-[#222]">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-emerald-500' : 'bg-white'}`}
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>

                    {isComplete && (
                        <div className="mt-4 text-center py-3 bg-emerald-950/30 border border-emerald-800/40 rounded-2xl">
                            <p className="text-emerald-400 font-semibold text-sm">
                                Barakallahu fikum — Wird du jour accompli
                            </p>
                        </div>
                    )}
                </div>

                {/* Task Checklist */}
                <div className="border-t border-[#222]">
                    <button
                        onClick={() => setExpanded(e => !e)}
                        className="w-full flex items-center justify-between px-6 py-4 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        <span className="font-semibold">Tâches du jour</span>
                        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {expanded && (
                        <div className="px-6 pb-6 space-y-3">
                            {WIRD_TASKS.map(task => {
                                const done = !!tasks[task.id];
                                return (
                                    <div
                                        key={task.id}
                                        onClick={() => toggleTask(task.id)}
                                        className={`flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${
                                            done
                                                ? 'bg-emerald-950/20 border-emerald-800/30 text-gray-400'
                                                : 'bg-[#111] border-[#262626] text-gray-200 hover:bg-[#161616]'
                                        }`}
                                    >
                                        <div className="flex-shrink-0 mt-0.5">
                                            {done
                                                ? <CheckCircle2 size={20} className="text-emerald-400" />
                                                : <Circle size={20} className="text-gray-600" />
                                            }
                                        </div>
                                        <div>
                                            <p className={`font-semibold text-sm ${done ? 'line-through text-gray-500' : ''}`}>
                                                {task.label}
                                            </p>
                                            <p className="text-xs text-gray-600 mt-0.5">{task.description}</p>
                                        </div>
                                    </div>
                                );
                            })}

                            <button
                                onClick={resetDay}
                                className="w-full flex items-center justify-center gap-2 mt-2 text-xs text-gray-600 hover:text-gray-400 transition-colors py-2"
                            >
                                <RotateCcw size={12} />
                                Réinitialiser le jour
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Full 30-day Juz Overview */}
            <div className="bg-[#0a0a0a] border border-[#333] rounded-3xl overflow-hidden mb-6">
                <div className="p-6">
                    <h3 className="font-bold text-white mb-4">Programme 30 Juz</h3>
                    <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
                        {JUZ_DATA.map((juz) => {
                            const isToday = juz.juz === currentJuz.juz;
                            const wasCompleted = history.some(e => e.juz === juz.juz);
                            return (
                                <div
                                    key={juz.juz}
                                    title={`Juz ${juz.juz} — ${juz.surahs}`}
                                    className={`aspect-square rounded-xl flex items-center justify-center text-xs font-mono font-bold border transition-all ${
                                        isToday
                                            ? 'bg-white text-black border-white'
                                            : wasCompleted
                                                ? 'bg-emerald-950/40 border-emerald-700 text-emerald-400'
                                                : 'bg-[#111] border-[#222] text-gray-600'
                                    }`}
                                >
                                    {juz.juz}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Statistics */}
            {history.length > 0 && (
                <div className="bg-[#0a0a0a] border border-[#333] rounded-3xl p-6">
                    <h3 className="font-bold text-white mb-4">Statistiques</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#111] border border-[#222] rounded-2xl p-4 text-center">
                            <p className="text-3xl font-mono font-bold text-white">{totalDaysCompleted}</p>
                            <p className="text-xs text-gray-500 mt-1">Jours accomplis</p>
                        </div>
                        <div className="bg-[#111] border border-[#222] rounded-2xl p-4 text-center">
                            <p className="text-3xl font-mono font-bold text-emerald-400">{totalJuzRead}</p>
                            <p className="text-xs text-gray-500 mt-1">Juz complétés</p>
                        </div>
                    </div>

                    {/* Recent history */}
                    <div className="mt-4 space-y-2">
                        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-3">Historique récent</p>
                        {history.slice(0, 7).map(entry => (
                            <div key={entry.date} className="flex items-center justify-between text-xs text-gray-500 border border-[#1a1a1a] bg-[#111] rounded-xl px-4 py-2.5">
                                <span className="font-mono">{entry.date}</span>
                                <span className="text-emerald-400 font-semibold">Juz {entry.juz}</span>
                                <span>{entry.completedAt}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
