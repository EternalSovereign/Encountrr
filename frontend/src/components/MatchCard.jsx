/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

export default function MatchCard({ match, onShortlist, isShortlisted }) {
    const {
        name,
        age,
        similarity,
        commonInterests = [],
        mutual,
        incomingInterest,
    } = match;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md transform transition duration-300 hover:scale-105 hover:shadow-2xl flex flex-col justify-between h-full p-2"
        >
            {/* Top section: Name + Similarity */}
            <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {name}
                    </h3>
                    {similarity !== undefined && similarity !== "N/A" && (
                        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-2 py-0.5 rounded-full">
                            {similarity}%
                        </span>
                    )}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Age: {age}
                </p>

                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    Interests:{" "}
                    {commonInterests.length > 0
                        ? commonInterests.join(", ")
                        : "N/A"}
                </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 text-xs mb-4">
                {mutual ? (
                    <span className="bg-pink-100 text-pink-700 dark:bg-pink-700 dark:text-white px-2 py-0.5 rounded-full">
                        ❤️ Mutual Match
                    </span>
                ) : incomingInterest ? (
                    <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-white px-2 py-0.5 rounded-full">
                        👀 Interested in You
                    </span>
                ) : isShortlisted ? (
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-white px-2 py-0.5 rounded-full">
                        📌 You Shortlisted
                    </span>
                ) : null}
            </div>

            {/* Shortlist Button */}
            {!mutual && (
                <button
                    disabled={isShortlisted}
                    onClick={() => onShortlist(match.id)}
                    className={`mt-auto px-4 py-2 text-sm font-medium rounded-xl transition w-full ${
                        isShortlisted
                            ? "bg-green-500 text-white cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
                >
                    {isShortlisted ? "✅ Shortlisted" : "Shortlist"}
                </button>
            )}
        </motion.div>
    );
}
