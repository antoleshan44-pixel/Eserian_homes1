import axios from 'axios';

// Use relative path since frontend and backend are served from same origin
const API = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    },
});

// Add token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// API methods for our features
export const propertyAPI = {
    // Get all approved properties (browse)
    getAllApproved: () => API.get('/properties/approved'),

    // Owner creates property
    create: (propertyData) => API.post('/properties', propertyData),

    // Owner views their properties
    getMyProperties: () => API.get('/properties/my-properties'),

    // Search by location
    search: (location) => API.get(`/properties/search?location=${location}`),

    // Admin approves property
    approve: (propertyId) => API.put(`/properties/${propertyId}/approve`)
};

export const bookingAPI = {
    // Create booking
    create: (bookingData) => API.post('/bookings', bookingData),

    // Get user's bookings
    getMyBookings: () => API.get('/bookings/my-bookings'),

    // Cancel booking
    cancel: (bookingId) => API.delete(`/bookings/${bookingId}`)
};

export default API;