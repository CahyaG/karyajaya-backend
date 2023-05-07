module.exports = (sequelize, DataTypes) => {
  const Peminjaman = sequelize.define("peminjaman", {
    code: {
      type: DataTypes.STRING
    },
    return_date: {
      type: DataTypes.DATE
    },
    return_deadline: {
      type: DataTypes.DATE
    },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  }, {
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
    },

  });

  Peminjaman.associate = function (models) {
    this.belongsTo(models.product, { foreignKey: 'product_id' });
  };

  return Peminjaman;
};