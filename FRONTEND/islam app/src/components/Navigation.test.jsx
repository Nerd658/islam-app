import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Navigation from './Navigation';
import { describe, it, expect } from 'vitest';

describe('Navigation component', () => {
    it('renders all nav items', () => {
        render(
            <MemoryRouter>
                <Navigation />
            </MemoryRouter>
        );

        expect(screen.getByText('Accueil')).toBeInTheDocument();
        expect(screen.getByText('Objectifs')).toBeInTheDocument();
        expect(screen.getByText('Coran')).toBeInTheDocument();
        expect(screen.getByText('Hadiths')).toBeInTheDocument();
        expect(screen.getByText('Arabe')).toBeInTheDocument();
        expect(screen.getByText('Adhkar')).toBeInTheDocument();
        expect(screen.getByText('Tasbih')).toBeInTheDocument();
        expect(screen.getByText('99 Noms')).toBeInTheDocument();
        expect(screen.getByText('Qibla')).toBeInTheDocument();
        expect(screen.getByText('Dates')).toBeInTheDocument();
        expect(screen.getByText('Imam')).toBeInTheDocument();
    });

    it('active link has correct active styling', () => {
        render(
            <MemoryRouter initialEntries={['/tasbih']}>
                <Navigation />
            </MemoryRouter>
        );

        const tasbihLink = screen.getByRole('link', { name: /Tasbih/i });
        expect(tasbihLink).toHaveClass('text-white');
    });

    it('Arabic submenu is hidden when not on an Arabic route', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Navigation />
            </MemoryRouter>
        );

        // Subitems shouldn't be in the document
        expect(screen.queryByText('Vocabulaire')).not.toBeInTheDocument();
        expect(screen.queryByText('Tajweed')).not.toBeInTheDocument();
    });

    it('Arabic submenu expands when Arabic nav item is clicked / on arabic route', () => {
        render(
            <MemoryRouter initialEntries={['/arabic/alphabet']}>
                <Navigation />
            </MemoryRouter>
        );

        // Subitems should be in the document
        expect(screen.getByText('Alphabet')).toBeInTheDocument();
        expect(screen.getByText('Vocabulaire')).toBeInTheDocument();
        expect(screen.getByText('Tajweed')).toBeInTheDocument();

        // Clicking toggles visibility
        const arabicLink = screen.getByRole('link', { name: /Arabe/i });
        fireEvent.click(arabicLink);
        
        // Wait for rerender, but actually click should hide it synchronously since it updates state.
        expect(screen.queryByText('Vocabulaire')).not.toBeInTheDocument();
    });
});
