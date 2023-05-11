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
  }, {
    paranoid: true,
    tableName: 'jasa',
    createdAt : 'created_at',
    updatedAt : 'updated_at',
    deletedAt : 'deleted_at',
    defaultScope: {
      attributes: { 
        exclude: ['createdAt','updatedAt', 'deletedAt'] 
      },
    },

  });

  return Jasa;
};