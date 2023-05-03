module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define("category", {
    category_code: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.STRING
    },
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }, {
    defaultScope: {
      attributes: { 
        exclude: ['created_at','updated_at'] 
      },
    },

  });

  Category.associate = function(models) {
    this.hasMany(models.product, {foreignKey: 'category_id'});
  };  

  return Category;
};