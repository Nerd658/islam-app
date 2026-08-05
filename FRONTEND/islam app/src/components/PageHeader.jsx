import React from 'react';

export default function PageHeader({ icon, title, subtitle, action }) {
    return (
        <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-[#111] border border-[#333] rounded-2xl mb-4 text-white">
                {icon}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">{title}</h2>
            {subtitle && (
                <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
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
