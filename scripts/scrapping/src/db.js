import mariadb from 'mariadb';

export const pool = mariadb.createPool({
     host:  process.env.DATABASE_HOST,
     user:'root', 
     password: process.env.DATABASE_PASSWORD,
     database: 'adopta_un_nom',
     connectionLimit: 5
});


import { createHash } from 'crypto';

/**
 * Genera un ID únic, curt i determinista per a una entrada de diccionari.
 * Exemple: es-bolo-es-noun-WCxB6p~5
 */
export function generateLexicographicalId(entry) {
  const base = `${entry.lang_code}-${entry.word}-${entry.entry_index}-${entry.pos}`;
  const hash = createHash('sha256').update(base).digest('base64url'); // segura per URL i claus
  const short = hash.slice(0, 8); // ajusta la llargada si vols més/menys col·lisions

  return `${entry.word}-${entry.entry_index}-${entry.pos}-${short}`;
}

/////////////// pool.getConnection()
///////////////     .then(conn => {
///////////////     
///////////////       conn.query("SELECT 1 as val")
///////////////         // .then((rows) => {
///////////////         //   console.log(rows); //[ {val: 1}, meta: ... ]
///////////////         //   //Table must have been created before 
///////////////         //   // " CREATE TABLE myTable (id int, val varchar(255)) "
///////////////         //   return conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
///////////////         // })
///////////////         .then((res) => {
///////////////           console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
///////////////           conn.end();
///////////////           pool.end();
///////////////         })
///////////////         .catch(err => {
///////////////           //handle error
///////////////           console.log(err); 
///////////////           conn.end();
///////////////           pool.end();
///////////////         })
///////////////         
///////////////     }).catch(err => {
///////////////       //not connected
///////////////       pool.end();
///////////////     });


export async function insertEntryWithDefinitions(entryData, definitions) {
  let conn;

  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // 1️⃣ Obtenir el següent entry_index per aquesta paraula
    const { word, pos, language_id, entry_index } = entryData;

    // 2️⃣ Generar lexicographical_id
    //const lexicographical_id = `${word}-${pos}-${entry_index}`;
    const lexicographical_id = generateLexicographicalId (entryData);

    // 3️⃣ Inserir entrada principal
    await conn.query(
      `INSERT INTO dictionary_entries
        (entry_index, word, category, pos, language_id, lexicographical_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [entry_index, word, entryData.category || null, pos, language_id, lexicographical_id]
    );

    // 4️⃣ Inserir definicions
    const insertDefinitionQuery = `
      INSERT INTO dictionary_definitions (lexicographical_id, definition_order, definition, language_id)
      VALUES (?, ?, ?, ?)
    `;
    for (let i = 0; i < definitions?.length; i++) {
      await conn.query(insertDefinitionQuery, [
        lexicographical_id,
        i + 1,
        definitions[i].definition,
        language_id
      ]);
    }

    await conn.commit();
    console.log(`✅ Inserted '${word}' [${pos}] (${lexicographical_id}) with ${definitions.length} definitions.`);
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("❌ Transaction failed:", err);
  } finally {
    if (conn) conn.release();
  }
}




