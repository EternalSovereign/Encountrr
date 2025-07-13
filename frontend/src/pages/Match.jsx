import { useCallback, useEffect, useState } from "react";
import api from "../api";
import MatchCard from "../components/MatchCard";
import { toast } from "react-hot-toast";

export default function Matches() {
    const [matches, setMatches] = useState([]);
    const [mutualMatches, setMutualMatches] = useState([]);
    const [shortlistedUsers, setShortlistedUsers] = useState([]);

    const enrichMatch = (match, type = "new") => ({
        ...match,
        mutual: type === "mutual",
        shortlistedByMe: type === "shortlisted",
        incomingInterest: false,
        commonInterests: match.commonInterests || match.interests || [],
        similarity: match.similarity || "N/A",
    });

    const enrichMutualMatch = (match) => ({
        ...match,
        mutual: true,
        commonInterests: match.commonInterests || match.interests || [],
        similarity: match.similarity || "N/A",
        shortlistedByMe: false,
        incomingInterest: false,
    });
    const enrichShortlistedMatch = (match) => ({
        ...match,
        mutual: false,
        commonInterests: match.commonInterests || match.interests || [],
        similarity: match.similarity || "N/A",
        shortlistedByMe: true,
        incomingInterest: false,
    });

    const fetchShortlistedUsers = useCallback(async () => {
        try {
            const res = await api.get("/matches/shortlisted");
            const enriched = res.data.map(enrichShortlistedMatch);
            setShortlistedUsers(enriched);
        } catch {
            toast.error("Failed to load shortlisted users");
        }
    }, []);

    const fetchMutualMatches = useCallback(async () => {
        try {
            const res = await api.get("/matches/mutual");
            const enriched = res.data.map(enrichMutualMatch);
            setMutualMatches(enriched);
        } catch {
            toast.error("Error fetching mutual matches");
        }
    }, []);

    const fetchMatches = useCallback(async () => {
        try {
            const res = await api.get("/matches", {
                params: {
                    excludeShortlisted: true,
                },
            });
            setMatches(res.data);
        } catch {
            toast.error("Error fetching matches");
        }
    }, []);

    useEffect(() => {
        fetchShortlistedUsers();
        fetchMatches();
        fetchMutualMatches();
    }, [fetchShortlistedUsers, fetchMatches, fetchMutualMatches]);

    const onShortlist = async (targetUserId) => {
        try {
            const res = await api.post("/shortlist", {
                targetUserId,
            });
            const mutual = res.data.mutual;

            toast.success(res.data.message || "Shortlisted!");

            const newlyShortlisted = matches.find((m) => m.id === targetUserId);
            if (newlyShortlisted) {
                const enriched = enrichMatch(
                    newlyShortlisted,
                    mutual ? "mutual" : "shortlisted"
                );

                if (mutual) {
                    setMutualMatches((prev) => [...prev, enriched]);
                } else {
                    setShortlistedUsers((prev) => [...prev, enriched]);
                }

                setMatches((prev) => prev.filter((m) => m.id !== targetUserId));
            }
            if (res.data.mutual) fetchMutualMatches();
            else fetchShortlistedUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to shortlist");
        }
    };

    const isShortlisted = (matchId) => {
        return shortlistedUsers.some((u) => u.id === matchId);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-6xl mx-auto">
                {/* ✅ Mutual Matches */}
                <h2 className="text-2xl font-bold mb-4 text-indigo-700">
                    Mutual Matches
                </h2>
                {mutualMatches.length === 0 ? (
                    <p className="text-gray-500 mb-6">No mutual matches yet.</p>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
                        {mutualMatches.map((match) => (
                            <MatchCard
                                key={match.id}
                                match={match}
                                isShortlisted={true}
                                onShortlist={() => {}}
                            />
                        ))}
                    </div>
                )}

                {/* ✅ Your Shortlists */}
                <h2 className="text-2xl font-bold mb-4 text-indigo-700">
                    Your Shortlists
                </h2>
                {shortlistedUsers.length === 0 ? (
                    <p className="text-gray-500 mb-6">
                        No shortlisted users yet.
                    </p>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
                        {shortlistedUsers.map((match) => (
                            <MatchCard
                                key={match.id}
                                match={match}
                                isShortlisted={true}
                                onShortlist={() => {}}
                            />
                        ))}
                    </div>
                )}

                {/* ✅ Discover New Matches */}
                <h2 className="text-2xl font-bold mb-4 text-indigo-700">
                    Discover New Matches
                </h2>
                {matches.length === 0 ? (
                    <p className="text-gray-500">No new matches available.</p>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {matches.map((m) => (
                            <MatchCard
                                key={m.id}
                                match={m}
                                onShortlist={onShortlist}
                                isShortlisted={isShortlisted(m.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
