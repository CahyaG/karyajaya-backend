const db = require("../models");
const Category = db['category'];
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

      const data = await Category.findAll({
        where: where
      });

      res.json(data);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while retrieving categories."
      });
    }
  },

  async findOne(req, res) {
    try {
      const data = await Category.findByPk(req.params.id);

      res.json(data);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while retrieving categories."
      });
    }
  },

  async create(req, res) {
    try {
      const data = await Category.create(req.body);
      const { image_url } = req.files;
      let url = "category-images/" + data.id + path.extname(image_url.name);
      await imageService.uploadImage("../../public/"+url, req.files);
      await data.update({ image_url: image_url });
      res.json(data);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while creating the Category."
      });
    }
  },

  async update(req, res) {
    try {
      const data = await Category.update(req.body, {
        where: { id: req.params.id }
      });

      const { image_url } = req.files;
      if(image_url){
        await imageService.uploadImage("../../public/"+data.image_url, req.files);
      }

      res.json(data);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while updating the Category."
      });
    }
  },

  async delete(req, res) {
    try {
      const data = await Category.findByPk(req.params.id);
      await imageService.deleteImage("../../public/"+data.image_url);
      const deletedCategory = await data.destroy();
      res.status(200).send(deletedCategory);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while deleting the Category."
      });
    }
  }
}