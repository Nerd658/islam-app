import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GoodDeeds from './GoodDeeds';

// Mock du Header pour simplifier
vi.mock('../components/PageHeader', () => ({
    default: ({ title }) => <div data-testid="page-header">{title}</div>
}));

describe('GoodDeeds Component', () => {
    it('should render the loading skeleton initially', () => {
        const { container } = render(<GoodDeeds />);
        expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('should render the list of deeds after loading', async () => {
        render(<GoodDeeds />);
        
        // Attendre que le chargement (timeout 400ms) se termine
        await waitFor(() => {
            expect(screen.queryByTestId('page-header')).toBeInTheDocument();
            // Le mot "Sourire à son frère" devrait apparaître car c'est la première action
            expect(screen.getByText(/Sourire à son frère/i)).toBeInTheDocument();
        }, { timeout: 1000 });
    });
});
