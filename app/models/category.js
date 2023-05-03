module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define("category", {
    category_code: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    image_url: {
      type: DataTypes.STRING
    },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  }, {
    defaultScope: {
      attributes: { 
        exclude: ['createdAt','updatedAt'] 
      },
    },

  });

  Category.associate = function(models) {
    this.hasMany(models.product, {foreignKey: 'category_id'});
  };  

  return Category;
};