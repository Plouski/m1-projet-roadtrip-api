module.exports = (sequelize, DataTypes) => {
    const RoadtripStep = sequelize.define(
        "RoadtripStep",
        {
            roadtrip_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Roadtrip',
                    key: 'id',
                    onDelete: 'CASCADE'
                }
            },
            title: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            location: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
        },
        {
            tableName: "RoadtripStep",
            timestamps: false,
        }
    );

    RoadtripStep.associate = (models) => {
        RoadtripStep.belongsTo(models.Roadtrip, { foreignKey: 'roadtrip_id' });
    };

    return RoadtripStep;
};