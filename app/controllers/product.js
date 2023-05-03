const fs = require('fs');

const db = require("../models");
const Product = db['product'];
const ProductImage = db['product_image'];
const Op = db.Sequelize.Op;

module.exports = {
  async findAllPaginate(req, res) {
    try {
      const whereProduct = {};
      const whereCategory = {};
      const whereBrand = {};

      if(req.query.name) {
        whereProduct.name = {
          [Op.like]: `%${req.query.name}%`
        }
      }

      if(req.query.category) {
        whereCategory.name = {
          [Op.like]: `%${req.query.category}%`
        }
      }

      if(req.query.brand) {
        whereBrand.name = {
          [Op.like]: `%${req.query.brand}%`
        }
      }

      let currentPage = req.params.page ? Number(req.params.page) : 1
      let perPage = req.query.perPage ? Number(req.query.perPage) : 10

      const data = await Product.findAndCountAll({
        include: [{
          model: db['category'],
          where: whereCategory
        },
        {
          model: db['brand'],
          where: whereBrand
        }],
        where: whereProduct,
        limit: perPage,
        offset: (currentPage - 1)*perPage,
      });

      let total = data.count;
      let lastPage = Math.ceil(total / perPage)
      let prevPage = (currentPage != 1) ? req.headers.host + '/products/page/' + (currentPage-1) : undefined;
      let nextPage = (currentPage != lastPage) ? req.headers.host + '/products/page/' + (currentPage+1) : undefined;

      let products = {
        content: data.rows,
        pagginate:{
            total,
            currentPage,
            lastPage,
            perPage,
            prevPage,
            nextPage
        }
      }

      res.status(200).send(products);
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving products."
      });
    }
  },

  async findAll(req, res) {
    try {
      const whereProduct = {};
      const whereCategory = {};
      const whereBrand = {};

      if(req.query.name) {
        whereProduct.name = {
          [Op.like]: `%${req.query.name}%`
        }
      }

      if(req.query.category) {
        whereCategory.name = {
          [Op.like]: `%${req.query.category}%`
        }
      }

      if(req.query.brand) {
        whereBrand.name = {
          [Op.like]: `%${req.query.brand}%`
        }
      }

      const products = await Product.findAll({
        include: [{
          model: db['category'],
          where: whereCategory
        },
        {
          model: db['brand'],
          where: whereBrand
        }],
        where: whereProduct
      });

      res.status(200).send(products);
    } catch (err) {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving products."
        });
    }
  },

  async findOne(req, res) {
    try {
      const product = await Product.findByPk(req.params.id);
      res.status(200).send(product);
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving products."
      });
    }
  },

  async create(req, res) {
    try {
      const product = await Product.create(req.body);
      res.status(200).send(product);
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving products."
      });
    }
  },

  async update(req, res) { 
    try {
      const product = await Product.findByPk(req.params.id);
      const updatedProduct = await product.update(req.body);
      res.status(200).send(updatedProduct);
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving products."
      });
    }
  },

  async delete(req, res) {
    try {
      const product = await Product.findByPk(req.params.id);
      const productImages = await ProductImage.findAll({
        where: {
          product_id: req.params.id
        }
      });
      productImages.forEach(async (productImage) => {
        fs.unlink("../../public/images/"+productImage.image_url, (err) => {
          if (err) {
              throw err;
          }
        });
        await productImage.destroy();
      });

      const deletedProduct = await product.destroy();
      res.status(200).send(deletedProduct);
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving products."
      });
    }
  }
}