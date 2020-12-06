'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class detail_transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // menguhubungkan detail_transaksi -> product
      this.belongsTo(models.product, {
        foreignKey: "id_product",
        as: "product"
      })
    }
  };
  detail_transaksi.init({
    id_transaksi: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    id_product: {
    type: DataTypes.INTEGER,
    primaryKey: true
    },
    price: DataTypes.DOUBLE,
    quantity: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'detail_transaksi',
    tableName: 'detail_transaksi'   //setting nama tabel
  });
  return detail_transaksi;
};