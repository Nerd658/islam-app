import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DhikrCard from './DhikrCard';
import { describe, it, expect } from 'vitest';

describe('DhikrCard component', () => {
    it('renders Arabic text', () => {
        render(<DhikrCard arabic="SubhanAllah" translation="Gloire à Allah" count={33} />);
        expect(screen.getByText('SubhanAllah')).toBeInTheDocument();
    });

    it('renders French translation', () => {
        render(<DhikrCard arabic="SubhanAllah" translation="Gloire à Allah" count={33} />);
        expect(screen.getByText('Gloire à Allah')).toBeInTheDocument();
    });

    it('shows counter progress starting at 0/target', () => {
        render(<DhikrCard arabic="SubhanAllah" translation="Gloire à Allah" count={33} />);
        expect(screen.getByText(/0\/33/)).toBeInTheDocument();
    });

    it('increments counter on each tap', () => {
        render(<DhikrCard arabic="SubhanAllah" translation="Gloire à Allah" count={33} />);
        const btn = screen.getByRole('button', { name: /Réciter/i });
        fireEvent.click(btn);
        expect(screen.getByText(/1\/33/)).toBeInTheDocument();
        fireEvent.click(btn);
        expect(screen.getByText(/2\/33/)).toBeInTheDocument();
    });

    it('shows Accompli state when count reaches target', () => {
        render(<DhikrCard arabic="SubhanAllah" translation="Gloire à Allah" count={1} />);
        const btn = screen.getByRole('button', { name: /Réciter/i });
        fireEvent.click(btn);
        expect(screen.getByText(/Accompli/i)).toBeInTheDocument();
    });
});
