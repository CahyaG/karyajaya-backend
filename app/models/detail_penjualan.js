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

  Brand.associate = function (models) {
    this.BelongsTo(models.product, { foreignKey: 'product_id' });
    this.BelongsTo(models.penjualan, { foreignKey: 'penjualan_id' });
  };

  return Brand;
};