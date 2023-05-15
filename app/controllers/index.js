const product = require('./product.js');
const category = require('./category.js');
const brand = require('./brand.js');
const user = require('./user.js');
const refreshToken = require("./refreshToken.js");
const peminjaman = require("./peminjaman.js");
const jasa = require("./jasa.js");
const penjualan = require("./penjualan.js");

module.exports = {
  product,
  category,
  brand,
  jasa,
  user,
  penjualan,
  refreshToken,
  peminjaman
};