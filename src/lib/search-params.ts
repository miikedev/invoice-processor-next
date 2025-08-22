import { parseAsFloat, createLoader, parseAsIsoDateTime, parseAsIsoDate } from 'nuqs/server'

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const dateSearchParams = {
    date: parseAsIsoDate.withDefault(new Date()), // ✅ works with 2025-03-02
};

export const loadSearchParams = createLoader(dateSearchParams)