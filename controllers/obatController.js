const { ObatModel } = require('../models/obatModel');

const obatController = {

  // GET /obat
  getAll: async (req, res) => {
    try {
      const data = await ObatModel.getAll();
      res.json({
        status: 'success',
        message: 'Data retrieved successfully',
        data
      });
    } catch (err) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  },

  // GET /obat/:id
  getById: async (req, res) => {
    try {
      const data = await ObatModel.getById(req.params.id);
      if (!data) {
        return res.status(404).json({ status: 'error', message: 'Data tidak ditemukan' });
      }
      res.json({ status: 'success', message: 'Data retrieved successfully', data });
    } catch (err) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  },

  // POST /obat
  create: async (req, res) => {
    try {
      const { nama_obat, kategori, stok, harga, satuan, kadaluarsa, keterangan } = req.body;

      if (!nama_obat || !kategori || stok === undefined || !harga || !satuan || !kadaluarsa) {
        return res.status(400).json({
          status: 'error',
          message: 'Field nama_obat, kategori, stok, harga, satuan, dan kadaluarsa wajib diisi'
        });
      }

      const data = await ObatModel.create({ nama_obat, kategori, stok, harga, satuan, kadaluarsa, keterangan });
      res.status(201).json({ status: 'success', message: 'Data created successfully', data });
    } catch (err) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  },

  // PUT /obat/:id
  update: async (req, res) => {
    try {
      const data = await ObatModel.update(req.params.id, req.body);
      if (!data) {
        return res.status(404).json({ status: 'error', message: 'Data tidak ditemukan' });
      }
      res.json({ status: 'success', message: 'Data updated successfully', data });
    } catch (err) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  },

  // DELETE /obat/:id
  delete: async (req, res) => {
    try {
      const deleted = await ObatModel.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ status: 'error', message: 'Data tidak ditemukan' });
      }
      res.json({ status: 'success', message: 'Data deleted successfully' });
    } catch (err) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  }
};

module.exports = obatController;
