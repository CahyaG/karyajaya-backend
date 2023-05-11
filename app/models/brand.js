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
  }, {
    paranoid: true,
    createdAt : 'created_at',
    updatedAt : 'updated_at',
    deletedAt : 'deleted_at',
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