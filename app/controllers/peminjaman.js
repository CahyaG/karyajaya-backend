const db = require("../models");
const Peminjaman = db["peminjaman"];
const Op = db.Sequelize.Op;

module.exports = {
  async findAll(req, res) {
    try {
      const where = {};

      if (req.query.code) {
        where.code = {
          [Op.like]: `%${req.query.code}%`
        };
      }

      const data = await Peminjaman.findAll({
        where: where
      });

      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: error.message || "Some error occurred while retrieving lending."
      });
    }
  },

  async findOne(req, res) {
    try {
      const data = await Peminjaman.findByPk(req.params.id);

      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: error.message || "Some error occurred while retrieving lending."
      });
    }
  },

  async create(req, res) {
    try {
      const data = await Peminjaman.create(req.body);
      const peminjaman = await Peminjaman.findAll({
        order: [["createdAt", "DESC"]]
      });

      const date = new Date();
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let id = 1;
      if (peminjaman[0]) {
        id = peminjaman[0].id;
      }
      let code = "LE" + day + month + year + id;

      await data.update({
        code: code
      });

      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: error.message || "Some error occurred while creating the lending."
      });
    }
  },

  async update(req, res) {
    try {
      const data = await Peminjaman.update(req.body, {
        where: {
          id: req.params.id
        }
      });

      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: error.message || "Some error occurred while updating the lending."
      });
    }
  },

  async delete(req, res) {
    try {
      const data = await Peminjaman.destroy({
        where: {
          id: req.params.id
        }
      });

      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: error.message || "Some error occurred while deleting the lending."
      });
    }
  }
};