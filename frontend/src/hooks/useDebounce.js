// src/hooks/useDebounce.js

import { useState, useEffect } from "react";

/**
 * WHAT IS THIS HOOK?
 *
 * Debounce = Delay execution
 *
 * Why?
 * User types: rel (3 letters = 3 events)
 * Without debounce: 3 API calls immediately (wasteful!)
 * With debounce: Wait 500ms, then 1 API call (efficient!)
 *
 * HOOK = Reusable logic you can use in any component
 *
 * Usage:
 * const debouncedValue = useDebounce(value, 500)
 *
 * Now debouncedValue updates after 500ms of inactivity
 */

function useDebounce(value, delay = 500) {
    // State to store debounced value
    const [debouncedValue, setDebouncedValue] = useState(value);

    // Effect runs every time value changes
    useEffect(() => {
        // Set a timer
        const handler = setTimeout(() => {
            // After delay, update debounced value
            setDebouncedValue(value);
        }, delay);

        // Cleanup: clear timer if value changes before delay completes
        return () => clearTimeout(handler);
    }, [value, delay]);

    // Return the debounced value
    return debouncedValue;
}

/**
 * EXAMPLE:
 *
 * User types: R E L
 *
 * R typed
 *   → Start 500ms timer
 *   → debouncedValue still "" (old value)
 *
 * E typed (within 500ms)
 *   → Cancel previous timer
 *   → Start new 500ms timer
 *   → debouncedValue still "" (old value)
 *
 * L typed (within 500ms)
 *   → Cancel previous timer
 *   → Start new 500ms timer
 *   → debouncedValue still "" (old value)
 *
 * User stops typing
 * 500ms passes
 *   → Timer completes
 *   → debouncedValue = "REL" (new value)
 *   → SearchBar notices debouncedValue changed
 *   → useEffect runs
 *   → API call happens (just 1 call!)
 */

export default useDebounce;