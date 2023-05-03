const db = require("../models");
const Brand = db['brand'];
const imageService = require('../services/image.js');
const path = require('path')
const Op = db.Sequelize.Op;

module.exports = {
  async findAll(req, res) {
    try {
      const where = {};

      if(req.query.name) {
        where.name = {
          [Op.like]: `%${req.query.name}%`
        }
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
      await imageService.uploadImage("../../public/"+image_url, req.files);
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
      res.json(data);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while updating the Brand."
      });
    }
  },

  async delete(req, res) {
    try {
      const data = await Brand.destroy({
        where: { id: req.params.id }
      });
      res.json(data);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while deleting the Brand."
      });
    }
  }
}