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
function extractSemanticCategories(entry) {
  const pos = entry.pos; // e.g. "noun"
  const templates = (entry.head_templates || []).map(t => t.name); // e.g. ["en-noun", "en-verb"]

  // Extra: look for countable/uncountable or transitive/intransitive
  const tags = new Set();
  
  (entry.categories || []).forEach(category => {
    tags.add(category?.name.replace(/ES:/, ''));
  });

  (entry.senses || []).forEach(s => (s.tags || []).forEach(tag => tags.add(tag)));
  (entry.senses || []).forEach(s => (s.raw_tags || []).forEach(tag => tags.add(tag)));
  (entry.senses || []).forEach(s => (s.categories || []).forEach(category => {
    tags.add(category?.name.replace(/ES:/, ''));
  }));

  // Normalize tags
  const semanticTags = Array.from(
    new Set(
      Array.from(tags).map(tag => {
        const regExps = [
          [/^Rimas:.+$/, "Rima"],
          [/^Palabra.+$/, "Palabra"],
          [/^Español-.+$/, "Español-Otro"],
          [/^admite doble sintaxis.+$/, "admite doble sintaxis"],
          [/^Sustantivos.+$/, "Sustantivos"]
        ];
        for (const [pattern, replacement] of regExps) {
          if (pattern.test(tag)) {
            tag = tag.replace(pattern, replacement);
          }
        }
        return tag;
      })
    )
);



  //return [pos, ...grammarTags].join('|| ');
  return [...semanticTags];
}

let acumTotalNouns = 0;
const totalSemanticCategories = {};

const readFileAsync = async () => {
  const rl = readline.createInterface({
    input: fs.createReadStream(filename),
    crlfDelay: Infinity
  });

  const reStartFromLine = 3440;
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

      const semanticCategoriesTags = extractSemanticCategories(entry);
      
      // add if not exists in dictionary
      for(const tag of semanticCategoriesTags){
        if(!totalSemanticCategories[tag]){
          totalSemanticCategories[tag]=1;
        }else{
          totalSemanticCategories[tag]++;
        }
      }


      //semanticCategoriesTags.forEach((tag) => {
      //  if(!totalSemanticCategories.includes(tag)){
      //      totalSemanticCategories.push(tag);
      //  }
      //});

      if (entry.pos !== "noun" && entry.pos !== "verb") continue;
      if (entry.pos === "verb" && entry.pos_title === "Forma verbal") continue;
       

      acumTotalNouns++;

      // extract senses
      const senses = entry.senses || [];
      const sensesFiltered = senses.map ( sense => sense?.glosses?.join(', ') ) ?? [];

      console.log(`${acumTotalNouns} ${i} \t\t ${entry.word} \t\t\t ${entry.pos_title}`);
      sensesFiltered.forEach((sense, index) => {
        console.log(`\t\t\t ${index + 1} - ${sense}`);
      });

      const definitions = sensesFiltered.filter(sense => !!sense).map((sense, index)  => ({
        definition_order: index,
        definition: sense,
        language_id: 1 // Español
      }));

      // await insertEntryWithDefinitions(
      //   {
      //     word: entry.word,
      //     pos: entry.pos,
      //     category: entry.pos_title,
      //     categories: semanticCategoriesTags.join(','),
      //     language_id: 1,
      //     language_code: 'es',
      //     entry_index: i
      //   },
      //   definitions || []
      // )

    //const task = limit(async () => {
    //  console.log(`🚀 Inserint: ${entry.word} (${entry.pos})`);
    //  await insertEntryWithDefinitions(
    //    {
    //      word: entry.word,
    //      pos: entry.pos,
    //      category: entry.pos_title,
    //      language_id: 1,
    //      entry_index: i
    //    },
    //    definitions || []
    //  );
    //  console.log(`✅ Inserida: ${entry.word} (${entry.pos})`);
    //});
    //
    //  tasks.push(task);

      //console.log ( JSON.stringify(entry, null, 2));
      
      console.log ( `\nCategories :  ${entry.word} : ` + semanticCategoriesTags.join(',') );

      console.log( i + '\n----------------------------------');

      //await new Promise(resolve => setTimeout(resolve, 175)); 
    } catch (err) {
      console.error('Error parsing JSON:');
      console.error(err);
      console.error(line);
    }
  }
};

(async () => {
  await readFileAsync();

  console.log ( `\nTotal Categories` );
  
  const sortedCategories = Object.entries(totalSemanticCategories).sort((a, b) => a[1] - b[1]);
  for (const [category, count] of sortedCategories) {
    console.log(`${category}: ${count}`);
  }


  pool.end();
})();

