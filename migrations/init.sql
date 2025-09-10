CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  house_name VARCHAR(50) NOT NULL,
  question_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
