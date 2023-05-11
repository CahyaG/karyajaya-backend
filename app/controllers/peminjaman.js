const db = require("../models");
const Peminjaman = db["peminjaman"];
const DetailPeminjaman = db["detail_peminjaman"];
const Op = db.Sequelize.Op;

module.exports = {
  async findAll(req, res) {
    try {
      const where = {};

      if (req.query.kode_peminjaman) {
        where.kode_peminjaman = {
          [Op.like]: `%${req.query.kode_peminjaman}%`
        };
      }

      const data = await Peminjaman.findAll({
        attributes: [
          'id', 'kode_peminjaman', 'tanggal_keluar', 'tanggal_kembali', 'tanggal_dikembalikan', [db.sequelize.fn('COUNT', db.sequelize.col('detail_peminjamans.id')), 'total_barang']
        ],
        include: [{
          model: DetailPeminjaman,
          attributes: []
        }],
        where: where
      });

      res.json(data);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while retrieving peminjaman"
      });
    }
  },

  async findOne(req, res) {
    try {
      const data = await Peminjaman.findOne({
        where: {
          id: req.params.id
        }
      });

      res.json(data);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while retrieving peminjaman"
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
        message: error.message || "Some error occurred while creating the peminjaman."
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
      res.status(500).send({
        message: error.message || "Some error occurred while updating the peminjaman."
      });
    }
  },

  async delete(req, res) {
    try {
      const force = req.query.force;
      const data = await Peminjaman.findByPk(req.params.id);
      await DetailPeminjaman.destroy({
        where: {
          peminjaman_id: req.params.id
        },
        force
      });
      const deletedPeminjaman = await data.destroy({
        force
      });

      res.json(deletedPeminjaman);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while deleting the peminjaman."
      });
    }
  },

  async findAllPaginate(req, res) {
    try {
      const where = {};

      if (req.query.kode_peminjaman) {
        where.kode_peminjaman = {
          [Op.like]: `%${req.query.kode_peminjaman}%`
        };
      }

      let currentPage = req.params.page ? Number(req.params.page) : 1;
      let perPage = req.params.perPage ? Number(req.query.perPage) : 10;

      const data = await Peminjaman.findAndCountAll({
        attributes: [
          'id', 'kode_peminjaman', 'tanggal_keluar', 'tanggal_kembali', 'tanggal_dikembalikan',
          [db.sequelize.fn('COUNT', db.sequelize.col('detail_peminjamans.id')), 'total_barang']
        ],
        include: [{
          model: DetailPeminjaman,
          attributes: []
        }],
        where: where,
        limit: req.query.perPage,
        offset: (currentPage - 1) * perPage,
      });

      let total = data.count;
      let lastPage = Math.ceil(total / perPage);
      let prevPage = (currentPage != 1) ? req.headers.host + "/peminjaman/page/" + (currentPage - 1) : undefined;
      let nextPage = (currentPage != lastPage) ? req.headers.host + "/peminjaman/page/" + (currentPage + 1) : undefined;

      let peminjaman = {
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

      res.status(200).send(peminjaman);
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while retrieving peminjaman."
      });
    }
  }
};