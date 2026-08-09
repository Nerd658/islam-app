import React from 'react';

export default function MajorSinsSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-theme-surface border border-theme-border rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-theme-text-muted/20"></div>
                            <div className="w-32 h-6 bg-theme-text-muted/20 rounded"></div>
                        </div>
                        <div className="w-24 h-8 bg-theme-text-muted/20 rounded"></div>
                    </div>
                    <div className="space-y-2 mb-4">
                        <div className="w-full h-4 bg-theme-text-muted/20 rounded"></div>
                        <div className="w-5/6 h-4 bg-theme-text-muted/20 rounded"></div>
                    </div>
                    <div className="w-20 h-5 bg-theme-text-muted/20 rounded"></div>
                </div>
            ))}
        </div>
    );
}
