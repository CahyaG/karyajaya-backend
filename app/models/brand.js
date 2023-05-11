module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define("brand", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    brand_code: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
    deletedAt: { type: DataTypes.DATE, field: 'deleted_at' },
  }, {
    paranoid: true,
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt']
      },
    },

  });

  Brand.associate = function (models) {
    this.hasMany(models.product, { foreignKey: 'brand_id' });
  };

  return Brand;
};