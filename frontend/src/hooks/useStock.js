// src/hooks/useStock.js

import { useState, useEffect } from "react";
import { getStockReport } from "../api/stockApi";

/**
 * CUSTOM HOOK: useStock
 *
 * Encapsulates all stock data fetching logic
 * Use it anywhere instead of repeating code
 *
 * Usage:
 * const { data, loading, error } = useStock('RELIANCE')
 */

function useStock(symbol) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!symbol) return;

        const fetchData = async() => {
            try {
                setLoading(true);
                setError(null);
                const result = await getStockReport(symbol);
                setData(result);
            } catch (err) {
                setError(err.message);
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [symbol]);

    return { data, loading, error };
}

export default useStock;