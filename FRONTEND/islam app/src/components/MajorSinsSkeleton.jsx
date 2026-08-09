import React from 'react';

export default function MajorSinsSkeleton() {
    return (
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none gap-6 pb-8 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="snap-center shrink-0 w-[85%] sm:w-auto bg-theme-surface border border-theme-border rounded-2xl p-6 shadow-sm flex flex-col animate-pulse">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-theme-text-muted/20"></div>
                            <div className="w-24 h-6 bg-theme-text-muted/20 rounded"></div>
                        </div>
                        <div className="w-16 h-8 bg-theme-text-muted/20 rounded"></div>
                    </div>
                    <div className="space-y-3 mb-6 flex-1">
                        <div className="w-full h-4 bg-theme-text-muted/20 rounded"></div>
                        <div className="w-full h-4 bg-theme-text-muted/20 rounded"></div>
                        <div className="w-5/6 h-4 bg-theme-text-muted/20 rounded"></div>
                    </div>
                    <div className="w-20 h-5 bg-theme-text-muted/20 rounded mt-auto"></div>
                </div>
            ))}
        </div>
    );
}
