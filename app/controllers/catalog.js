const db = require("../models");
const Product = db['product'];
const Op = db.Sequelize.Op;

module.exports = {
  async findAllProduct(req, res) {
    try {
      const products = await Product.findAll();
      res.status(200).send(products);
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving products."
      });
    }
  },
}