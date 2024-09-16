import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080',
});

instance.interceptors.request.use(config => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        console.log('JWT Token:', token);
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

instance.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response && error.response.status === 401) {
        console.error('Unauthorized access. Please log in again.');
    }
    return Promise.reject(error);
});

export default instance;
