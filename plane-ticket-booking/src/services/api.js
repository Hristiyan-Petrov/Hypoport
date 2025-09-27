const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_AUTH_TOKEN = import.meta.env.VITE_API_AUTH_TOKEN;

// Reusable fetch function
const apiRequest = async (endpoint, options = {}) => {
    if (!API_AUTH_TOKEN) {
        console.error('Missing auth token.');
        throw new Error('Missing Auth Token');
    }

    const separator = endpoint.includes('?') ? '&' : '?';
    const finalUrl = `${API_BASE_URL}${endpoint}${separator}authToken=${API_AUTH_TOKEN}`;

    const finalOptions = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
    }

    try {
        const response = await fetch(finalUrl, finalOptions);
        if (!response.ok) {
            const errorMessage = response.message || 'API call failed.'
            throw new Error(errorMessage);
        }

        if (response.url.includes('delete')) {
            return { success: true };
        }
        return response.json();
    } catch (error) {
        console.error(`API Request Error: ${error.message}`);
        throw error; // Re-throw the error so the component can catch it and update the UI
    }
};


export const getAirports = () => {
    return apiRequest('/airports');
};

export const getBookings = (pageIndex = 0, pageSize = 5) => {
    return apiRequest(`/bookings/?pageIndex=${pageIndex}&pageSize=${pageSize}`);
};

export const createBooking = (bookingData) => {
    return apiRequest('/bookings/create', {
        method: 'POST',
        body: JSON.stringify(bookingData),
    });
};

export const deleteBooking = (bookingId) => {
    return apiRequest(`/bookings/delete/${bookingId}`, {
        method: 'DELETE',
    });
}