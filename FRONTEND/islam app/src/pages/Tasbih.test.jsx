import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Tasbih from './Tasbih';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Tasbih component', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('renders initial counter at 0000', () => {
        render(<Tasbih />);
        expect(screen.getByText('0000')).toBeInTheDocument();
    });

    it('clicking TAP increments counter', () => {
        render(<Tasbih />);
        const tapBtn = screen.getByText('TAP');
        fireEvent.click(tapBtn);
        expect(screen.getByText('0001')).toBeInTheDocument();

        fireEvent.click(tapBtn);
        expect(screen.getByText('0002')).toBeInTheDocument();
    });

    it('reset button resets counter to 0000', () => {
        render(<Tasbih />);
        const tapBtn = screen.getByText('TAP');
        fireEvent.click(tapBtn);
        fireEvent.click(tapBtn);
        expect(screen.getByText('0002')).toBeInTheDocument();

        const resetBtn = screen.getByTitle('Réinitialiser le compteur actuel');
        fireEvent.click(resetBtn);
        expect(screen.getByText('0000')).toBeInTheDocument();
    });

    it('phrase selector changes the displayed Arabic phrase', () => {
        render(<Tasbih />);
        // Initial phrase is Subhanallah
        expect(screen.getByText('سُبْحَانَ ٱللَّٰهِ')).toBeInTheDocument();

        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'Alhamdulillah' } });

        // Displayed Arabic phrase changes
        expect(screen.getByText('ٱلْحَمْدُ لِلَّٰهِ')).toBeInTheDocument();
    });
});
