import React from "react";
import axios from "axios";

export const fetchPrayerTimes = async (city, country) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/prayer-times`, {
            params: {
                city,
                country
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}