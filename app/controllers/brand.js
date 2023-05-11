const db = require("../models");
const Brand = db['brand'];
const imageService = require('../services/image.js');
const path = require('path');
const Op = db.Sequelize.Op;

module.exports = {
  async findAllPaginate(req, res) {
    try {
      const where = {};
      const sortColumn = req.query.sort ? req.query.sort : 'created_at';
      const sortOrder = req.query.order ? req.query.order : 'DESC';

      if (req.query.name) {
        where.name = {
          [Op.like]: `%${req.query.name}%`
        };
      }

      let currentPage = req.params.page ? Number(req.params.page) : 1;
      let perPage = req.query.perPage ? Number(req.query.perPage) : 10;

      const data = await Brand.findAndCountAll({
        where: where,
        order: [
          [sortColumn, sortOrder]
        ],
        limit: perPage,
        offset: (currentPage - 1) * perPage
      });

      let total = data.count;
      let lastPage = Math.ceil(total / perPage);
      let prevPage = currentPage != 1 ? req.headers.host + "/brand/page/" + (currentPage - 1) : undefined;
      let nextPage = currentPage != lastPage ? req.headers.host + "/brand/page/" + (currentPage + 1) : undefined;

      let brand = {
        content: data.rows,
        paginate: {
          total,
          currentPage,
          lastPage,
          perPage,
          prevPage,
          nextPage
        }
      };

      res.json(brand);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while retrieving brands."
      });
    }
  }
  ,
  async findAll(req, res) {
    try {
      const where = {};
      const sortColumn = req.query.sort ? req.query.sort : 'created_at';
      const sortOrder = req.query.order ? req.query.order : 'DESC';
      const limit = req.query.limit ? Number(req.query.limit) : undefined;

      if (req.query.name) {
        where.name = {
          [Op.like]: `%${req.query.name}%`
        };
      }

      const data = await Brand.findAll({
        where: where,
        limit,
        order: [
          [sortColumn, sortOrder]
        ]
      });

      res.json(data);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while retrieving brands."
      });
    }
  },

  async findOne(req, res) {
    try {
      const data = await Brand.findByPk(req.params.id);

      res.json(data);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while retrieving brands."
      });
    }
  },

  async create(req, res) {
    try {
      const data = await Brand.create(req.body);
      const { image } = req.files || {};
      if(image){
        let image_url = "brand-images/" + imageService.makeid() + data.id + path.extname(image.name);
        await imageService.uploadImage(path.join(publicUrl, image_url), image);
        await data.update({ image_url: image_url });
      }
      res.json(data);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while creating the Brand."
      });
    }
  },

  async update(req, res) {
    try {
      const brand = await Brand.findByPk(req.params.id);

      let image_url = brand.image_url;
      const { image } = req.files || {};
      if(image){
        await imageService.deleteImage(path.join(publicUrl, brand.image_url));
        image_url = "brand-images/" + imageService.makeid() + brand.id + path.extname(image.name);
        await imageService.uploadImage(path.join(publicUrl, brand.image_url), image);
      }

      const updatedBrand = await brand.update({...req.body, image_url: image_url});

      res.json(updatedBrand);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while updating the Brand."
      });
    }
  },

  async delete(req, res) {
    try {
      const force = req.query.force ? req.query.force : false;
      const data = await Brand.findByPk(req.params.id);
      if(force && data.image_url)
        await imageService.deleteImage(path.join(publicUrl, data.image_url));
      const deletedBrand = await data.destroy({force});
      res.json(deletedBrand);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while deleting the Brand."
      });
    }
  }
};