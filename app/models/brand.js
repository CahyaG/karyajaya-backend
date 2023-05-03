module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define("brand", {
    brand_code: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.STRING
    },
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }, {
    defaultScope: {
      attributes: { 
        exclude: ['created_at','updated_at'] 
      },
    },

  });

  Brand.associate = function(models) {
    this.hasMany(models.product, {foreignKey: 'brand_id'});
  };

  return Brand;
};