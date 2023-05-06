module.exports = (sequelize, DataTypes) => {
  const ProductImage = sequelize.define("product_image", {
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

  ProductImage.associate = function(models) {
    this.belongsTo(models.product,{foreignKey: 'product_id'});
  };

  return ProductImage;
};