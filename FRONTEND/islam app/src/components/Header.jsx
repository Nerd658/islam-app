import React from 'react';
import { Moon } from 'lucide-react';

export default function Header() {
    return (
        <header className="md:hidden w-full flex items-center justify-between mt-4 px-4 max-w-5xl mx-auto">
            <div className="flex items-center gap-2 text-white">
                <Moon size={28} strokeWidth={1.5} />
                <h1 className="text-xl font-semibold tracking-tight">IslamApp</h1>
            </div>
            <div className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                {new Date().toLocaleDateString('fr-FR', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
        </header>
    );
}