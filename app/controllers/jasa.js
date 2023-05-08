const db = require("../models");
const Jasa = db['jasa'];
const imageService = require('../services/image.js');
const Op = db.Sequelize.Op;

module.exports = {
  async findAllPaginate(req, res) {
    try {
      const where = {};

      if(req.query.name) {
        where.name = {
          [Op.like]: `%${req.query.name}%`
        }
      }

      let currentPage = req.params.page ? Number(req.params.page) : 1
      let perPage = req.query.perPage ? Number(req.query.perPage) : 10

      const data = await Product.findAndCountAll({
        where: where,
        limit: perPage,
        offset: (currentPage - 1)*perPage,
      });

      let total = data.count;
      let lastPage = Math.ceil(total / perPage)
      let prevPage = (currentPage != 1) ? req.headers.host + '/jasa/page/' + (currentPage-1) : undefined;
      let nextPage = (currentPage != lastPage) ? req.headers.host + '/jasa/page/' + (currentPage+1) : undefined;

      let jasa = {
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

      res.json(jasa);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while retrieving jasas."
      });
    }
  },

  async findAll(req, res) {
    try {
      const where = {};

      if(req.query.name) {
        where.name = {
          [Op.like]: `%${req.query.name}%`
        }
      }

      const data = await Jasa.findAll({
        where: where
      });

      res.json(data);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while retrieving jasas."
      });
    }
  },

  async findOne(req, res) {
    try {
      const data = await Jasa.findOne({
        where: {
          id: req.params.id
        }
      });

      res.json(data);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while retrieving jasas."
      });
    }
  },

  async create(req, res) {
    try {
      const data = await Jasa.create(req.body);
      
      const { cover } = req.files;
      let image_url = "jasa-images/" + data.id + path.extname(cover.name);
      await imageService.uploadImage("../../public/"+image_url, req.files);
      await data.update({ cover: image_url });
      res.json(data);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while creating the jasa."
      });
    }
  },

  async update(req, res) {
    try {
      const data = await Jasa.update(req.body, {
        where: { id: req.params.id }
      });

      const { cover } = req.files;
      if(cover){
        await imageService.uploadImage("../../public/"+data.cover, req.files);
      }

      res.json(data);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while updating the jasa."
      });
    }
  },

  async delete(req, res) {
    try {
      const force = req.query.force;
      const data = await Jasa.destroy({
        where: { id: req.params.id },
        force
      });
      if(force){
        await imageService.deleteImage("../../public/"+data.cover);
      }

      res.json(deletedJasa);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while deleting the jasa."
      });
    }
  }
}