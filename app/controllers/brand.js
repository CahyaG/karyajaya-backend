const db = require("../models");
const Brand = db['brand'];
const imageService = require('../services/image.js');
const path = require('path');
const Op = db.Sequelize.Op;

module.exports = {
  async findAllPaginate(req, res) {
    try {
      const where = {};

      if (req.query.name) {
        where.name = {
          [Op.like]: `%${req.query.name}%`
        };
      }

      let currentPage = req.params.page ? Number(req.params.page) : 1;
      let perPage = req.query.perPage ? Number(req.query.perPage) : 10;

      const data = await Brand.findAndCountAll({
        where: where,
        limit: perPage,
        offset: (currentPage - 1) * perPage
      });

      let total = data.count;
      let lastPage = Math.ceil(total / perPage);
      let prevPage = currentPage != 1 ? req.headers.host + "/brand/page/" + (currentPage - 1) : undefined;
      let nextPage = currentPage != lastPage ? req.headers.host + "/brand/page/" + (currentPage + 1) : undefined;

      let brand = {
        content: data.rows,
        pagginate: {
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

      if (req.query.name) {
        where.name = {
          [Op.like]: `%${req.query.name}%`
        };
      }

      const data = await Brand.findAll({
        where: where
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
      const { image } = req.files;
      let image_url = "brand-images/" + data.id + path.extname(image.name);
      await imageService.uploadImage("../../public/" + image_url, req.files);
      await data.update({ image_url: image_url });
      res.json(data);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while creating the Brand."
      });
    }
  },

  async update(req, res) {
    try {
      const data = await Brand.update(req.body, {
        where: { id: req.params.id }
      });
      const { image_url } = req.files;
      if(image_url){
        await imageService.uploadImage("../../public/"+data.image_url, req.files);
      }
      res.json(data);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while updating the Brand."
      });
    }
  },

  async delete(req, res) {
    try {
      const force = req.query.force;
      const data = await Brand.findByPk(req.params.id);
      if(force)
        await imageService.deleteImage("../../public/"+data.image_url);
      const deletedBrand = await Brand.destroy({force});
      res.json(deletedBrand);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while deleting the Brand."
      });
    }
  }
};