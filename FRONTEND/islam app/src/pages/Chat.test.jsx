import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import ChatInterface from './Chat';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('axios');

describe('ChatInterface component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock scrollIntoView
        window.HTMLElement.prototype.scrollIntoView = vi.fn();
    });

    it('renders the initial greeting message', () => {
        render(<ChatInterface />);
        expect(screen.getByText(/As-salamu alaykum/)).toBeInTheDocument();
        expect(screen.getByText(/Je suis votre assistant virtuel/)).toBeInTheDocument();
    });

    it('input field accepts text', () => {
        render(<ChatInterface />);
        const input = screen.getByPlaceholderText('Votre question...');
        
        fireEvent.change(input, { target: { value: 'Quelles sont les conditions de la prière ?' } });
        expect(input.value).toBe('Quelles sont les conditions de la prière ?');
    });

    it('submit button is disabled when input is empty', () => {
        render(<ChatInterface />);
        const submitBtn = screen.getByRole('button');
        
        // Initially empty
        expect(submitBtn).toBeDisabled();
        
        // Type something
        const input = screen.getByPlaceholderText('Votre question...');
        fireEvent.change(input, { target: { value: 'Bonjour' } });
        
        expect(submitBtn).not.toBeDisabled();
        
        // Clear input
        fireEvent.change(input, { target: { value: '   ' } });
        expect(submitBtn).toBeDisabled();
    });

    it('after form submit, user message appears in the chat and mock response is handled', async () => {
        axios.post.mockResolvedValueOnce({ data: { reply: 'Les conditions sont nombreuses...' } });
        
        render(<ChatInterface />);
        const input = screen.getByPlaceholderText('Votre question...');
        const submitBtn = screen.getByRole('button');
        
        fireEvent.change(input, { target: { value: 'Quelles sont les conditions ?' } });
        fireEvent.click(submitBtn);

        // User message should appear immediately
        expect(screen.getByText('Quelles sont les conditions ?')).toBeInTheDocument();
        
        // Loading state should appear
        expect(screen.getByText("L'imam réfléchit...")).toBeInTheDocument();

        // Wait for bot response
        await waitFor(() => {
            expect(screen.getByText('Les conditions sont nombreuses...')).toBeInTheDocument();
        });

        // Loading should be gone
        expect(screen.queryByText("L'imam réfléchit...")).not.toBeInTheDocument();
        
        // Verify axios was called with the correct history slice (omitting first msg)
        expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining('/api/chat'),
            { history: [{ role: 'user', content: 'Quelles sont les conditions ?' }] }
        );
    });
});
