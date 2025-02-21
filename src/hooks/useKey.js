import { useEffect } from 'react';

/**
 * Custom hook to handle keydown events for a specific key.
 * @param {string} key - The key to listen for.
 * @param {Function} action - The action to perform when the key is pressed.
 */
export function useKey(key, action) {
    /**
     * Callback function to handle the keydown event.
     * @param {KeyboardEvent} e - The keyboard event.
     */
    useEffect(function () {
        function callback(e) {
            if (e.code.toLowerCase() === key.toLowerCase()) action();
        };

        document.addEventListener('keydown', callback);

        return function () {
            document.removeEventListener('keydown', callback);
        };
    }, [action, key]);

}