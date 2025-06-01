import { getQuizHandler } from '../getDefinicioDelDia';
import { saveCorrectAnswer } from '../answers';
import { getDistractors } from '../../domain/services/lllmgroq';

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



  const distractors = await getDistractors( question.correct, question.question, lang );

  const filteredDistractors = new Set( [
    ...question.options,
    ...distractors
  ]
  );


  const _question = {
    ...question,
    options: [
      ...filteredDistractors
    ]
  }



  const answerId : string = crypto.randomUUID();
  await saveCorrectAnswer(answerId, _question.correct);

  return {
    question: _question.question,
    options: shuffle([..._question.options]),
    answerId
  };
}