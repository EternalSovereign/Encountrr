const express = require("express");
const {
    createUser,
    getMatches,
    shortlistUser,
    getShortlistedUsers,
    me,
    getMutualMatches,
} = require("../controllers/userController");
const auth = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/matches/shortlisted", auth, getShortlistedUsers);
router.post("/users", auth, createUser);
router.get("/matches", auth, getMatches);
router.get("/matches/mutual", auth, getMutualMatches);
router.post("/shortlist", auth, shortlistUser);
router.get("/me", auth, me);

module.exports = router;
