import mysql from "mysql2/promise";

export const pool = mysql.createPool({
     host: process.env.DB_HOST || 'localhost',
     user:'root', 
     password: process.env.DB_PASSWORD || '',
     database: 'adopta_un_nom',
     connectionLimit: 20
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





