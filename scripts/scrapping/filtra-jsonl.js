const fs = require('fs');
const readline = require('readline');
const fetch = require('node-fetch');
const wtf = require('wtf_wikipedia');

const file = "./data/kaikki.org-dictionary-Catalan.jsonl";

if ( !file && !process.argv[2] ) {
  console.error('Ús: node consulta_definicions.js fitxer.jsonl');
  process.exit(1);
}

const filename = process.argv[2] || file;

const rl = readline.createInterface({
  input: fs.createReadStream(filename),
  crlfDelay: Infinity
});



// Funció per obtenir la definició d'una paraula
// i imprimir-la a la consola

const extractEtimologia = (wikitext) => {
  const match = wikitext.match(/{{-etimologia-}}([\s\S]*?)(?:\n{{-|== )/);
  return match ? match[1].trim() : null;
};
const get_definicions = async (word) => {
  try {
    const url = `https://ca.wiktionary.org/w/api.php?action=query&format=json&prop=revisions&titles=${encodeURIComponent(word)}&rvslots=*&rvprop=content&origin=*`;

    const res = await fetch(url);
    const data = await res.json();
    const page = Object.values(data.query.pages)[0];

    if (!page.revisions) return;

    const wikitext = page.revisions[0].slots.main["*"];
    const doc = wtf(wikitext);
    const etimologia = extractEtimologia(wikitext);

    const text = doc.text().trim();
    if (text) {
      console.log(`********************************************************`);
      console.log(`********************************************************`);
      console.log(`********************************************************`);
      console.log(`********************************************************`);
      console.log(`\n📘 ${word}\n`);
      console.log(wikitext);
      console.log(etimologia);
      console.log(`********************************************************`);
      console.log(`\n\n\n\n\n`);}
  } catch (err) {
    console.error(`********************************************************`);
    console.error(`********************************************************`);
    console.error(`********************************************************`);
    console.error(`********************************************************`);
    console.error(`[[[Error]]] obtenint definició de ${word}:`, err.message);
    console.error(`********************************************************`);
    console.error(`\n\n\n\n\n`);}
};



//const get_definicions = async (word) => {
//  const url = `https://ca.wiktionary.org/w/api.php?action=query&format=json&prop=revisions&titles=${encodeURIComponent(word)}&rvslots=*&rvprop=content&origin=*`;
//
//  try {
//    const res = await fetch(url);
//    const data = await res.json();
//    const page = Object.values(data.query.pages)[0];
//
//    if (!page.revisions) return;
//
//    const wikitext = page.revisions[0].slots.main["*"];
//    const doc = wtf(wikitext);
//
//    const text = doc.text().trim();
//    if (text) {
//      console.log(`\n📘 ${word}\n`);
//      console.log(text);
//    }
//  } catch (err) {
//    console.error(`Error obtenint definició de ${word}:`, err.message);
//  }
//};

// Expressions regulars
const GENTILICI_REGEX = /(í|ès|ina|enc|esa|ins|ívol)$/i;
const COMPOSTA_REGEX = /[^a-zàèéíïòóúüç·ñ\-]/i;
const DEFINICIO_SOSPITOSA = /(relatiu|natural de|pertanyent a)/i;
const PARAULA_SIMPLE_REGEX = /^[\p{L}·]+$/u;

const POS_PERMESOS = [
  'noun',
  'proper-noun',
  'adjective',
  'verb',
  'adverb',
  'interjection',
  'numeral'
];


const readFile = async () => {
  // read file synchronously
  const fileContent = fs.readFileSync(filename, 'utf8');
  // Split the file content into lines
  const lines = fileContent.split('\n');
  // Filter out empty lines
  const nonEmptyLines = lines.filter(line => line.trim() !== '');
  
  const reStartFromLine = 9070;
  for (let i = reStartFromLine; i < nonEmptyLines.length; i++) {
    const line = nonEmptyLines[i];
    try {
      const entry = JSON.parse(line);

      if (!POS_PERMESOS.includes(entry.pos)) continue;
      if (COMPOSTA_REGEX.test(entry.word)) continue;
      if (GENTILICI_REGEX.test(entry.word)) continue;
      if (!PARAULA_SIMPLE_REGEX.test(entry.word)) continue;

      if (
        entry.definitions?.some(def =>
          def.glosses?.some(gloss => DEFINICIO_SOSPITOSA.test(gloss))
        )
      ) continue;

      // Aquí és una paraula vàlida, busquem la definició online
      // espera 1 segon
      await new Promise(resolve => setTimeout(resolve, 100));
      await get_definicions(entry.word);
      //console.log(`${i} - ${entry.word}`);
    } catch (err) {
      // ignora errors de parseig
    }
  }
  

}

( async () => {
  // Processa el fitxer
  await readFile();
})();
