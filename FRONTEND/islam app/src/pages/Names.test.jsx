import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Names from './Names';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('axios');

const mockNames = Array.from({ length: 25 }, (_, i) => ({
    number: i + 1,
    name: `NameArabic${i + 1}`,
    transliteration: `NameTrans${i + 1}`,
    en: { meaning: `Meaning${i + 1}` }
}));

describe('Names component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading state initially', () => {
        // Delay resolution indefinitely to test loading state
        axios.get.mockImplementation(() => new Promise(() => {}));
        render(<Names />);
        expect(screen.getByText('Chargement des Noms grandioses...')).toBeInTheDocument();
    });

    it('shows names grid after mock API resolves', async () => {
        axios.get.mockResolvedValueOnce({ data: { data: mockNames } });
        render(<Names />);

        await waitFor(() => {
            expect(screen.queryByText('Chargement des Noms grandioses...')).not.toBeInTheDocument();
        });

        // The first page should show 20 items (NameTrans1 to NameTrans20)
        expect(screen.getByText('NameTrans1')).toBeInTheDocument();
        expect(screen.getByText('NameTrans20')).toBeInTheDocument();
        // Item 21 shouldn't be there because of pagination
        expect(screen.queryByText('NameTrans21')).not.toBeInTheDocument();
    });

    it('search filtering works (typing in search box filters displayed names)', async () => {
        axios.get.mockResolvedValueOnce({ data: { data: mockNames } });
        render(<Names />);

        await waitFor(() => {
            expect(screen.getByText('NameTrans1')).toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText(/Rechercher/i);
        fireEvent.change(searchInput, { target: { value: 'NameTrans25' } });

        // Item 25 should appear, others should disappear
        expect(screen.getByText('NameTrans25')).toBeInTheDocument();
        expect(screen.queryByText('NameTrans1')).not.toBeInTheDocument();
    });

    it('pagination controls appear when there are >20 names', async () => {
        axios.get.mockResolvedValueOnce({ data: { data: mockNames } });
        render(<Names />);

        await waitFor(() => {
            expect(screen.getByText('NameTrans1')).toBeInTheDocument();
        });

        // Total 25 items, items per page = 20, so 2 pages.
        expect(screen.getByText('Page 1 sur 2')).toBeInTheDocument();

        // Click next page
        // Actually it's easier to grab it by its icon or DOM relation. Let's just grab the button that is not disabled when on page 1.
        const buttons = screen.getAllByRole('button');
        // buttons[0] is prev (disabled), buttons[1] is next (enabled)
        expect(buttons[0]).toBeDisabled();
        expect(buttons[1]).not.toBeDisabled();

        fireEvent.click(buttons[1]);

        // Now we should see item 21
        expect(screen.getByText('NameTrans21')).toBeInTheDocument();
    });
});
