import type { APIRoute } from "astro";
import { getCorrectAnswer, deleteCorrectAnswer } from '../../lib/answers';
import { getScore, saveScore } from '../../lib/sessionStore';

export const POST: APIRoute = async ({ request }) => {
  const { id, answer, sessionId } = await request.json();
  
  const correct = await getCorrectAnswer(id);

  await deleteCorrectAnswer(id);

  if (!correct) {
    return new Response(JSON.stringify({ error: "Pregunta no trobada" }), { status: 404 });
  }

  const result = answer === correct ? "correcte" : "incorrecte";

  const prevScore = await getScore(sessionId) ?? {
    language_id: 1,
    score: 0,
    total: 0,
  };
  const updatedScore = {
    score: prevScore.score + (result === 'correcte' ? 1 : 0),
    total: prevScore.total + 1,
    language_id: prevScore.language_id,
    sessionId: sessionId
  };
//
  await saveScore(sessionId, updatedScore.language_id, updatedScore.score, updatedScore.total) ;

  const data = {
    correct,
    result,
    score : {
      ...updatedScore
    }
  }

  return new Response(
    JSON.stringify({ ...data })
  , {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};