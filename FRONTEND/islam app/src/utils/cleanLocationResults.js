import React from 'react'

export default function cleanLocationResults(data) {
    return data
        .filter(item => item.address)
    
        .map(item => {
            const {city, town, village, state, country, province} =  item.address;
            const locationName = city || town || village || province || '';
            const displayParts = [locationName, state, country].filter(Boolean);
            
            return {
                display: displayParts.join(', '),	 
                importance: item.importance, 
                city: locationName,
                state: state || '',
                country: country,
                country_code: item.address.country_code ? item.address.country_code.toUpperCase() : '',
            };
        })
        .sort((a, z) => z.importance - a.importance).slice(0, 5);
}
