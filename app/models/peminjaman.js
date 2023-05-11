module.exports = (sequelize, DataTypes) => {
  const Peminjaman = sequelize.define("peminjaman", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    kode_peminjaman: {
      type: DataTypes.STRING
    },
    tanggal_keluar: {
      type: DataTypes.DATE,
      defaultvALUE: DataTypes.NOW
    },
    tanggal_kembali: {
      type: DataTypes.DATE
    },
    tanggal_dikembalikan: {
      type: DataTypes.DATE
    },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
    deletedAt: { type: DataTypes.DATE, field: 'deleted_at' },
  }, {
    paranoid: true,
    tableName: 'peminjaman',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt']
      },
    },

  });

  Peminjaman.associate = function (models) {
    this.hasMany(models.detail_peminjaman, { foreignKey: 'peminjaman_id' });
    this.belongsToMany(models.product, { through: models.detail_peminjaman, foreignKey: 'peminjaman_id' });
  };

  return Peminjaman;
};