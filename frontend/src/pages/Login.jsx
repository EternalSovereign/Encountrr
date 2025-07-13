import { useState } from "react";
import api from "../publicApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/authSlice";

export default function Login() {
    const dispatch = useDispatch();
    const [form, setForm] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", form);
            dispatch(
                setAuth({
                    token: res.data.accessToken,
                    user: res.data.user,
                })
            );
            toast.success("Login successful!");
            navigate("/");
        } catch {
            toast.error("Invalid credentials or server error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow max-w-sm w-full"
            >
                <h2 className="text-xl font-bold mb-4">Login</h2>
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    onChange={handleChange}
                    className="w-full mb-3 p-2 border rounded"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    onChange={handleChange}
                    className="w-full mb-3 p-2 border rounded"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
