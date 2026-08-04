import React from 'react';
import { render, screen } from '@testing-library/react';
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

    it('renders count label with correct number', () => {
        render(<DhikrCard arabic="SubhanAllah" translation="Gloire à Allah" count={33} />);
        expect(screen.getByText('Répéter : 33 fois')).toBeInTheDocument();
    });
});
