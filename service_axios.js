import axios from 'axios';

const service = axios.create({
    baseURL: process.env.NODE_ENV == 'development' ? "http://10.1.15.162:8000" : "https://7521-1-7-16-2.ngrok-free.app",
    headers: {
        "ngrok-skip-browser-warning": 234
    }
});

export default service;