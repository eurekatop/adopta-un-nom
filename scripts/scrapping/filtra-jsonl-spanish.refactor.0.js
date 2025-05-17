const fs = require('fs');
const readline = require('readline');
const {insertEntryWithDefinitions,pool} = require('./src/db');
const { exit } = require('process');


const file = process.argv[2];
if (!file) {
  console.error('Ús: node process_dictionary.js fitxer.jsonl');
  process.exit(1);
}

// Reglas de filtratge
const POS_PERMESOS = ['noun', 'verb'];
const COMPOSTA_REGEX = /[^a-zàèéíïòóúüç·ñ\-]/i;
const PARAULA_SIMPLE_REGEX = /^[\p{L}·]+$/u;

// Obté el següent entry_index per paraula i idioma
async function getNextEntryIndex(word, language_id) {
  const conn = await pool.getConnection();
  const [{ next_index }] = await conn.query(
    `SELECT COALESCE(MAX(entry_index), 0) + 1 AS next_index
     FROM dictionary_entries
     WHERE word = ? AND language_id = ?`,
    [word, language_id]
  );
  conn.release();
  return next_index;
}

const readFileAsync = async () => {
  const rl = readline.createInterface({
    input: fs.createReadStream(file),
    crlfDelay: Infinity
  });

  let i = 0;
  for await (const line of rl) {
    i++;
    if (!line.trim()) continue;

    try {
      const entry = JSON.parse(line);

      if (!POS_PERMESOS.includes(entry.pos)) continue;
      if (COMPOSTA_REGEX.test(entry.word)) continue;
      if (!PARAULA_SIMPLE_REGEX.test(entry.word)) continue;
      if (!Array.isArray(entry.senses)) continue;

      for (const sense of entry.senses) {
        if (!sense.id || !Array.isArray(sense.glosses)) continue;

        const glosses = sense.glosses.join(', ').trim();
        if (!glosses) continue;

        const lexicographical_id = sense.id;
        const entry_index = await getNextEntryIndex(entry.word, 1);

        if ( entry.word !== "bolo" )
          continue;
        await insertEntryWithDefinitions(
          {
            lexicographical_id,
            word: entry.word,
            entry_index,
            pos: entry.pos,
            category: entry.pos_title || null,
            language_id: 1 // Español
          },
          [
            {
              definition_order: 1,
              definition: glosses,
              language_id: 1
            }
          ]
        );

        console.log(`${i}: Inserted ${entry.word} (${entry.pos}) → ${glosses}`);
      }
    } catch (err) {
      console.error(`❌ Error línia ${i}:`, err.message);
    }
  }

  await pool.end();
};

(async () => {
  await readFileAsync();
})();
