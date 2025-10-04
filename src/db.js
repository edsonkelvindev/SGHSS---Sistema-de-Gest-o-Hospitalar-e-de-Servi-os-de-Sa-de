const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:123456@localhost:5432/sghss_db' });
module.exports = { pool };
