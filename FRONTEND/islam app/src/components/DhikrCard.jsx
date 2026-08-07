import React, { useState, useCallback } from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';

/**
 * Interactive dhikr card with a tap counter.
 * The user taps the "Réciter" button to count repetitions up to the
 * required number. Completion state is reset on page reload (session-only).
 *
 * @param {{ arabic: string, translation: string, count: number }} props
 */
export default function DhikrCard({ arabic, translation, count, source }) {
    const [current, setCurrent] = useState(0);
    const target = parseInt(count, 10) || 1;
    const isDone = current >= target;
    const progressPercent = Math.min(Math.round((current / target) * 100), 100);

    const handleTap = useCallback(() => {
        if (isDone) return;
        setCurrent(prev => prev + 1);
        if (navigator.vibrate) navigator.vibrate(30);
    }, [isDone]);

    const handleReset = useCallback(() => {
        setCurrent(0);
    }, []);

    return (
        <div className={`bg-theme-surface p-6 sm:p-8 rounded-3xl border transition-all duration-500 relative overflow-hidden ${
            isDone ? 'border-theme-primary/40 shadow-[0_0_30px_rgba(16,185,129,0.15)] bg-theme-primary/5' : 'border-theme-border hover:border-theme-primary/30 shadow-lg hover:shadow-theme-primary/10'
        }`}>
            {isDone && (
                <div className="absolute inset-0 bg-gradient-to-br from-theme-primary/10 to-transparent pointer-events-none" />
            )}
            {/* Arabic text */}
            <p
                className="text-2xl sm:text-3xl text-right font-arabic leading-[2.4] sm:leading-[2.6] tracking-wide mb-6 text-theme-text"
                dir="rtl"
            >
                {arabic}
            </p>

            {/* Translation */}
            <p className="text-sm sm:text-base text-theme-text-muted mb-4 leading-relaxed">
                {translation}
            </p>

            {source && (
                <p className="text-xs text-theme-text-muted/60 mb-5 font-mono">
                    Source : {source}
                </p>
            )}

            {/* Progress bar */}
            <div className="w-full bg-theme-bg rounded-full h-2 mb-6 overflow-hidden border border-theme-border relative z-10">
                <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${isDone ? 'bg-gradient-to-r from-emerald-400 to-theme-primary' : 'bg-theme-primary/60'}`}
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-4 relative z-10">
                <button
                    onClick={handleTap}
                    disabled={isDone}
                    className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm transition-all border flex items-center justify-center gap-2 ${
                        isDone
                            ? 'bg-theme-primary/20 border-theme-primary text-theme-primary cursor-default shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                            : 'bg-theme-surface-hover border-theme-border text-theme-text hover:bg-theme-primary hover:text-white hover:border-theme-primary active:scale-95 shadow-sm'
                    }`}
                >
                    {isDone
                        ? <><CheckCircle2 size={18} /> Accompli</>
                        : <><span className="font-mono bg-black/20 px-2 py-0.5 rounded-md mr-2">{current} / {target}</span> Réciter</>
                    }
                </button>

                {current > 0 && (
                    <button
                        onClick={handleReset}
                        className="p-3.5 rounded-2xl bg-theme-surface-hover border border-theme-border text-theme-text-muted hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all active:scale-95"
                        title="Recommencer"
                    >
                        <RotateCcw size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}
