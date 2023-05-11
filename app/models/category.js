module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define("category", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    category_code: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
    deletedAt: { type: DataTypes.DATE, field: 'deleted_at' },
  }, {
    paranoid: true,
    defaultScope: {
      attributes: { 
        exclude: ['createdAt','updatedAt', 'deletedAt'] 
      },
    },

  });

  Category.associate = function(models) {
    this.hasMany(models.product, {foreignKey: 'category_id'});
  };  

  return Category;
};