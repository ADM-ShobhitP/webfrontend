import axios from 'axios';

const service = axios.create({
    baseURL: process.env.NODE_ENV=='development'?"http://10.1.15.162:8000":"https://5216-1-7-16-2.ngrok-free.app",
});

export default service;