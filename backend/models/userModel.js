const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    interests: DataTypes.ARRAY(DataTypes.STRING),
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
});

module.exports = User;
