import axios from "axios";
import { store } from "./store";
import { logout, setAuth } from "./store/authSlice";

const api = axios.create({
    baseURL: "http://localhost:5000/",
    withCredentials: true,
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth.accessToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;

        // Only try refresh token once per request
        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            try {
                const res = await axios.post(
                    "http://localhost:5000/auth/refresh",
                    {},
                    {
                        withCredentials: true,
                    }
                );

                store.dispatch(
                    setAuth({
                        token: res.data.accessToken,
                        user: res.data.user,
                    })
                );

                original.headers.Authorization = `Bearer ${res.data.accessToken}`;
                return api(original);
            } catch (err) {
                store.dispatch(logout());
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
