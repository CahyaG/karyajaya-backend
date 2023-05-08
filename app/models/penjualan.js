module.exports = (sequelize, DataTypes) => {
  const Penjualan = sequelize.define("penjualan", {
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
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  }, {
    paranoid: true,
    tableName: 'penjualan',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
    },

  });

  Penjualan.associate = function (models) {
    this.hasMany(models.detail_penjualan, { foreignKey: 'penjualan_id' });
    this.belongsToMany(models.product, { through: models.detail_penjualan, foreignKey: 'penjualan_id' });
  };

  return Penjualan;
};