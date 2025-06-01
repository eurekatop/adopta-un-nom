import { pool } from './db.ts';
import {generateSimilarTerms} from './getWikiData.ts';


async function getDefinition(seed:string, lang:number) : Promise<{
  question: string,
  correct: string,
  options: string[],
}> {
  const numDistractors = 3;

  // sanitize seed to remove any non-alphanumeric characters and convert it to lowercase
  seed = seed.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() + lang;

  const conn = await pool.getConnection();
  const [rows] = await conn.query(`CALL generate_quiz_2(${numDistractors}, ${lang}, '${seed}')`);
  conn.release();

   const quizStr = rows[0][0].quiz_json; 
   const _quiz = JSON.parse(quizStr);    

   const quiz = {
      ..._quiz,
      options: JSON.parse(_quiz.options),
   }

  return quiz;
}


export async function getQuizHandler(seed: string, lang: string) {
  const attempts = 3;
  let attemptCount = 1;
  let quiz;
  let _seed = seed;
  do {

    try {
      const mapLanguageToInt = {
        'ca': 3,
        'es': 1,
        'en': 2,
      };

      quiz = await getDefinition(_seed, mapLanguageToInt[lang]);
      if ( quiz.question )
        break; 
      else {
         _seed = `${seed}#${attemptCount}`
         throw new Error('Invalid definition');
      }
    } catch (error) {
      console.error(`Intent ${attemptCount} fallat. Intentant de nou...`);
      if (attemptCount === attempts) throw error; // Si hem arribat al número màxim d'intents, llançem l'error.
    }
    attemptCount++;
  } while (true);
  
  
  let similarTerms : string[] = [];
  // try {
  //   const _similarTerms = await generateSimilarTerms(quiz.correct);
  //   similarTerms = _similarTerms.filter((term:string)=>  !term.startsWith('Q')  );
  // }
  // catch(error){
  //   console.log(error.message);
  // }
  
  
  const _quiz =  {
    question: quiz.question,
    correct: quiz.correct,
    options: [...quiz.options, ...similarTerms],
  }


  return _quiz;
}
