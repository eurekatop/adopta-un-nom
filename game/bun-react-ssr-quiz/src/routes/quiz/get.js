import mysql from "mysql2/promise";

const pool = mysql.createPool({
     host: process.env.DB_HOST || 'localhost',
     user:'root', 
     password: process.env.DB_PASSWORD || '',
     database: 'adopta_un_nom',
     connectionLimit: 5
});

pool.on('acquire', (connection) => {
   console.log(`Connection ${connection.threadId} acquired`);
});

pool.on('release', (connection) => {
   console.log(`Connection ${connection.threadId} released`);
});

pool.on('enqueue', () => {
   console.log('Waiting for available connection slot');
});

pool.on('error', (err) => {
   console.error(err);
});





export async function getQuizHandler() {
  const conn = await pool.getConnection();
  const [rows] = await conn.query("CALL generate_quiz(3)");
  conn.release();

   const quizStr = rows[0][0].quiz_json; // això és la cadena JSON
   const _quiz = JSON.parse(quizStr);     // ara sí, parsegem

   const quiz = {
      ..._quiz,
      options: JSON.parse(_quiz.options),
   }

  
  return {
   ...quiz
  };
}
