module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("product", {
    product_code: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.TEXT
    },
    price: {
      type: DataTypes.INTEGER
    },
    stock: {
      type: DataTypes.INTEGER
    },
    cover: {
      type: DataTypes.STRING
    },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  }, {
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
    },

  });

  Product.associate = function (models) {
    this.belongsTo(models.category, { foreignKey: 'category_id' });
    this.belongsTo(models.brand, { foreignKey: 'brand_id' });
    this.hasMany(models.product_image, { foreignKey: 'product_id' });
    this.hasMany(models.peminjaman, { foreignKey: 'product_id' });
  };

  return Product;
};