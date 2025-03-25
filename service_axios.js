import axios from 'axios';

const service = axios.create({
    baseURL: "http://192.168.39.238:8000",
});

export default service;