const User = require("../models/userModel");
const Match = require("../models/matchModel");
const { Op } = require("sequelize");

exports.createUser = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, age, interests } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        user.name = name ?? user.name;
        user.age = age ?? user.age;
        user.interests =
            interests.map((i) => i.toLowerCase().trim()) ?? user.interests;

        await user.save();

        const userData = { ...user.dataValues };
        delete userData.password;

        res.status(200).json(userData);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getMatches = async (req, res) => {
    try {
        const userId = req.userId;
        const { excludeShortlisted } = req.query;

        const currentUser = await User.findByPk(userId);
        if (!currentUser)
            return res.status(404).json({ message: "User not found" });

        // Fetch all users except the current one
        const users = await User.findAll({
            where: {
                id: {
                    [Op.ne]: userId,
                },
            },
        });

        // Fetch all match records involving the current user
        const matches = await Match.findAll({
            where: {
                [Op.or]: [{ user1Id: userId }, { user2Id: userId }],
            },
        });

        // Create a map of match keys → match records
        const matchMap = {};
        for (const m of matches) {
            const key = [m.user1Id, m.user2Id].sort((a, b) => a - b).join("-");
            matchMap[key] = m;
        }

        const result = users
            .map((user) => {
                const commonInterests = user.interests.filter((i) =>
                    currentUser.interests.includes(i)
                );

                if (commonInterests.length < 2) return null;

                const sortedKey = [userId, user.id]
                    .sort((a, b) => a - b)
                    .join("-");
                const match = matchMap[sortedKey];

                // ✅ Exclude users if mutual match already exists
                if (match?.mutual) return null;

                // ✅ Optional: exclude if I already shortlisted them
                if (
                    excludeShortlisted === "true" &&
                    match &&
                    match.shortlistedBy === userId &&
                    !match.mutual
                ) {
                    return null;
                }

                return {
                    id: user.id,
                    name: user.name,
                    age: user.age,
                    interests: user.interests,
                    commonInterests,
                    similarity: Math.floor(
                        (commonInterests.length /
                            currentUser.interests.length) *
                            100
                    ),
                    mutual: false,
                    incomingInterest:
                        match && match.shortlistedBy !== userId && !match.mutual
                            ? true
                            : false,
                    shortlistedByMe:
                        match && match.shortlistedBy === userId && !match.mutual
                            ? true
                            : false,
                };
            })
            .filter(Boolean);

        // Sort: incomingInterest first, then similarity
        result.sort((a, b) => {
            if (a.incomingInterest !== b.incomingInterest) {
                return b.incomingInterest - a.incomingInterest;
            }
            return b.similarity - a.similarity;
        });

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch matches" });
    }
};

exports.shortlistUser = async (req, res) => {
    try {
        const userId = req.userId; // current user
        const { targetUserId } = req.body;

        if (userId === targetUserId) {
            return res
                .status(400)
                .json({ message: "Cannot shortlist yourself" });
        }

        // Sort to avoid duplicate match in reverse order
        const [user1Id, user2Id] = [userId, targetUserId].sort((a, b) => a - b);

        let match = await Match.findOne({ where: { user1Id, user2Id } });

        if (!match) {
            match = await Match.create({
                user1Id,
                user2Id,
                mutual: false,
                shortlistedBy: userId,
            });
            return res.json({
                message: "User shortlisted",
                mutual: false,
                ok: true,
            });
        }

        if (!match.mutual && match.shortlistedBy != userId) {
            match.mutual = true;
            await match.save();
            return res.json({
                message: "It's a mutual match!",
                mutual: true,
                ok: true,
            });
        }

        res.json({ message: "Already shortlisted", mutual: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to shortlist user" });
    }
};

exports.getShortlistedUsers = async (req, res) => {
    try {
        const userId = req.userId;

        // Fetch matches where the current user did the shortlisting
        const matches = await Match.findAll({
            where: {
                shortlistedBy: userId,
                mutual: false, // Optional: skip mutuals if you want only pending ones
            },
        });

        const shortlistedUserIds = matches.map((match) =>
            match.user1Id === userId ? match.user2Id : match.user1Id
        );

        const users = await User.findAll({
            where: { id: shortlistedUserIds },
            attributes: { exclude: ["password"] },
        });

        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to retrieve shortlisted users" });
    }
};

exports.getMutualMatches = async (req, res) => {
    try {
        const userId = req.userId;

        const matches = await Match.findAll({
            where: {
                mutual: true,
                [Op.or]: [{ user1Id: userId }, { user2Id: userId }],
            },
        });

        const matchedUserIds = matches.map((match) =>
            match.user1Id === userId ? match.user2Id : match.user1Id
        );

        const users = await User.findAll({
            where: { id: matchedUserIds },
            attributes: { exclude: ["password"] },
        });

        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to get mutual matches" });
    }
};

exports.me = async (req, res) => {
    const userId = req.userId;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
};
