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
  }, {
    paranoid: true,
    tableName: 'detail_peminjaman',
    createdAt : 'created_at',
    updatedAt : 'updated_at',
    deletedAt : 'deleted_at',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'productId']
      },
    },

  });

  DetailPeminjaman.associate = function (models) {
    this.belongsTo(models.product, { foreignKey: 'product_id' });
    this.belongsTo(models.peminjaman, { foreignKey: 'peminjaman_id' });
  };

  return DetailPeminjaman;
};