require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const authRoutes = require('./routes/auth');
const pacientesRoutes = require('./routes/pacientes');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:123456@localhost:5432/sghss_db' });
pool.connect()
  .then(() => console.log('Database connected successfully!'))
  .catch(err => console.error('Database connection error (may retry):', err));

app.locals.pool = pool;

app.use('/auth', authRoutes);
app.use('/pacientes', pacientesRoutes);

app.get('/', (req, res) => res.send('SGHSS API is running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
