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
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
    deletedAt: { type: DataTypes.DATE, field: 'deleted_at' },
  }, {
    paranoid: true,
    tableName: 'detail_penjualan',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt']
      },
    },

  });

  DetailPenjualan.associate = function (models) {
    this.belongsTo(models.product, { foreignKey: 'product_id' });
    this.belongsTo(models.penjualan, { foreignKey: 'penjualan_id' });
  };

  return DetailPenjualan;
};