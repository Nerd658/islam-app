import { useState, useEffect } from 'react';

export default function useLocalStorage(key, defaultValue, options = {}) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = localStorage.getItem(key);
            if (item !== null) {
                const parsed = JSON.parse(item);
                if (options.ttl && parsed && parsed.timestamp) {
                    if (new Date().getTime() - parsed.timestamp > options.ttl) {
                        localStorage.removeItem(key);
                        return defaultValue;
                    }
                    return parsed.value;
                }
                return parsed;
            }
        } catch (error) {
            console.error(error);
        }
        return defaultValue;
    });

    useEffect(() => {
        try {
            if (options.ttl) {
                const item = localStorage.getItem(key);
                let timestamp = new Date().getTime();
                if (item) {
                    try {
                        const parsed = JSON.parse(item);
                        if (parsed && parsed.timestamp) {
                            timestamp = parsed.timestamp;
                        }
                    } catch (e) {}
                }
                localStorage.setItem(key, JSON.stringify({
                    value: storedValue,
                    timestamp
                }));
            } else {
                localStorage.setItem(key, JSON.stringify(storedValue));
            }
        } catch (error) {
            console.error(error);
        }
    }, [key, storedValue, options.ttl]);

    return [storedValue, setStoredValue];
}
