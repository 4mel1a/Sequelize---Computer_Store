'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  product.init({
    id_product: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    nama: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    stok: DataTypes.DOUBLE,
    product_image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'product',
    tableName: 'product'    //setting nama tabel
  });
  return product;
};