import fs from 'fs';
import readline from 'readline';
import pLimit from 'p-limit';
import {insertEntryWithDefinitions, pool} from './src/db.js';
import {exit} from 'process';

const limit = pLimit(5); // màxim 5 a la vegada

const file = "temp.jsonl";

if (!file && !process.argv[2]) {
  console.error('Ús: node consulta_definicions.js fitxer.jsonl');
  process.exit(1);
}

const filename = process.argv[2] || file;

// Expressions regulars
const GENTILICI_REGEX = /(í|ès|ina|enc|esa|ins|ívol)$/i;
const COMPOSTA_REGEX = /[^a-zàèéíïòóúüç·ñ\-]/i;
//const DEFINICIO_SOSPITOSA = /(relatiu|natural de|pertanyent a)/i;
const DEFINICIO_SOSPITOSA = /(forma|natural de|pertanyent a)/i;
const PARAULA_SIMPLE_REGEX = /^[\p{L}·]+$/u;

const POS_PERMESOS = [
  'noun',
  'proper-noun',
  'adjective',
  'adj',
  'verb',
  'adverb',
  'interjection',
  'numeral'
];

function extractGrammar(entry) {
  const pos = entry.pos; // e.g. "noun"
  const templates = (entry.head_templates || []).map(t => t.name); // e.g. ["en-noun", "en-verb"]

  // Extra: look for countable/uncountable or transitive/intransitive
  const tags = new Set();
  (entry.senses || []).forEach(s => (s.tags || []).forEach(tag => tags.add(tag)));

  // Normalize tags
  const grammarTags = Array.from(tags)
    .filter(tag =>
      ['countable', 'uncountable', 'transitive', 'intransitive'].includes(tag)
    );

  return [pos, ...grammarTags].join(', ');
}


let acumTotalNouns = 0;

const readFileAsync = async () => {
  const rl = readline.createInterface({
    input: fs.createReadStream(filename),
    crlfDelay: Infinity
  });

  const reStartFromLine = 0;
  const tasks = [];
  let i = 0;

  for await (const line of rl) {
    i++;
    if (i < reStartFromLine || !line.trim()) continue;

    try {
      const entry = JSON.parse(line);

      if (!POS_PERMESOS.includes(entry.pos)) continue;
      if (COMPOSTA_REGEX.test(entry.word)) continue;
      if (GENTILICI_REGEX.test(entry.word)) continue;
      if (!PARAULA_SIMPLE_REGEX.test(entry.word)) continue;

      if (
        entry.senses?.some(def =>
          def.glosses?.some(gloss => DEFINICIO_SOSPITOSA.test(gloss))
        )
      ) exit;

      const grammarTags = extractGrammar(entry);

      if (entry.pos !== "noun" && entry.pos !== "verb") continue;
      if (entry.pos === "verb" && grammarTags !== "verb") continue;
      //if (entry.pos === "verb") continue;
       

      acumTotalNouns++;

      // extract senses
      const senses = entry.senses || [];
      const sensesFiltered = senses.map ( sense => sense?.glosses?.join(', ') ) ?? [];

      // categories
      // console.log("Categories:");
      // entry.senses?.forEach(sense => {
      //     sense.categories?.forEach(category => {
      //       console.log(`\t\t\t ${category.name}`);
      //     });
      // });
      // console.log("\n");

      //console.log(`Gramática: ${grammarTags}`);

      //console.log ( JSON.stringify(entry, null, 2) + "\n\n");
      console.log(`${acumTotalNouns} ${i} \t\t ${entry.word} \t\t\t ${grammarTags}`);
      sensesFiltered.forEach((sense, index) => {
        console.log(`\t\t\t ${index + 1} - ${sense}`);
      });

      const definitions = sensesFiltered.filter(sense => !!sense).map((sense, index)  => ({
        definition_order: index,
        definition: sense,
        language_id: 2 // Español
      }));

      //await insertEntryWithDefinitions(
      // {
      //     word: entry.word,
      //     pos: entry.pos,
      //     category: entry.pos_title,
      //     language_id: 1, // Español
      // },
      // definitions
      //)

      const entryIndex = i + 0;
      const task = limit(async () => {
        console.log(`🚀 Inserint: ${entry.word} (${entry.pos} ${grammarTags} ${entryIndex})`);
        await insertEntryWithDefinitions(
          {
            word: entry.word,
            pos: entry.pos,
            category: grammarTags,
            language_id: 2,
            language_code: 'en',
            entry_index: entryIndex
          },
          definitions || []
        );
        console.log(`✅ Inserida: ${entry.word} (${entry.pos})`);
      });

      tasks.push(task);

      
      console.log( i + '\n----------------------------------');

      await new Promise(resolve => setTimeout(resolve, 175)); 
    } catch (err) {
      console.error('Error parsing JSON:');
      console.error(err);
      console.error(line);
    }
  }
};

(async () => {
  await readFileAsync();
  pool.end();
})();
