import { supabase } from "./supabase";

const API_BASE_URL = "https://petrol-khata.onrender.com";

async function apiFetch(endpoint, options = {}) {
    const {
        data: { session }
    } = await supabase.auth.getSession();

    const headers = {
        ...(options.headers || {})
    };

    if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
    }

    return fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
    });
}

export {
    API_BASE_URL,
    apiFetch
};

export default API_BASE_URL;