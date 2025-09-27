const API_BASE_URL=import.meta.env.VITE_API_BASE_URL;
const API_AUTH_TOKEN=import.meta.env.VITE_API_AUTH_TOKEN;

// Reusable fetch function
const apiFetch = async (endpoint) => {
    if (!API_AUTH_TOKEN) {
        console.error('Missing auth token.');
        throw new Error ('Missing Auth Token');
    }

    const separator = endpoint.includes('?') ? '&' : '?';

    const fetchUrl = `${API_BASE_URL}${endpoint}${separator}authToken=${API_AUTH_TOKEN}`;
    const response = await fetch(fetchUrl);

    if (!response.ok) {
        throw new Error (`API call failed. ${response.statusText}`);
    }

    return response.json();
};

export const getAirports = () => {
    return apiFetch('/airports');
};

export const getBookings = (pageIndex = 0, pageSize) => {
    if (!pageSize) {
        return apiFetch(`/bookings/?pageIndex=${pageIndex}`);
    } else {
        // return apiFetch(`/bookings/?pageIndex=${pageIndex}&pageSize=${pageSize }`);
    }
}   

