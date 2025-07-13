const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Match = sequelize.define(
    "Match",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user1Id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user2Id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        mutual: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        shortlistedBy: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        indexes: [
            {
                unique: true,
                fields: ["user1Id", "user2Id"],
            },
        ],
    }
);

module.exports = Match;
