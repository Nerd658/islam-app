import React from 'react';
import { render, screen, act } from '@testing-library/react';
import PrayerTimesList from './PrayerTimesList';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('PrayerTimesList component', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        // Mock current time to be 10:00:00
        const date = new Date(2025, 0, 1, 10, 0, 0);
        vi.setSystemTime(date);
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it('returns null when prayerTimes is null', () => {
        const { container } = render(<PrayerTimesList prayerTimes={null} />);
        expect(container.firstChild).toBeNull();
    });

    it('shows hijri date badge when hijriDate is present', () => {
        const mockTimes = {
            hijriDate: '15 Ramadan 1446',
            fajr: '05:00',
            dhuhr: '13:00'
        };

        render(<PrayerTimesList prayerTimes={mockTimes} />);
        expect(screen.getByText(/15 Ramadan 1446/)).toBeInTheDocument();
    });

    it('renders prayer time entries from a mocked prayerTimes prop', () => {
        const mockTimes = {
            fajr: '05:00',
            dhuhr: '13:00',
            asr: '16:00',
            maghrib: '19:00',
            isha: '20:30'
        };

        render(<PrayerTimesList prayerTimes={mockTimes} />);
        
        expect(screen.getByText('05:00')).toBeInTheDocument();
        expect(screen.getByText('13:00')).toBeInTheDocument();
        expect(screen.getByText('16:00')).toBeInTheDocument();
        expect(screen.getByText('19:00')).toBeInTheDocument();
        expect(screen.getByText('20:30')).toBeInTheDocument();
    });

    it('shows the countdown/next prayer section after timer fires', () => {
        const mockTimes = {
            fajr: '05:00',
            dhuhr: '13:00',
            asr: '16:00',
            maghrib: '19:00',
            isha: '20:30'
        };

        render(<PrayerTimesList prayerTimes={mockTimes} />);

        act(() => {
            vi.advanceTimersByTime(1100);
        });

        // After the interval fires, the next prayer section should appear
        expect(screen.getByText(/Prochaine Prière/i)).toBeInTheDocument();
        // Dhuhr may appear in multiple places (card + prayer grid) — getAllByText handles this
        const dhuhrElements = screen.getAllByText(/Dhuhr/i);
        expect(dhuhrElements.length).toBeGreaterThan(0);
    });
});
