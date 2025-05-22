import type { APIRoute } from 'astro';
import { getQuestionData } from '../../../../lib/apiHandlers/getQuestionById';

export const GET: APIRoute = async ({ params }) => {
  const id = params.id || '';
  const lang = params.lang || 'ca';

  try {
    const data = await getQuestionData(id, lang);

    if (!data) {
      return new Response('Not found', { status: 404 });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Error carregant la pregunta per ID:', err);
    return new Response('Error', { status: 500 });
  }
};
