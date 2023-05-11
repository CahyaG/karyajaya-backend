module.exports = (sequelize, DataTypes) => {
  const ProductImage = sequelize.define("product_image", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    product_id: {
      type: DataTypes.BIGINT
    },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
    deletedAt: { type: DataTypes.DATE, field: 'deleted_at' },
  }, {
    paranoid: true,
    defaultScope: {
      attributes: { 
        exclude: ['createdAt','updatedAt', 'deletedAt'] 
      },
    },

  });

  ProductImage.associate = function(models) {
    this.belongsTo(models.product,{foreignKey: 'product_id'});
  };

  return ProductImage;
};