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
        <div className={`bg-[#0a0a0a] p-6 sm:p-8 rounded-2xl border transition-all duration-300 ${
            isDone ? 'border-emerald-700/60' : 'border-[#333] hover:border-gray-500'
        }`}>
            {/* Arabic text */}
            <p
                className="text-2xl sm:text-3xl text-right font-arabic leading-[2.4] sm:leading-[2.6] tracking-wide mb-6 text-white"
                dir="rtl"
            >
                {arabic}
            </p>

            {/* Translation */}
            <p className="text-sm sm:text-base text-gray-400 mb-4 leading-relaxed">
                {translation}
            </p>

            {source && (
                <p className="text-xs text-gray-600 mb-5 font-mono">
                    Source : {source}
                </p>
            )}

            {/* Progress bar */}
            <div className="w-full bg-[#1a1a1a] rounded-full h-1.5 mb-5 overflow-hidden border border-[#222]">
                <div
                    className={`h-full rounded-full transition-all duration-300 ${isDone ? 'bg-emerald-500' : 'bg-white'}`}
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
                            ? 'bg-emerald-950/30 border-emerald-700/40 text-emerald-400 cursor-default'
                            : 'bg-[#111] border-[#333] text-white hover:bg-[#1a1a1a] active:scale-95'
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
                        className="p-3 rounded-xl bg-[#111] border border-[#222] text-gray-600 hover:text-gray-300 hover:border-[#444] transition-all"
                        title="Recommencer"
                    >
                        <RotateCcw size={14} />
                    </button>
                )}
            </div>
        </div>
    );
}
