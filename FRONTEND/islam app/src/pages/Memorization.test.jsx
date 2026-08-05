import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Memorization from './Memorization';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

vi.mock('axios');

describe('Memorization Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        axios.get.mockResolvedValue({ data: { chapters: [] } });
    });

    it('renders initial state with heading', () => {
        render(<Memorization />);
        expect(screen.getByText('Test de Mémorisation')).toBeInTheDocument();
    });

    it('loads chapters on mount', async () => {
        const chapters = [{ id: 1, name_simple: 'Al-Fatihah', name_arabic: 'الفاتحة' }];
        axios.get.mockResolvedValue({ data: { chapters } });
        
        render(<Memorization />);
        
        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });
        
        await waitFor(() => {
            expect(screen.getByText(/1\. Al-Fatihah/)).toBeInTheDocument();
        });
    });

    it('shows error if SpeechRecognition is not supported', () => {
        // By default in jsdom, window.SpeechRecognition is undefined
        render(<Memorization />);
        expect(screen.getByText(/navigateur ne supporte pas/i)).toBeInTheDocument();
    });
});
