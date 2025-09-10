\
    // Hufflepuff service
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
      HOUSE_NAME = 'Hufflepuff',
    } = process.env;

    const pool = new Pool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
      port: 5432,
    });

    (async function init() {
      const client = await pool.connect();
      try {
        await client.query(`
          CREATE TABLE IF NOT EXISTS questions (
            id SERIAL PRIMARY KEY,
            house_name VARCHAR(50),
            question_text TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `);
        console.log('Ensured questions table exists');
      } finally {
        client.release();
      }
    })();

    app.get('/info', (req, res) => {
      res.json({
        house: HOUSE_NAME,
        short: `${HOUSE_NAME}: placeholder short description.`,
        history: `A short history of ${HOUSE_NAME}... (add more content here).`,
      });
    });

    app.post('/questions', async (req, res) => {
      const { question } = req.body;
      if (!question) return res.status(400).json({ error: 'question required' });
      const client = await pool.connect();
      try {
        const r = await client.query(
          'INSERT INTO questions(house_name, question_text) VALUES($1,$2) RETURNING *',
          [HOUSE_NAME, question]
        );
        res.json(r.rows[0]);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'db error' });
      } finally {
        client.release();
      }
    });

    app.get('/questions', async (req, res) => {
      const client = await pool.connect();
      try {
        const r = await client.query('SELECT * FROM questions WHERE house_name=$1 ORDER BY created_at DESC', [HOUSE_NAME]);
        res.json(r.rows);
      } finally {
        client.release();
      }
    });

    const PORT = 5000;
    app.listen(PORT, () => console.log(HOUSE_NAME + ' service running on ' + PORT));
