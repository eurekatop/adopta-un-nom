import { getQuizHandler } from '../getDefinicioDelDia';
import { saveCorrectAnswer } from '../answers';

function shuffle<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function getQuestionData(id: string, lang: string) {
  const question = await getQuizHandler(id, lang);

  if (!question) {
    return undefined;
  }

  const answerId : string = crypto.randomUUID();
  await saveCorrectAnswer(answerId, question.correct);

  return {
    question: question.question,
    options: shuffle([...question.options]),
    answerId
  };
}