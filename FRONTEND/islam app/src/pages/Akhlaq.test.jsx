import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Akhlaq from './Akhlaq';

// Mock du Header pour simplifier
vi.mock('../components/PageHeader', () => ({
    default: ({ title }) => <div data-testid="page-header">{title}</div>
}));

describe('Akhlaq Component', () => {
    it('should render the loading skeleton initially', () => {
        const { container } = render(<Akhlaq />);
        expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('should render the list of Akhlaq after loading', async () => {
        render(<Akhlaq />);
        
        await waitFor(() => {
            expect(screen.queryByTestId('page-header')).toBeInTheDocument();
            // "La Véracité" est l'un des comportements dans le JSON
            expect(screen.getByText(/La Véracité/i)).toBeInTheDocument();
        }, { timeout: 1000 });
    });
});
