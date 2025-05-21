import { pool } from './db.ts';
export async function getScore(sessionId: string) {
  const [rows] = await pool.query(
    'SELECT score, total, language_id FROM game_sessions WHERE session_id = ?',
    [sessionId]
  );
  return (rows as any[])[0] || null;
}

export async function saveScore(sessionId: string, languageId: number, score: number, total: number) {
  await pool.execute(
    `INSERT INTO game_sessions (session_id, score, total, language_id)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE score = ?, total = ?`,
    [sessionId, score, total, languageId, score, total]
  );
}