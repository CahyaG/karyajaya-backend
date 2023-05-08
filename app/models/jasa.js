module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define("jasa", {
    name: {
      type: DataTypes.STRING
    },
    jasa_code: {
      type: DataTypes.STRING
    },
    cover: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    description: {
      type: DataTypes.TEXT
    },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  }, {
    paranoid: true,
    tableName: 'jasa',
    defaultScope: {
      attributes: { 
        exclude: ['createdAt','updatedAt'] 
      },
    },

  });

  return Brand;
};