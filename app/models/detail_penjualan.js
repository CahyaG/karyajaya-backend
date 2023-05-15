module.exports = (sequelize, DataTypes) => {
  const DetailPenjualan = sequelize.define("detail_penjualan", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: {
      type: DataTypes.BIGINT
    },
    penjualan_id: {
      type: DataTypes.BIGINT
    },
  }, {
    paranoid: true,
    tableName: 'detail_penjualan',
    createdAt : 'created_at',
    updatedAt : 'updated_at',
    deletedAt : 'deleted_at',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'productId']
      },
    },

  });

  DetailPenjualan.associate = function (models) {
    this.belongsTo(models.product, { foreignKey: 'product_id' });
    this.belongsTo(models.penjualan, { foreignKey: 'penjualan_id' });
  };

  return DetailPenjualan;
};