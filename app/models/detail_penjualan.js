module.exports = (sequelize, DataTypes) => {
  const DetailPenjualan = sequelize.define("detail_penjualan", {
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  }, {
    paranoid: true,
    tableName: 'detail_penjualan',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
    },

  });

  DetailPenjualan.associate = function (models) {
    this.belongsTo(models.product, { foreignKey: 'product_id' });
    // this.belongsTo(models.penjualan, { foreignKey: 'penjualan_id' });
  };

  return DetailPenjualan;
};