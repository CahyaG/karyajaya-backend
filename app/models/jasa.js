module.exports = (sequelize, DataTypes) => {
  const Jasa = sequelize.define("jasa", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING
    },
    jasa_code: {
      type: DataTypes.STRING
    },
    cover: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    description: {
      type: DataTypes.TEXT
    },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
    deletedAt: { type: DataTypes.DATE, field: 'deleted_at' },
  }, {
    paranoid: true,
    tableName: 'jasa',
    defaultScope: {
      attributes: { 
        exclude: ['createdAt','updatedAt', 'deletedAt'] 
      },
    },

  });

  return Jasa;
};