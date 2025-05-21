import type { APIRoute } from 'astro';
import { getQuizHandler } from '../../lib/getDefinicioDelDia';

export const GET: APIRoute = async () => {
  try {
    const pregunta = await getQuizHandler();
    return new Response(JSON.stringify(pregunta), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error(err);
    return new Response('Error', { status: 500 });
  }
};
