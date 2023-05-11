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
  }, {
    paranoid: true,
    createdAt : 'created_at',
    updatedAt : 'updated_at',
    deletedAt : 'deleted_at',
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