import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Hadiths from './Hadiths';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock lucide-react to easily verify icons
vi.mock('lucide-react', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        Check: () => <span data-testid="icon-check" />,
        Share2: () => <span data-testid="icon-share2" />
    };
});

// Mock the JSON data
vi.mock('../data/hadiths.json', () => ({
    default: [
        {
            id: 1,
            title: "Mocked Hadith 1",
            arabic: "عربى",
            translation: "Translation 1",
            category: "Category A",
            narrator: "Narrator 1"
        },
        {
            id: 2,
            title: "Mocked Hadith 2",
            arabic: "عربى ٢",
            translation: "Translation 2",
            category: "Category B",
            narrator: "Narrator 2"
        }
    ]
}));

describe('Hadiths page', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
        
        // Mock clipboard
        Object.assign(navigator, {
            clipboard: {
                writeText: vi.fn().mockImplementation(() => Promise.resolve()),
            },
        });
    });

    it('renders hadith cards from mocked data', () => {
        render(<Hadiths />);
        
        expect(screen.getByText('Mocked Hadith 1')).toBeInTheDocument();
        expect(screen.getByText('Mocked Hadith 2')).toBeInTheDocument();
    });

    it('searching filters the hadith list', () => {
        render(<Hadiths />);
        
        const searchInput = screen.getByPlaceholderText(/Rechercher/i);
        fireEvent.change(searchInput, { target: { value: 'Translation 1' } });

        expect(screen.getByText('Mocked Hadith 1')).toBeInTheDocument();
        expect(screen.queryByText('Mocked Hadith 2')).not.toBeInTheDocument();
    });

    it('clicking the Favoris tab filters correctly', () => {
        render(<Hadiths />);
        
        // Initially, no favorites so clicking favoris shows empty
        const favTab = screen.getByText(/Favoris \(/);
        fireEvent.click(favTab);

        expect(screen.getByText(/Aucun hadith dans vos favoris/)).toBeInTheDocument();

        // Go back to Tout
        fireEvent.click(screen.getByText('Tout'));

        // Add Hadith 2 to favoris
        // Find buttons with title "Ajouter aux favoris"
        const addFavBtns = screen.getAllByTitle('Ajouter aux favoris');
        // The second one corresponds to Hadith 2
        fireEvent.click(addFavBtns[1]);

        // Now click Favoris tab again
        fireEvent.click(screen.getByText(/Favoris \(/));
        
        // Hadith 2 should be there, Hadith 1 should not
        expect(screen.getByText('Mocked Hadith 2')).toBeInTheDocument();
        expect(screen.queryByText('Mocked Hadith 1')).not.toBeInTheDocument();
    });

    it('copy button displays Check icon after click', async () => {
        render(<Hadiths />);
        
        const copyBtns = screen.getAllByTitle('Copier le Hadith');
        
        // Before click, should have share2 icon
        expect(screen.getAllByTestId('icon-share2')).toHaveLength(2);
        expect(screen.queryByTestId('icon-check')).not.toBeInTheDocument();

        // Click first copy button
        fireEvent.click(copyBtns[0]);

        // After click, it should show Check icon
        expect(navigator.clipboard.writeText).toHaveBeenCalled();
        expect(screen.getByTestId('icon-check')).toBeInTheDocument();
    });
});
