module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define("brand", {
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
  }, {
    defaultScope: {
      attributes: { 
        exclude: ['createdAt','updatedAt'] 
      },
    },

  });

  Brand.associate = function(models) {
    this.hasMany(models.product, {foreignKey: 'brand_id'});
  };

  return Brand;
};