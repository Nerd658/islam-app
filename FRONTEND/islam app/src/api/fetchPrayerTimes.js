import React from "react";
import axios from "axios";

export async function fetchPrayerTimes(city, country) {
    try {
        const response = await axios.get(
            `http://192.168.148.75:3001/prayer-times?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}