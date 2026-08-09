import React from 'react';

export default function ActionSkeleton() {
    return (
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none gap-6 pb-8 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 mt-8 hide-scrollbar">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="snap-center shrink-0 w-[85%] sm:w-auto bg-theme-surface border border-theme-border rounded-2xl p-6 shadow-sm flex flex-col gap-4 animate-pulse">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-theme-text-muted/20"></div>
                            <div className="w-24 h-6 bg-theme-text-muted/20 rounded"></div>
                        </div>
                        <div className="w-16 h-6 bg-theme-text-muted/20 rounded"></div>
                    </div>
                    <div className="w-full h-4 bg-theme-text-muted/20 rounded mt-4"></div>
                    <div className="w-4/5 h-4 bg-theme-text-muted/20 rounded"></div>
                    <div className="w-3/5 h-4 bg-theme-text-muted/20 rounded"></div>
                    
                    <div className="flex gap-4 mt-auto pt-4 border-t border-theme-border/50">
                        <div className="w-20 h-6 bg-theme-text-muted/20 rounded-md"></div>
                        <div className="w-20 h-6 bg-theme-text-muted/20 rounded-md"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
