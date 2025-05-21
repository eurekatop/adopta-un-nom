import type { APIRoute } from 'astro';
import {  getQuizHandler } from '../../../../lib/getDefinicioDelDia';
import { saveCorrectAnswer } from '../../../../lib/answers';

function shuffle<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  const lang = params.lang;
  try {

    console.log("LANG **************** ", lang);

    const question = await getQuizHandler(id || '', lang || 'ca');

    const answerId = crypto.randomUUID();
    await saveCorrectAnswer(answerId, question.correct);

    if (!question) {
      return new Response('Not found', { status: 404 });
    }

    const data = {
      question: question.question,
      options: shuffle([...question.options]),
      answerId
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
