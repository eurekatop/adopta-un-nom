const fs = require('fs');
const readline = require('readline');
const path = require('path');

function sortedKey(word) {
  return word.toLowerCase().split('').sort().join('');
}

async function buildAnagramIndex(dicPath) {
  const anagramDict = {};
  const rl = readline.createInterface({
    input: fs.createReadStream(dicPath, 'utf-8'),
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const word = line.trim().split('/')[0]; // ignore flags like /_E_V_Y
    if (word.length < 4 || word.length > 8) continue;
    if (word[0] !== word[0].toLowerCase()) continue; // Ignora noms propis
    const key = sortedKey(word);
    if (!anagramDict[key]) anagramDict[key] = [];
    if (!anagramDict[key].includes(word.toLowerCase())) {
      anagramDict[key].push(word.toLowerCase());
    }
  }

  return anagramDict;
}

async function main() {
  const word = process.argv[2];
  const dicPath = process.argv[3] || 'index.dic';

  if (!word) {
    console.error('❌ Cal passar una paraula com a argument. Exemple: node get-anagrams-from-dic.js renta index.dic');
    process.exit(1);
  }

  if (!fs.existsSync(dicPath)) {
    console.error(`❌ No s'ha trobat el fitxer: ${dicPath}`);
    process.exit(1);
  }

  console.log(`📖 Llegint diccionari des de ${dicPath}...`);
  const anagramDict = await buildAnagramIndex(dicPath);

  const key = sortedKey(word);
  const anagrams = (anagramDict[key] || []).filter(w => w !== word.toLowerCase());

  if (anagrams.length === 0) {
    console.log(`❗ No s'han trobat anagrames per "${word}"`);
  } else {
    console.log(`🔁 Anagrames de "${word}": ${anagrams.join(', ')}`);
  }
}

// main();


/**
 * Example: node get-anagrams-from-dic.js --all dictionaries/dictionaries/ca/index.dic
 */
if (require.main === module && process.argv[2] === '--all') {
  const dicPath = process.argv[3] || 'index.dic';
  buildAnagramIndex(dicPath).then(anagramDict => {
    const output = {};
    for (const key in anagramDict) {
      if (anagramDict[key].length > 4) {
        anagramDict[key].forEach(word => {
          output[word] = anagramDict[key].filter(w => w !== word);
        });
      }
    }
    
    fs.writeFileSync('all-anagrams.json', JSON.stringify(output, null, 2));
    console.log('✅ Fitxer all-anagrams.json creat');
  });
}





