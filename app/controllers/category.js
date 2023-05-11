const db = require("../models");
const Category = db['category'];
const imageService = require('../services/image.js');
const path = require('path')
const Op = db.Sequelize.Op;

module.exports = {
  async findAllPaginate(req, res) {
    try {
      const where = {};
      const sortColumn = req.query.sort ? req.query.sort : 'createdAt';
      const sortOrder = req.query.order ? req.query.order : 'DESC';

      if(req.query.name) {
        where.name = {
          [Op.like]: `%${req.query.name}%`
        }
      }

      let currentPage = req.params.page ? Number(req.params.page) : 1
      let perPage = req.query.perPage ? Number(req.query.perPage) : 10

      const data = await Category.findAndCountAll({
        where: where,
        order: [
          [sortColumn, sortOrder]
        ],
        limit: perPage,
        offset: (currentPage - 1)*perPage,
      });

      let total = data.count;
      let lastPage = Math.ceil(total / perPage)
      let prevPage = (currentPage != 1) ? req.headers.host + '/category/page/' + (currentPage-1) : undefined;
      let nextPage = (currentPage != lastPage) ? req.headers.host + '/category/page/' + (currentPage+1) : undefined;

      let category = {
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

      res.json(category);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while retrieving categories."
      });
    }
  },

  async findAll(req, res) {
    try {
      const where = {};
      const sortColumn = req.query.sort ? req.query.sort : 'createdAt';
      const sortOrder = req.query.order ? req.query.order : 'DESC';
      const limit = req.query.limit ? Number(req.query.limit) : undefined;

      if(req.query.name) {
        where.name = {
          [Op.like]: `%${req.query.name}%`
        }
      }

      const data = await Category.findAll({
        where: where,
        limit, 
        order: [
          [sortColumn, sortOrder]
        ]
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
      if( image_url ){
        let url = "category-images/" + data.id + path.extname(image_url.name);
        await imageService.uploadImage("../../public/"+url, req.files);
        await data.update({ image_url: image_url });
      }
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
      const force = req.query.force;
      const data = await Category.findByPk(req.params.id);
      if(force)
        await imageService.deleteImage("../../public/"+data.image_url);
      const deletedCategory = await data.destroy({force});
      res.status(200).send(deletedCategory);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while deleting the Category."
      });
    }
  }
}