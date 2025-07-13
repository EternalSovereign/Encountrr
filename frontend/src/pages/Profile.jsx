import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../api";
import { updateUser } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProfileForm() {
    const { user } = useSelector((state) => state.auth);
    const [form, setForm] = useState({
        name: "",
        age: "",
        interests: "",
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Prefill values if user already has them
    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || "",
                age: user.age || "",
                interests: Array.isArray(user.interests)
                    ? user.interests.join(", ")
                    : "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name || !form.age || !form.interests) {
            return toast.error("Please fill out all fields.");
        }

        try {
            const payload = {
                name: form.name.trim(),
                age: parseInt(form.age),
                interests: form.interests
                    .split(",")
                    .map((i) => i.trim())
                    .filter(Boolean),
            };

            const res = await api.post("/users", payload);

            dispatch(updateUser(res.data));
            toast.success("Profile updated!");
            navigate("/");
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Failed to save profile"
            );
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded shadow">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
                {user?.name ? "Edit Your Profile" : "Complete Your Profile"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="mt-1 w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Age
                    </label>
                    <input
                        type="number"
                        name="age"
                        value={form.age}
                        onChange={handleChange}
                        className="mt-1 w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Interests
                    </label>
                    <input
                        type="text"
                        name="interests"
                        value={form.interests}
                        onChange={handleChange}
                        placeholder="e.g. music, tech, sports"
                        className="mt-1 w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    {user?.name ? "Update Profile" : "Save Profile"}
                </button>
            </form>
        </div>
    );
}
