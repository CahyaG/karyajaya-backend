module.exports = (sequelize, DataTypes) => {
  const DetailPeminjaman = sequelize.define("detail_peminjaman", {
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  }, {
    paranoid: true,
    tableName: 'detail_peminjaman',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
    },

  });

  DetailPeminjaman.associate = function (models) {
    this.belongsTo(models.product, { foreignKey: 'product_id' });
    // this.belongsTo(models.peminjaman, { foreignKey: 'peminjaman_id' });
  };

  return DetailPeminjaman;
};