const db = require("../models");
const Category = db['category'];
const imageService = require('../services/image.js');
const path = require('path')
const Op = db.Sequelize.Op;

module.exports = {
  async findAllPaginate(req, res) {
    try {
      const where = {};
      const sortColumn = req.query.sort ? req.query.sort : 'created_at';
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
        paginate:{
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
      const sortColumn = req.query.sort ? req.query.sort : 'created_at';
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
      const { image } = req.files || {};
      if( image ){
        let url = "category-images/" + imageService.makeid() + data.id + path.extname(image.name);
        await imageService.uploadImage(path.join(publicUrl, url), image);
        await data.update({ image_url: url });
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
      const category = await Category.findByPk(req.params.id);

      let image_url = category.image_url;
      const { image } = req.files || {};
      if(image){
        await imageService.deleteImage(path.join(publicUrl, category.image_url));
        image_url = "category-images/" + imageService.makeid() + category.id + path.extname(image.name);
        await imageService.uploadImage(path.join(publicUrl, category.image_url), image_url);
      }
      
      const updatedCategory = await category.update({ ...req.body, image_url: image_url });
      res.json(updatedCategory);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while updating the Category."
      });
    }
  },

  async delete(req, res) {
    try {
      const force = req.query.force ? req.query.force : false;
      const data = await Category.findByPk(req.params.id);
      if(force && data.image_url)
        await imageService.deleteImage(path.join(publicUrl, data.image_url));
      const deletedCategory = await data.destroy({force});
      res.status(200).send(deletedCategory);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while deleting the Category."
      });
    }
  }
}