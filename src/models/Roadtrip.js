module.exports = (sequelize, DataTypes) => {
    const Roadtrip = sequelize.define(
        "Roadtrip",
        {
            title: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            duration: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            image: {
                type: DataTypes.STRING,
                allowNull: true
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
                onUpdate: DataTypes.NOW
            }
        },
        {
            tableName: "Roadtrip",
            timestamps: false,
        }
    );

    Roadtrip.associate = (models) => {
        Roadtrip.belongsTo(models.User, { foreignKey: 'user_id' });
    };

    return Roadtrip;
};
