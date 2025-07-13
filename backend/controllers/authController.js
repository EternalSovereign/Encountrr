const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

let refreshTokens = [];

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({
            email: email.toLowerCase(),
            password: hashed,
        });
        const userData = { ...user.dataValues };
        delete userData.password;
        const payload = { user: userData };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "15m",
        });
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        refreshTokens.push(refreshToken);

        res.json({ accessToken, user: userData });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });
    const userData = { ...user.dataValues };
    delete userData.password;
    const payload = { user: userData };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    refreshTokens.push(refreshToken);

    res.json({ accessToken, user: userData });
};

exports.refresh = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token || !refreshTokens.includes(token)) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const newToken = jwt.sign(
            { user: decoded.user },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );
        res.json({ accessToken: newToken, user: decoded.user });
    } catch {
        res.status(403).json({ message: "Expired or invalid token" });
    }
};
