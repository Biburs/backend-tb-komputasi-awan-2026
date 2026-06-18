const pool = require('../config/database');

// Inisialisasi database dan tabel
const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    await connection.query(`USE \`${process.env.DB_NAME}\``);
    await connection.query(`
      CREATE TABLE IF NOT EXISTS obat (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_obat VARCHAR(255) NOT NULL,
        kategori VARCHAR(100) NOT NULL,
        stok INT NOT NULL DEFAULT 0,
        harga DECIMAL(10,2) NOT NULL,
        satuan VARCHAR(50) NOT NULL,
        kadaluarsa DATE NOT NULL,
        keterangan TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    connection.release();
    console.log('Database dan tabel berhasil diinisialisasi.');
  } catch (err) {
    console.error('Gagal inisialisasi database:', err.message);
  }
};

const ObatModel = {
  getAll: async () => {
    const [rows] = await pool.query('SELECT * FROM obat ORDER BY id ASC');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM obat WHERE id = ?', [id]);
    return rows[0] || null;
  },

  create: async (data) => {
    const { nama_obat, kategori, stok, harga, satuan, kadaluarsa, keterangan } = data;
    const [result] = await pool.query(
      'INSERT INTO obat (nama_obat, kategori, stok, harga, satuan, kadaluarsa, keterangan) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nama_obat, kategori, stok, harga, satuan, kadaluarsa, keterangan || null]
    );
    const [newRow] = await pool.query('SELECT * FROM obat WHERE id = ?', [result.insertId]);
    return newRow[0];
  },

  update: async (id, data) => {
    const existing = await ObatModel.getById(id);
    if (!existing) return null;

    const { nama_obat, kategori, stok, harga, satuan, kadaluarsa, keterangan } = data;
    await pool.query(
      'UPDATE obat SET nama_obat = ?, kategori = ?, stok = ?, harga = ?, satuan = ?, kadaluarsa = ?, keterangan = ? WHERE id = ?',
      [
        nama_obat   ?? existing.nama_obat,
        kategori    ?? existing.kategori,
        stok        ?? existing.stok,
        harga       ?? existing.harga,
        satuan      ?? existing.satuan,
        kadaluarsa  ?? existing.kadaluarsa,
        keterangan  ?? existing.keterangan,
        id
      ]
    );
    const [updated] = await pool.query('SELECT * FROM obat WHERE id = ?', [id]);
    return updated[0];
  },

  delete: async (id) => {
    const existing = await ObatModel.getById(id);
    if (!existing) return false;
    await pool.query('DELETE FROM obat WHERE id = ?', [id]);
    return true;
  }
};

module.exports = { ObatModel, initDatabase };
