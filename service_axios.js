import axios from 'axios';

const service = axios.create({
    baseURL: "http://10.1.15.162:8000",
});

export default service;