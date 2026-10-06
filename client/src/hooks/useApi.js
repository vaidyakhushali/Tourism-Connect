import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ── Destinations ─────────────────────────────────────────────
export const getDestinations = () => api.get('/destinations');

// ── Trips ────────────────────────────────────────────────────
export const getTrips = () => api.get('/trips');
export const joinTrip = (id) => api.post(`/trips/${id}/join`);

// ── Posts / Feed ─────────────────────────────────────────────
export const getPosts = () => api.get('/posts');
export const likePost = (id, data) => api.post(`/posts/${id}/like`, data);
export const createPost = (data) => api.post('/posts', data);

// ── Travelers ────────────────────────────────────────────────
export const getTravelers = () => api.get('/travelers');
export const followTraveler = (id) => api.post(`/travelers/${id}/follow`);

// ── Wishlist ─────────────────────────────────────────────────
export const getWishlist = () => api.get('/wishlist');

// ── Notifications ────────────────────────────────────────────
export const getNotifications = () => api.get('/notifications');

// ── Admin ────────────────────────────────────────────────────
export const getAdminStats = () => api.get('/admin/stats');
export const getAdminUsers = () => api.get('/admin/users');
export const getAdminPosts = () => api.get('/admin/posts');

// ── Auth ─────────────────────────────────────────────────────
export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);

export default api;
