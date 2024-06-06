module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            id: {
                type: DataTypes.TEXT,
                primaryKey: true,
                autoIncrement: true,
            },
            firstname: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            lastname: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            email: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            password: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            admin: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            }
        },
        {
            tableName: "User",
            timestamps: false,
        }
    );

    return User;
};