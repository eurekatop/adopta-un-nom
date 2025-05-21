//const fetch = require("node-fetch");
import fetch from "node-fetch";

// async function getWikidataQID(term, lang = 'es') {
//   const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(term)}&language=${lang}&format=json`;
//   const res = await fetch(url);
//   const data = await res.json();
//   return data.search?.[0]?.id || null;
// }



/**
 * Retorna les subclasses d'una classe semàntica de Wikidata.
 * @param {string} qid - El QID de la classe semàntica (ex: "Q7432")
 * @param {boolean} recursive - Si true, recursiu amb P279*; si false, només directes
 * @param {number} limit - Nombre màxim de subclasses retornades
 * @returns {Promise<Array<{ qid: string, label: string }>>}
 */
async function getSubclassesOf(qid, recursive = true, limit = 10) {
  const path = recursive ? "wdt:P279*" : "wdt:P279";

  const sparql = `
    SELECT DISTINCT ?subclass ?subclassLabel WHERE {
      ?subclass ${path} wd:${qid} .
      FILTER(?subclass != wd:${qid})
      SERVICE wikibase:label { bd:serviceParam wikibase:language "es,en". }
    }
    LIMIT ${limit}
  `;

  const url = "https://query.wikidata.org/sparql";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/sparql-query",
      "Accept": "application/sparql-results+json",
      "User-Agent": "wikidata-similar-bot/1.0 (https://eurekatop.com)"
    },
    body: sparql
  });

  const json = await res.json();
  return json.results.bindings.map(b => ({
    qid: b.subclass.value.split('/').pop(),
    label: b.subclassLabel.value
  }));
}

async function getLabelAndDescription(qid, lang = 'es') {
  const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${qid}&languages=${lang}&format=json&props=labels|descriptions`;
  const res = await fetch(url);
  const json = await res.json();
  const entity = json.entities[qid];

  const label = entity.labels?.[lang]?.value || '❓';
  const description = entity.descriptions?.[lang]?.value || '❓';

  return { label, description };
}

/// async function getWikidataQID(term, lang = 'es') {
///   const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(term)}&language=${lang}&format=json`;
///   const res = await fetch(url);
///   const data = await res.json();
/// 
///   const preferides = data.search.filter(entry =>
///     entry.description &&
///     /(mineral|gema|material|sustancia)/i.test(entry.description)
///   );
/// 
///   const entry = preferides[0] || data.search?.[0];
///   return entry?.id || null;
/// }



/**
 * Retorna una llista d'instàncies d'una classe semàntica (amb subclasses).
 * @param {string} classQID - Ex: "Q7432" (instrumento musical)
 * @param {number} limit - Nombre màxim d'elements a retornar (opcional, per defecte 10)
 * @returns {Promise<string[]>} - Llista de noms (labels) d'entitats instància d'aquesta classe
 */
async function getInstancesOfSemanticClass(classQID, limit = 10) {
  const sparql = `
    SELECT DISTINCT ?item ?itemLabel WHERE {
      ?item wdt:P31/wdt:P279* wd:${classQID} .
      SERVICE wikibase:label { bd:serviceParam wikibase:language "es,en". }
    }
    LIMIT ${limit}
  `;

  const url = "https://query.wikidata.org/sparql";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/sparql-query",
      "Accept": "application/sparql-results+json",
      "User-Agent": "wikidata-similar-bot/1.0 (https://eurekatop.com)"
    },
    body: sparql
  });

  const json = await res.json();
  return json.results.bindings.map(b => b.itemLabel.value);
}

async function getWikidataQID(term, lang = 'es') {
  const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(term)}&language=${lang}&format=json`;
  const res = await fetch(url);
  const data = await res.json();

  console.log("Resultats candidats:");
  data.search.forEach(e =>
    console.log(`- ${e.label} (${e.id}): ${e.description}`)
  );

  // 🔧 NO filtris només minerals
  const preferides = data.search.filter(entry =>
    entry.description 
    //&& !/(nombre|persona|ciudad|localidad)/i.test(entry.description)  // evita noms propis
  );

  const entry = preferides[0] || data.search?.[0];
  return entry?.id || null;
}

async function getFirstClassOfEntity(qid) {
  const sparql = `
    SELECT ?class WHERE {
      wd:${qid} wdt:P31 ?class .
    } LIMIT 1
  `;
  const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}`;
  const res = await fetch(url, { headers: { Accept: "application/sparql-results+json" } });
  const json = await res.json();
  return json.results.bindings[0]?.class?.value?.split('/').pop() || null;
}


async function getAllClassesOfEntity(qid) {
  const sparql = `
    SELECT DISTINCT ?class WHERE {
      wd:${qid} wdt:P31 ?class .
    }
  `;
  const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}`;
  const res = await fetch(url, {
    headers: { Accept: "application/sparql-results+json" }
  });
  const json = await res.json();
  return json.results.bindings.map(b => b.class.value.split('/').pop());
}

async function getSimilarTermsFromClass(classQID, excludeQID) {
  const sparqlQuery = `
    SELECT DISTINCT ?item ?itemLabel WHERE {
      ?item wdt:P31/wdt:P279* wd:${classQID} .
      FILTER(?item != wd:${excludeQID})
      SERVICE wikibase:label {
        bd:serviceParam wikibase:language "es,en".
      }
    }
    LIMIT 10
  `;
  const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparqlQuery)}`;
  const res = await fetch(url, {
    headers: { Accept: "application/sparql-results+json" },
  });
  const json = await res.json();
  return json.results.bindings.map(b => b.itemLabel.value);
}

export async function generateSimilarTerms(word) {
  const qid = await getWikidataQID(word);
  if (!qid) {
    console.error(`No s'ha trobat QID per "${word}"`);
    return [];
  }

  console.log(`QID de "${word}": ${qid}`);

  const classQID = await getFirstClassOfEntity(qid);
  if (!classQID) {
    console.error(`No s'ha pogut obtenir la classe per "${word}"`);
    return [];
  }

  getSubclassesOf(qid).then(results => {
    console.log(`Subclasses de ${qid}:`);
    results.forEach(c => console.log(`- ${c.qid}: ${c.label}`));
  });




  console.log(`Classe semàntica: ${classQID}`);
  getLabelAndDescription(classQID).then(console.log);

  const classes = await getAllClassesOfEntity(qid); // diamante
  console.log(`Classes : ${classes.join(', ')}`);
  for (const c of classes) {
    const description = await getLabelAndDescription(c);
    console.log(`|| ${c}: ${description.label} - ${description.description}`);

    try {
      const instances = await getInstancesOfSemanticClass(c);
      console.log(instances.length > 5 && `${instances.slice(0, 5)}, ...` || instances);
    } catch (error) {
      console.error(error.message);
    }

  }
  


  const similars = await getSimilarTermsFromClass(classQID, qid);
  console.log(`Paraules similars a "${word}":`, similars.slice(0, 9));
  return similars;
}

// Exemple d'ús:
// const word = process.argv[2] || "perro";
// generateSimilarTerms(word);
// També pots provar amb "perro", "avión", "guitarra", etc.
