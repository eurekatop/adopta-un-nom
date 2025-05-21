import type { APIRoute } from 'astro';
import { pool } from '../../lib/db';

export const GET: APIRoute = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT session_id, score, total, updated_at
      FROM game_sessions
      WHERE score > 0
      ORDER BY score DESC, total ASC
      LIMIT 20
    `);

    return new Response(
      JSON.stringify(rows),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error loading ranking:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};
