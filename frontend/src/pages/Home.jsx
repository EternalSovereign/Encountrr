import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import MatchCard from "../components/MatchCard";
import api from "../api";
import toast from "react-hot-toast";

export default function Home() {
    const { user } = useSelector((state) => state.auth);
    const [shortlisted, setShortlisted] = useState([]);

    const enrichShortlistedMatch = (match) => ({
        ...match,
        mutual: false,
        commonInterests: match.commonInterests || match.interests || [],
        similarity: match.similarity || "N/A",
        shortlistedByMe: true,
        incomingInterest: false,
    });

    useEffect(() => {
        const fetchShortlisted = async () => {
            try {
                const res = await api.get("/matches/shortlisted");
                const enriched = res.data.map(enrichShortlistedMatch);
                setShortlisted(enriched);
            } catch {
                toast.error("Failed to load shortlisted matches.");
            }
        };

        if (user) fetchShortlisted();
    }, [user]);

    return (
        <div className="max-w-4xl mx-auto mt-10 px-4 space-y-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
                <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                    Welcome{user?.name ? `, ${user.name}` : ""} 👋
                </h1>

                <div className="text-gray-700 dark:text-gray-300 space-y-1">
                    <p>
                        <strong>Username:</strong> {user?.name}
                    </p>
                    <p>
                        <strong>Age:</strong> {user?.age}
                    </p>
                    <p>
                        <strong>Interests:</strong>{" "}
                        {user?.interests?.join(", ") || "None listed"}
                    </p>
                </div>

                <div className="mt-6 space-x-4">
                    <Link
                        to="/matches"
                        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition"
                    >
                        View Matches
                    </Link>
                    <Link
                        to="/profile"
                        className="inline-block bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 px-4 py-2 rounded transition"
                    >
                        Edit Profile
                    </Link>
                </div>
            </div>

            {shortlisted.length > 0 && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-4">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                        Shortlisted Matches
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {shortlisted.slice(0, 3).map((match) => (
                            <MatchCard
                                key={match.id}
                                match={match}
                                isShortlisted={true}
                                onShortlist={() => {}}
                            />
                        ))}
                    </div>

                    {shortlisted.length > 3 && (
                        <div className="mt-4 text-right">
                            <Link
                                to="/matches"
                                className="text-blue-600 hover:underline text-sm"
                            >
                                View all matches →
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
