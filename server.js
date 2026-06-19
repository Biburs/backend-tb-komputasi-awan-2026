const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/database');
const { initDatabase } = require('./models/obatModel');
const obatRoutes = require('./routes/obatRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Backend API Obat Apotek - TB Cloud Computing 2026',
    student: { name: 'Ihsan Habiburrohim', nim: '2411523022' },
    endpoints: ['/health', '/schema', '/obat']
  });
});

// ============================================================
// GET /health
// ============================================================
app.get('/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('SELECT 1');
    connection.release();
    res.json({
      status: 'success',
      message: 'Backend is running',
      database: 'connected',
      student: {
        name: 'Ihsan Auliya Habiburrohim',
        nim: '2411523022'
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Backend is running, but database is not connected',
      database: 'disconnected',
      student: {
        name: 'Ihsan Auliya Habiburrohim',
        nim: '2411523022'
      }
    });
  }
});

// ============================================================
// GET /schema
// ============================================================
app.get('/schema', (req, res) => {
  res.json({
    student: {
      name: 'Ihsan Auliya Habiburrohim',
      nim: '2411523022'
    },
    resource: {
      name: 'obat',
      label: 'Data Obat Apotek',
      description: 'Aplikasi untuk mengelola data obat di apotek'
    },
    fields: [
      { name: 'nama_obat',  label: 'Nama Obat',           type: 'text',   required: true,  showInTable: true  },
      { name: 'kategori',   label: 'Kategori',             type: 'text',   required: true,  showInTable: true  },
      { name: 'stok',       label: 'Stok',                 type: 'number', required: true,  showInTable: true  },
      { name: 'harga',      label: 'Harga (Rp)',           type: 'number', required: true,  showInTable: true  },
      { name: 'satuan',     label: 'Satuan',               type: 'text',   required: true,  showInTable: true  },
      { name: 'kadaluarsa', label: 'Tanggal Kadaluarsa',   type: 'date',   required: true,  showInTable: true  },
      { name: 'keterangan', label: 'Keterangan',           type: 'text',   required: false, showInTable: false }
    ],
    endpoints: {
      list:   '/obat',
      detail: '/obat/{id}',
      create: '/obat',
      update: '/obat/{id}',
      delete: '/obat/{id}'
    }
  });
});

// ============================================================
// Routes
// ============================================================
app.use('/obat', obatRoutes);

// ============================================================
// START SERVER
// ============================================================
initDatabase().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server berjalan di port ${PORT}`);
  });
});
