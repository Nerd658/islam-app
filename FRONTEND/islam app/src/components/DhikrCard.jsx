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
        <div className={`bg-theme-surface p-6 sm:p-8 rounded-2xl border transition-all duration-300 ${
            isDone ? 'border-theme-primary/60' : 'border-theme-border hover:border-theme-text-muted'
        }`}>
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
            <div className="w-full bg-theme-bg rounded-full h-1.5 mb-5 overflow-hidden border border-theme-border">
                <div
                    className={`h-full rounded-full transition-all duration-300 ${isDone ? 'bg-theme-primary' : 'bg-theme-text'}`}
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-3">
                <button
                    onClick={handleTap}
                    disabled={isDone}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all border flex items-center justify-center gap-2 ${
                        isDone
                            ? 'bg-theme-primary/10 border-theme-primary/40 text-theme-primary cursor-default'
                            : 'bg-theme-surface-hover border-theme-border text-theme-text hover:bg-theme-border active:scale-95'
                    }`}
                >
                    {isDone
                        ? <><CheckCircle2 size={16} /> Accompli</>
                        : <><span className="font-mono font-bold">{current}/{target}</span> — Réciter</>
                    }
                </button>

                {current > 0 && (
                    <button
                        onClick={handleReset}
                        className="p-3 rounded-xl bg-theme-surface-hover border border-theme-border text-theme-text-muted hover:text-theme-text hover:border-theme-text-muted transition-all"
                        title="Recommencer"
                    >
                        <RotateCcw size={14} />
                    </button>
                )}
            </div>
        </div>
    );
}
