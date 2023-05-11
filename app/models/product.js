module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("product", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
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
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    tokopedia_url: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    category_id: {
      type: DataTypes.BIGINT
    },
    brand_id: {
      type: DataTypes.BIGINT
    }
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

  Product.associate = function (models) {
    this.belongsTo(models.category, { foreignKey: 'category_id' });
    this.belongsTo(models.brand, { foreignKey: 'brand_id' });
    this.hasMany(models.product_image, { foreignKey: 'product_id' });
    this.hasMany(models.detail_penjualan, {foreignKey: 'product_id'});
    // this.belongsToMany(models.penjualan, { through: models.detail_penjualan, foreignKey: 'product_id' });
    this.hasMany(models.detail_peminjaman, {foreignKey: 'product_id'});
    // this.belongsToMany(models.peminjaman, { through: models.detail_peminjaman, foreignKey: 'product_id' });
  };

  return Product;
};