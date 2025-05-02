import axios from 'axios';

const service = axios.create({
    baseURL: process.env.NODE_ENV == 'development' ? "http://10.1.15.88:8000" : "https://7521-1-7-16-2.ngrok-free.app",
    // baseURL: process.env.NODE_ENV == 'development' ? "http://10.1.15.88:8000" : "http://10.1.15.88:8000",
    headers: {
        "ngrok-skip-browser-warning": 234
    }
});

export default service;