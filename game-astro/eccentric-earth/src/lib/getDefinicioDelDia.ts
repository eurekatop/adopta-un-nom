import { pool } from './db.ts';


async function getDefinition() {
  const conn = await pool.getConnection();
  const [rows] = await conn.query("CALL generate_quiz(3)");
  conn.release();

   const quizStr = rows[0][0].quiz_json; // això és la cadena JSON
   const _quiz = JSON.parse(quizStr);     // ara sí, parsegem

   const quiz = {
      ..._quiz,
      options: JSON.parse(_quiz.options),
   }

  return quiz;
}


export async function getQuizHandler() {
  const quiz = await getDefinition();
  
  
  return {
   ...quiz
  };
}
