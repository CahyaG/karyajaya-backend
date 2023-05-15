const db = require("../models");
const Penjualan = db['penjualan'];
const DetailPenjualan = db['detail_penjualan'];
const Product = db['product'];
const Op = db.Sequelize.Op;
const utils = require('../services/utils.js');

module.exports = {
  async findAll(req, res) {
    try {
      const where = {};
      const sortColumn = req.query.sort ? req.query.sort : 'created_at';
      const sortOrder = req.query.order ? req.query.order : 'DESC';
      const limit = req.query.limit ? Number(req.query.limit) : undefined;

      if(req.query.kode_penjualan) {
        where.kode_penjualan = {
          [Op.like]: `%${req.query.kode_penjualan}%`
        }
      }

      const data = await Penjualan.findAll({
        attributes: [
          'id','kode_penjualan', 'tanggal_penjualan', 'total_harga',
          // [db.sequelize.fn('COUNT', db.sequelize.col('detail_penjualans.id')), 'total_barang']
        ],
        include: [{
          model: DetailPenjualan,
          attributes: ['id'],
          include: [{
            model: Product,
            attributes: ['product_code', 'name']
          }]
        }],
        where: where,
        limit,
        order: [
          [sortColumn, sortOrder]
        ],
        // group: ['Penjualan.id']
      });
      if(!data[0].id){
        return res.json([])
      }

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
        },
        include: [{
          model: DetailPenjualan,
          attributes: ['id'],
          include: [{
            model: Product,
            attributes: ['id', 'product_code', 'name']
          }]
        }]
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
      let params = {
        tanggal_penjualan: req.body.tanggal_penjualan
      }
      const data = await Penjualan.create(params);
      const product_id = req.body.product_id;
      let total_price = 0

      await Promise.all(product_id.map( async (item) => {
        let detailPenjualan = {
          penjualan_id: data.id,
          product_id: item,
        }
        const product = await Product.findByPk(item);
        total_price += product.price;
        console.log(total_price)
        DetailPenjualan.create(detailPenjualan);
      }))
      
      let code = `PJ${utils.generateCode()}${data.id}`
      await data.update({
        kode_penjualan: code,
        total_harga: total_price
      });
      
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

      const product_id = req.body.product_id;
      await DetailPenjualan.destroy({
        force: true,
        where: {
          penjualan_id: req.params.id,
          product_id: {
            [Op.notIn]: product_id
          }
        }}
      )
      await Promise.all(product_id.map( async (item) => {
        const product = await DetailPenjualan.findOne({
          where: {
            penjualan_id: req.params.id,
            product_id: item
          }
        })
        if (!product) {
          let detailPenjualan = {
            penjualan_id: req.params.id,
            product_id: item,
          }
          DetailPenjualan.create(detailPenjualan);
        }
      }))
      
      res.json(data);
    } catch (error) {
      console.log(error)
      res.status(500).send({
        message: error.message || "Some error occurred while updating the Penjualan."
      });
    }
  },

  async delete(req, res) {
    try {
      const force = req.query.force ? req.query.force : false;
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
      const sortColumn = req.query.sort ? req.query.sort : 'created_at';
      const sortOrder = req.query.order ? req.query.order : 'DESC';

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
        order: [
          [sortColumn, sortOrder]
        ],
        limit: req.query.perPage,
        offset: (currentPage - 1) * perPage,
        group: ['Penjualan.id']
      });

      let total = data.count;
      let lastPage = Math.ceil(total / perPage)
      let prevPage = (currentPage != 1) ? req.headers.host + '/penjualan/page/' + (currentPage-1) : undefined;
      let nextPage = (currentPage != lastPage) ? req.headers.host + '/penjualan/page/' + (currentPage+1) : undefined;

      let penjualan = {
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

      res.status(200).send(penjualan);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while retrieving jasas."
      });
    }
  }

}