import { useState } from "react";
import api from "../publicApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { setAuth } from "../store/authSlice";
import { useDispatch } from "react-redux";

export default function Register() {
    const dispatch = useDispatch();
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(form);
        try {
            const res = await api.post("/auth/register", form);
            toast.success("Registration successful!");
            dispatch(setAuth({ token: res.data.token, user: res.data.user }));
            navigate("/profile");
        } catch {
            toast.error("Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 rounded">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow max-w-sm w-full"
            >
                <h2 className="text-xl font-bold mb-4">Register</h2>
                <div className="shadow-xl w-full mb-3 border-0 rounded">
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        onChange={handleChange}
                        className="w-full p-2 rounded "
                    />
                </div>
                <div className="shadow-xl w-full mb-3 border-0 rounded">
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                        className="w-full p-2 rounded"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                >
                    Register
                </button>
            </form>
        </div>
    );
}
