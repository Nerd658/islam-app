import React from "react";
import axios from "axios";

export async function fetchPrayerTimes(city, country) {
    try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
        const response = await axios.get(
            `${apiUrl}/prayer-times?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}