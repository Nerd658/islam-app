import React from 'react';

export default function PageHeader({ icon, title, subtitle, action }) {
    return (
        <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-theme-primary/10 border border-theme-primary/20 rounded-2xl mb-4 text-theme-primary shadow-sm">
                {icon}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-theme-text mb-3 tracking-tight">{title}</h2>
            {subtitle && (
                <p className="text-theme-text-muted max-w-xl mx-auto text-sm sm:text-base">
                    {subtitle}
                </p>
            )}
            {action && (
                <div className="mt-4">
                    {action}
                </div>
            )}
        </div>
    );
}
