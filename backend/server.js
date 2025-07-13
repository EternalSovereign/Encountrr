const app = require("./app");
const sequelize = require("./config/db");
const User = require("./models/userModel");
const Match = require("./models/matchModel");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
