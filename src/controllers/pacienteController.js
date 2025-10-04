const { Pool } = require('pg');

exports.createPaciente = async (req, res) => {
  const pool = req.app.locals.pool;
  const { nome, cpf, data_nascimento, telefone, email } = req.body;
  if (!nome || !cpf) return res.status(400).json({ error: 'nome e cpf obrigatorios' });
  try {
    const result = await pool.query('INSERT INTO pacientes (nome, cpf, data_nascimento, telefone, email) VALUES ($1,$2,$3,$4,$5) RETURNING id,nome,cpf', [nome, cpf, data_nascimento || null, telefone || null, email || null]);
    await pool.query('INSERT INTO audit_logs (usuario_id, action, resource_type, resource_id, details) VALUES ($1,$2,$3,$4,$5)', [req.user?.sub || null, 'create_paciente', 'paciente', result.rows[0].id, JSON.stringify({nome, cpf})]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'cpf já cadastrado' });
    console.error(err);
    res.status(500).json({ error: 'erro no servidor' });
  }
};

exports.listPacientes = async (req, res) => {
  const pool = req.app.locals.pool;
  try {
    const { rows } = await pool.query('SELECT id,nome,cpf,created_at FROM pacientes ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erro no servidor' });
  }
};

exports.getPaciente = async (req, res) => {
  const pool = req.app.locals.pool;
  try {
    const { rows } = await pool.query('SELECT * FROM pacientes WHERE id=$1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'paciente nao encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erro no servidor' });
  }
};

exports.updatePaciente = async (req, res) => {
  const pool = req.app.locals.pool;
  try {
    const { rows } = await pool.query('UPDATE pacientes SET nome=$1, telefone=$2, email=$3, updated_at=now() WHERE id=$4 RETURNING id,nome,cpf', [req.body.nome, req.body.telefone, req.body.email, req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'paciente nao encontrado' });
    await pool.query('INSERT INTO audit_logs (usuario_id, action, resource_type, resource_id, details) VALUES ($1,$2,$3,$4,$5)', [req.user?.sub || null, 'update_paciente', 'paciente', req.params.id, JSON.stringify(req.body)]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erro no servidor' });
  }
};

exports.deletePaciente = async (req, res) => {
  const pool = req.app.locals.pool;
  try {
    const { rows } = await pool.query('DELETE FROM pacientes WHERE id=$1 RETURNING id', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'paciente nao encontrado' });
    await pool.query('INSERT INTO audit_logs (usuario_id, action, resource_type, resource_id, details) VALUES ($1,$2,$3,$4,$5)', [req.user?.sub || null, 'delete_paciente', 'paciente', req.params.id, JSON.stringify({})]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erro no servidor' });
  }
};
