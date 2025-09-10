cat > services/gryffindor/server.js <<'EOF'
// Gryffindor service
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const {
  DB_HOST = 'localhost',
  DB_USER = 'hp_user',
  DB_PASS = 'hp_pass',
  DB_NAME = 'hp_db',
  HOUSE_NAME = 'Gryffindor',
} = process.env;

const pool = new Pool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  port: 5432,
});

(async function init() {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        house_name VARCHAR(50),
        question_text TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    client.release();
    console.log('Ensured questions table exists');
  } catch (err) {
    console.error('DB init error:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();

app.get('/info', (req, res) => {
  res.json({
    house: HOUSE_NAME,
    short: HOUSE_NAME + ': brave, bold and noble (placeholder).',
    history: 'A short history of ' + HOUSE_NAME + '... (edit in repo/frontend).',
  });
});

app.post('/questions', async (req, res) => {
  const { question } = req.body || {};
  if (!question || !question.toString().trim()) return res.status(400).json({ error: 'question required' });
  try {
    const client = await pool.connect();
    const r = await client.query(
      'INSERT INTO questions(house_name, question_text) VALUES($1,$2) RETURNING id, house_name, question_text, created_at',
      [HOUSE_NAME, question.toString()]
    );
    client.release();
    res.status(201).json(r.rows[0]);
  } catch (err) {
    console.error('insert error', err && err.message ? err.message : err);
    res.status(500).json({ error: 'db error' });
  }
});

app.get('/questions', async (req, res) => {
  try {
    const client = await pool.connect();
    const r = await client.query('SELECT id, house_name, question_text, created_at FROM questions WHERE house_name=$1 ORDER BY created_at DESC LIMIT 100', [HOUSE_NAME]);
    client.release();
    res.json(r.rows);
  } catch (err) {
    console.error('select error', err && err.message ? err.message : err);
    res.status(500).json({ error: 'db error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(HOUSE_NAME + ' service running on ' + PORT));
EOF
