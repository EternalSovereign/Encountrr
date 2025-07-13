const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/userModel");

module.exports = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user.id;
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        req.userId = userId;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};
