#!/usr/bin/env node

import { error } from 'console';
import { read } from 'fs';
import readline from 'readline';


let linesProcessed = 0;
const properties = {}
const queueTaks = []
const queueTaksIds = []

const addTaskToQueue = (id, task) => {
  if (queueTaksIds.includes(id)) return;
  queueTaksIds.push(id);
  queueTaks.push(task);
}

const runNextTaskInQueue = () => {
  if (queueTaks.length === 0) return; 

  const task = queueTaks.shift();
  task.then(() => runNextTaskInQueue());
}
const globalTimer = setInterval(() => {
  process.stdout.write(`\rTasks left: ${queueTaks.length}, Lines processed: ${linesProcessed}`);
}, 1 * 1000)




// FOR DEBUG
// cat  /media/rfranr/HD320/wikidata/latest-all.json.bz2 | bunzip2  | node --inspect wikidata-parse-dump-latest-all.js
// wait keyprees to start
process.stdin.once('data', async () => {
  // wait 1 second before starting the loop
  //await new Promise(resolve => setTimeout(resolve, 10000));
  main();

});


function processLine(line) {
    linesProcessed++;

    if (!line.trim().startsWith('{')) return;

    let item;
    try {
      item = JSON.parse(line.replace(/,\s*$/, '')); // treu la coma final si cal
    } catch (err) {
      console.error('Error parsing JSON:', err);
      return;
    }

    const id = item.id;
    const label = item.labels?.es?.value ?? '(sense etiqueta)';
    const description = item.descriptions?.es?.value ?? '(sense descripció)';
    const aliases = Object.values(item.aliases?.es ?? {}).flat() ?? [];

    
    // Properties:
    // instance of
    const p31 = item.claims?.P31?.map(claim =>
      claim.mainsnak?.datavalue?.value?.id
    ).filter(Boolean) ?? [];
    // subclass of
    const p279 = item.claims?.P279?.map(claim =>
      claim.mainsnak?.datavalue?.value?.id
    ).filter(Boolean) ?? [];
    // date of death
    const p570 = item.claims?.P570?.map(claim =>
      claim.mainsnak?.datavalue?.value?.time
    ).filter(Boolean) ?? [];

    // SiteLinks:
    // wikipedia
    const wikiEs = item.sitelinks?.['eswiki']?.title ?? '';
    const wikiEn = item.sitelinks?.['enwiki']?.title ?? '';
    const wikiCat = item.sitelinks?.['cawiki']?.title ?? '';



    // hackish remove is a test: Quan va morir
    //if ( !p570 || !p570.length ) {
    //  return;
    //}

    //if ( !p279.length || (p279.length && !p279.includes("Q19588")) ) { // elemento quimico
    // return;
    //}

    if (id && label && item?.type !== "item" ) {
      console.log(`ID: ${id}`);
      console.log(`Etiqueta (es): ${label}`);
      console.log(`Description (es): ${description}`);
      if (p31.length) {
        console.log(`P31 (instance of): ${p31.join(', ')}`);
      }
      if (p279.length) {
        console.log(`P279 (subclass of): ${p279.join(', ')}`);
      }
      if (p570.length) {
        console.log(`P570 (date of death): ${p570.join(', ')}`);
      }
      if (wikiEs) {
        console.log(`Wikipedia (es): https://es.wikipedia.org/wiki/${wikiEs}`);
      }
      if (wikiEn) {
        console.log(`Wikipedia (en): https://en.wikipedia.org/wiki/${wikiEn}`);
      }
      if (wikiCat) {
        console.log(`Wikipedia (ca): https://ca.wikipedia.org/wiki/${wikiCat}`);
      }
      if (aliases.length) {
        for (const alias of aliases) {
          console.log(`Alias (es): ${JSON.stringify(alias)}`);
        }
      }

      console.log('---');
    }
}


function main() {

  const rl = readline.createInterface({
    input: process.stdin,
    crlfDelay: Infinity
  });

  rl.on('line', (line) => {
    processLine(line);
  });

  rl.on('close', () => {
    console.log('\nDone processing.');
  });
}
