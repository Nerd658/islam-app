import React from 'react';

export default function ActionSkeleton() {
    return (
        <div className="space-y-6 animate-pulse mt-8">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-theme-surface border border-theme-border rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-theme-text-muted/20"></div>
                            <div className="w-40 h-6 bg-theme-text-muted/20 rounded"></div>
                        </div>
                        <div className="w-32 h-6 bg-theme-text-muted/20 rounded"></div>
                    </div>
                    <div className="w-full h-4 bg-theme-text-muted/20 rounded"></div>
                    <div className="w-4/5 h-4 bg-theme-text-muted/20 rounded"></div>
                    
                    <div className="flex gap-4 mt-2">
                        <div className="w-24 h-6 bg-theme-text-muted/20 rounded-md"></div>
                        <div className="w-24 h-6 bg-theme-text-muted/20 rounded-md"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
