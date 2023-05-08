const db = require("../models");
const Penjualan = db['penjualan'];
const DetailPenjualan = db['detail_penjualan'];
const Op = db.Sequelize.Op;

module.exports = {
  async findAll(req, res) {
    try {
      const where = {};

      if(req.query.kode_penjualan) {
        where.kode_penjualan = {
          [Op.like]: `%${req.query.kode_penjualan}%`
        }
      }

      const data = await Penjualan.findAll({
        attributes: [
          'id','kode_penjualan', 'tanggal_penjualan', 'total_harga',
          [db.sequelize.fn('COUNT', db.sequelize.col('detail_penjualans.id')), 'total_barang']
        ],
        include: [{
          model: DetailPenjualan,
          attributes: []
        }],
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
      const data = await Penjualan.findOne({
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
      const data = await Penjualan.create(req.body);
      
      res.json(data);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while creating the Jasa."
      });
    }
  },

  async update(req, res) {
    try {
      const data = await Penjualan.update(req.body, {
        where: {
          id: req.params.id
        }
      });
      
      res.json(data);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while updating the Penjualan."
      });
    }
  },

  async delete(req, res) {
    try {
      const force = req.query.force;
      const data = await Penjualan.findByPk(req.params.id);
      await DetailPenjualan.destroy({
        where: {
          penjualan_id: req.params.id
        },
        force
      });
      const deletedPenjualan = await data.destroy({ force });
      
      res.json(deletedPenjualan);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while deleting the Penjualan."
      });
    }
  },

  async findAllPaginate(req, res) {
    try {
      const where = {};

      if(req.query.kode_penjualan) {
        where.kode_penjualan = {
          [Op.like]: `%${req.query.kode_penjualan}%`
        }
      }

      let currentPage = req.params.page ? Number(req.params.page) : 1
      let perPage = req.query.perPage ? Number(req.query.perPage) : 10

      const data = await Penjualan.findAndCountAll({
        attributes: [
          'id','kode_penjualan', 'tanggal_penjualan', 'total_harga',
          [db.sequelize.fn('COUNT', db.sequelize.col('detail_penjualans.id')), 'total_barang']
        ],
        include: [{
          model: DetailPenjualan,
          attributes: []
        }],
        where: where,
        limit: req.query.perPage,
        offset: (currentPage - 1) * perPage,
      });

      let total = data.count;
      let lastPage = Math.ceil(total / perPage)
      let prevPage = (currentPage != 1) ? req.headers.host + '/penjualan/page/' + (currentPage-1) : undefined;
      let nextPage = (currentPage != lastPage) ? req.headers.host + '/penjualan/page/' + (currentPage+1) : undefined;

      let penjualan = {
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

      res.status(200).send(penjualan);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while retrieving jasas."
      });
    }
  }

}