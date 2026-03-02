const API_URL = "http://localhost:5001/api";

// Get auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem("authToken");
};

// Set auth data
const setAuthData = (token, user) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("currentUser", JSON.stringify(user));
};

// Clear auth data
const clearAuthData = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
};

// Check if user is logged in
const isLoggedIn = () => {
    return !!getAuthToken();
};

// Get current user
const getCurrentUser = () => {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
};

// API helper with headers
const apiCall = async (endpoint, options = {}) => {
    const token = getAuthToken();
    
    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.msg || data.error || "Something went wrong");
    }

    return data;
};

// Auth API
export const authAPI = {
    signup: (data) => apiCall("/auth/signup", { method: "POST", body: JSON.stringify(data) }),
    login: (data) => apiCall("/auth/login", { method: "POST", body: JSON.stringify(data) })
};

// User API
export const userAPI = {
    getProfile: () => apiCall("/user/profile"),
    updateProfile: (data) => apiCall("/user/profile", { method: "PUT", body: JSON.stringify(data) }),
    getReports: () => apiCall("/user/reports"),
    getSosHistory: () => apiCall("/user/sos-history")
};

// Reports API
export const reportsAPI = {
    submit: (data) => apiCall("/reports", { method: "POST", body: JSON.stringify(data) }),
    getAll: (skip = 0, limit = 50) => apiCall(`/reports?skip=${skip}&limit=${limit}`),
    getNearby: (lat, lng, radius = 5) => apiCall(`/reports/nearby?lat=${lat}&lng=${lng}&radius=${radius}`)
};

// Safety Points API
export const safetyPointsAPI = {
    getAll: () => apiCall("/safety-points"),
    getByType: (type) => apiCall(`/safety-points/${type}`)
};

// Routes API
export const routesAPI = {
    calculateSafetyScore: (coordinates) => 
        apiCall("/routes/safety-score", { 
            method: "POST", 
            body: JSON.stringify({ coordinates }) 
        })
};

// SOS API
export const sosAPI = {
    sendSOS: (data) => apiCall("/sos", { method: "POST", body: JSON.stringify(data) })
};

export { getAuthToken, setAuthData, clearAuthData, isLoggedIn, getCurrentUser };
