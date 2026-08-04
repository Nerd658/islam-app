import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Goals from './Goals';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock lucide-react to easily check icons
vi.mock('lucide-react', () => ({
    Target: () => <span data-testid="icon-target" />,
    BookOpen: () => <span data-testid="icon-bookopen" />,
    Heart: () => <span data-testid="icon-heart" />,
    Activity: () => <span data-testid="icon-activity" />,
    Star: () => <span data-testid="icon-star" />,
    CheckCircle2: () => <span data-testid="icon-checkcircle2" />,
    Circle: () => <span data-testid="icon-circle" />,
    ArrowRight: () => <span data-testid="icon-arrowright" />,
    Sparkles: () => <span data-testid="icon-sparkles" />,
    Award: () => <span data-testid="icon-award" />
}));

describe('Goals page', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('renders all 4 goal categories', () => {
        render(
            <MemoryRouter>
                <Goals />
            </MemoryRouter>
        );

        expect(screen.getByText('Lecture & Récitation du Coran')).toBeInTheDocument();
        expect(screen.getByText('Invocations & Protections')).toBeInTheDocument();
        expect(screen.getByText('Dhikr & Tasbih')).toBeInTheDocument();
        expect(screen.getByText("Méditation des 99 Noms d'Allah")).toBeInTheDocument();
    });

    it('clicking a goal toggles its checked state and updates completed count', () => {
        render(
            <MemoryRouter>
                <Goals />
            </MemoryRouter>
        );

        const goalLabel = screen.getByText('Lire 1 Hizb complet');
        
        // Initial state
        expect(screen.getByText('0 sur 11 objectifs complétés')).toBeInTheDocument();
        // The check icon shouldn't be there for this item initially (though we might have others, let's look at icons)
        let checkIcons = screen.queryAllByTestId('icon-checkcircle2');
        expect(checkIcons).toHaveLength(0);

        // Click goal
        fireEvent.click(goalLabel);

        // State after click
        expect(screen.getByText('1 sur 11 objectifs complétés')).toBeInTheDocument();
        checkIcons = screen.queryAllByTestId('icon-checkcircle2');
        expect(checkIcons).toHaveLength(1);

        // Click again
        fireEvent.click(goalLabel);
        expect(screen.getByText('0 sur 11 objectifs complétés')).toBeInTheDocument();
        checkIcons = screen.queryAllByTestId('icon-checkcircle2');
        expect(checkIcons).toHaveLength(0);
    });

    it('progress bar width updates when goals are toggled', () => {
        const { container } = render(
            <MemoryRouter>
                <Goals />
            </MemoryRouter>
        );

        const progressBar = container.querySelector('.bg-white.h-full.transition-all');
        expect(progressBar.style.width).toBe('0%');

        const goal1 = screen.getByText('Lire 1 Hizb complet');
        fireEvent.click(goal1);

        // 1 out of 11 goals is roughly 9%
        const percent = Math.round((1 / 11) * 100);
        expect(progressBar.style.width).toBe(`${percent}%`);
        expect(screen.getByText(`${percent}%`)).toBeInTheDocument();
    });
});
