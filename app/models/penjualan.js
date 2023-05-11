module.exports = (sequelize, DataTypes) => {
  const Penjualan = sequelize.define("penjualan", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    kode_penjualan: {
      type: DataTypes.STRING
    },
    total_harga: {
      type: DataTypes.INTEGER
    },
    tanggal_penjualan: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
  }, {
    paranoid: true,
    tableName: 'penjualan',
    createdAt : 'created_at',
    updatedAt : 'updated_at',
    deletedAt : 'deleted_at',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt']
      },
    },

  });

  Penjualan.associate = function (models) {
    this.hasMany(models.detail_penjualan, { foreignKey: 'penjualan_id' });
    this.belongsToMany(models.product, { through: models.detail_penjualan, foreignKey: 'penjualan_id' });
  };

  return Penjualan;
};