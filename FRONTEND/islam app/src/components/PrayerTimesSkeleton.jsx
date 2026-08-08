import React from 'react';

export default function PrayerTimesSkeleton() {
    return (
        <div className="bg-theme-surface p-6 sm:p-8 rounded-[2rem] border border-theme-border shadow-2xl relative overflow-hidden h-full">
            {/* Header Skeleton */}
            <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#222] animate-pulse"></div>
                    <div>
                        <div className="h-6 w-32 bg-[#222] rounded-md animate-pulse mb-2"></div>
                        <div className="h-4 w-48 bg-[#222] rounded-md animate-pulse"></div>
                    </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#222] animate-pulse"></div>
            </div>

            {/* Next Prayer Countdown Skeleton */}
            <div className="bg-theme-bg rounded-[1.5rem] p-6 mb-8 border border-theme-border">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-4 w-32 bg-[#222] rounded-md animate-pulse mb-2"></div>
                    <div className="h-10 w-48 bg-[#222] rounded-md animate-pulse"></div>
                </div>
            </div>

            {/* List of Prayers Skeleton */}
            <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-theme-bg border border-theme-border animate-pulse">
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-[#222]"></div>
                            <div className="h-5 w-20 bg-[#222] rounded"></div>
                        </div>
                        <div className="h-5 w-12 bg-[#222] rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
