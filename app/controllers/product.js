const db = require("../models");
const Product = db['product'];
const ProductImage = db['product_image'];
const imageService = require('../services/image.js');
const Op = db.Sequelize.Op;

module.exports = {
  async findAllPaginate(req, res) {
    try {
      const whereProduct = {};
      const whereCategory = {};
      const whereBrand = {};
      const sortColumn = req.query.sort ? req.query.sort : 'createdAt';
      const sortOrder = req.query.order ? req.query.order : 'DESC';

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
        order: [
          [sortColumn, sortOrder]
        ],
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
      const sortColumn = req.query.sort ? req.query.sort : 'createdAt';
      const sortOrder = req.query.order ? req.query.order : 'DESC';
      const limit = req.query.limit ? Number(req.query.limit) : undefined;

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
        where: whereProduct,
        limit, 
        order: [
          [sortColumn, sortOrder]
        ]
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
      const product = await Product.findByPk(req.params.id, {
        include: [{
          model: db['category']
        },
        {
          model: db['brand']
        },
        {
          model: db['product_image']
        }]
      });
      res.status(200).send(product);
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving products."
      });
    }
  },

  async create(req, res) {
    try {
      const data = await Product.create(req.body);
      const { cover, product_images } = req.files;
      let image_url = "product-images/" + data.id + path.extname(cover.name);
      await imageService.uploadImage("../../public/"+image_url, req.files);
      await data.update({ cover: image_url });

      if(product_images){
        product_images.forEach(async (product_image) => {
          const productImage = await ProductImage.create({ product_id: data.id});
          let image_url = "product-images/" + productImage.id + path.extname(product_image.name);
          await imageService.uploadImage("../../public/"+image_url, req.files);
          await productImage.update({ image_url: image_url });
        });
      }
      res.status(200).send(data);
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving products."
      });
    }
  },

  async update(req, res) { 
    try {
      const product = await Product.findByPk(req.params.id);
      const { cover, product_images } = req.files;
      let image_url = "jasa-images/" + data.id + path.extname(cover.name);
      await imageService.uploadImage("../../public/"+image_url, req.files);
      const updatedProduct = await product.update({ ...req.body, cover: image_url });
      res.status(200).send(updatedProduct);
    } catch (err) {s
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving products."
      });
    }
  },

  async delete(req, res) {
    try {
      const force = req.query.force;
      const product = await Product.findByPk(req.params.id);
      const productImages = await ProductImage.findAll({
        where: {
          product_id: req.params.id
        }
      });
      productImages.forEach(async (productImage) => {
        if(force)
          await imageService.deleteImage("../../public/images/"+productImage.image_url);
        await productImage.destroy({force});
      });

      const deletedProduct = await product.destroy({force});
      res.status(200).send(deletedProduct);
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving products."
      });
    }
  },

  async deleteImage(req, res) {
    try {
      const force = req.query.force;
      const productImage = await ProductImage.findByPk(req.params.id);
      if(force)
        await imageService.deleteImage("../../public/images/"+productImage.image_url);
      const deletedProductImage = await productImage.destroy({force});
      res.status(200).send(deletedProductImage);
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving products."
      });
    }
  },

  async createImage(req, res) {
    try {
      const data = await ProductImage.create(req.body);
      const { image } = req.files;
      let image_url = "jasa-images/" + data.id + path.extname(image.name);
      await imageService.uploadImage("../../public/"+image_url, req.files);
      await data.update({ image_url });
      res.status(200).send(data);
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving products."
      });
    }
  },

  async test(req, res) {
    try {
      const data = await Product.findAll({
        include: [
        {
          model: db['category']
        },
        {
          model: db['brand']
        },
        {
          model: db['product_image']
        }]
      });
      res.status(200).send(data);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving products."
      });
    }
  }
}