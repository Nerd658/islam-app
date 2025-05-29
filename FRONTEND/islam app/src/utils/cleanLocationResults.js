import React from 'react'

export default function cleanLocationResults(data) {
    return data
        .filter(item => item.address)
    
        .map(item => {
            const {city, town, village, state, country, province} =  item.address;
            return {
                display : `${city || town || village || province || ''} , ${state || ''} ,  ${country}`,	 
                importance: item.importance, 
                city : city || town || village || province || '',
                state: state || '',
                country: country,
                country_code: item.address.country_code.toUpperCase(),
            };
        })
        .sort((a, z) => z.importance - a.importance).slice(0, 5);
}
