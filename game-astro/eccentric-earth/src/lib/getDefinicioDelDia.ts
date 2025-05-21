import { pool } from './db.ts';
import {generateSimilarTerms} from './getWikiData.ts';


async function getDefinition(seed:string, lang:number) {
  // sanitize seed to remove any non-alphanumeric characters and convert it to lowercase
  seed = seed.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() + lang;

  const conn = await pool.getConnection();
  const [rows] = await conn.query(`CALL generate_quiz_2(7, ${lang}, '${seed}')`);
  conn.release();

   const quizStr = rows[0][0].quiz_json; // això és la cadena JSON
   const _quiz = JSON.parse(quizStr);     // ara sí, parsegem

   const quiz = {
      ..._quiz,
      options: JSON.parse(_quiz.options),
   }

  return quiz;
}


export async function getQuizHandler(id: string, lang: string) {
  const attempts = 5;
  let attemptCount = 1;
  let quiz;
  do {
    try {
      const mapLanguageToInt = {
        'ca': 3,
        'es': 1,
        'en': 2,
      };

      quiz = await getDefinition(id, mapLanguageToInt[lang]);
      if ( quiz.question )
        break; 
      else
         throw new Error('No s\'ha pogut generar el quizz');
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
