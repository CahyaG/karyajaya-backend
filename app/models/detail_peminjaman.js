module.exports = (sequelize, DataTypes) => {
  const DetailPeminjaman = sequelize.define("detail_peminjaman", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: {
      type: DataTypes.BIGINT
    },
    peminjaman_id: {
      type: DataTypes.BIGINT
    },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
    deletedAt: { type: DataTypes.DATE, field: 'deleted_at' },
  }, {
    paranoid: true,
    tableName: 'detail_peminjaman',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt']
      },
    },

  });

  DetailPeminjaman.associate = function (models) {
    this.belongsTo(models.product, { foreignKey: 'product_id' });
    this.belongsTo(models.peminjaman, { foreignKey: 'peminjaman_id' });
  };

  return DetailPeminjaman;
};