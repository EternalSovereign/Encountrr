// src/publicApi.js
import axios from "axios";

const publicApi = axios.create({
    baseURL: "http://localhost:5000/",
    withCredentials: true, // Needed for sending/receiving cookies like refreshToken
});

export default publicApi;
