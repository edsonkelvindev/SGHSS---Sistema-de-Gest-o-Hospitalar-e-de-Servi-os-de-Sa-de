const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../src/db') || null;
const { pool: db } = require('../../src/db') || require('../../src/db');

const { Pool } = require('pg');

const createPool = () => {
  try {
    const p = require('../../src/db').pool;
    return p;
  } catch (err) {
    // fallback: main app attaches pool to app.locals; controllers will receive via req.app.locals.pool
    return null;
  }
};

exports.signup = async (req, res) => {
  const poolLocal = req.app?.locals?.pool || createPool();
  const { email, senha, role } = req.body;
  if (!email || !senha) return res.status(400).json({ error: 'email e senha obrigatorios' });
  try {
    const hash = await bcrypt.hash(senha, parseInt(process.env.BCRYPT_SALT_ROUNDS || '10'));
    const result = await poolLocal.query('INSERT INTO users (email, password_hash, role) VALUES ($1,$2,$3) RETURNING id,email,role', [email, hash, role || 'atendente']);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'email já cadastrado' });
    console.error(err);
    res.status(500).json({ error: 'erro no servidor' });
  }
};

exports.login = async (req, res) => {
  const poolLocal = req.app?.locals?.pool || createPool();
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ error: 'email e senha obrigatorios' });
  try {
    const { rows } = await poolLocal.query('SELECT * FROM users WHERE email=$1', [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'credenciais invalidas' });
    const match = await bcrypt.compare(senha, user.password_hash);
    if (!match) return res.status(401).json({ error: 'credenciais invalidas' });
    const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    res.json({ token, expiresIn: 3600 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erro no servidor' });
  }
};
