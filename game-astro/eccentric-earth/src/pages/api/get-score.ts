import type { APIRoute } from 'astro';
import { getScore } from '../../lib/sessionStore';

export const GET: APIRoute = async ({ url }) => {
  const sessionId = url.searchParams.get('session');
  if (!sessionId) {
    return new Response(JSON.stringify({ error: 'Missing sessionId' }), { status: 400 });
  }

  const score = await getScore(sessionId);
  return new Response(
    JSON.stringify(score || { score: 0, total: 0 }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
