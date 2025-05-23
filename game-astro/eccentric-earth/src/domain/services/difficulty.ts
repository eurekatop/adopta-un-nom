import type { Quiz } from '../models/Quiz';

export function scoreQuizDifficulty(quiz: Quiz): number {
  const lengthScore = quiz.question.length / 100;
  const optionScore = quiz.options.length >= 5 ? 1.5 : 1;

  // Maybe check for long/unusual words?
  const rareWordBonus = quiz.options.some(opt => opt.length > 12) ? 1.2 : 1;

  return +(lengthScore * optionScore * rareWordBonus).toFixed(2);
}

/// TODO



/**
 * 
        1. Freqüència de la paraula correcta (f)
        Si la paraula és poc freqüent, probablement és més difícil.

        Fes servir un corpus amb freqüències (pot ser Wiktionary, SUBTLEX, Wikipedia, o el teu propi).

        Escala la freqüència entre 0 i 1 (on 0 és molt comuna, 1 és molt rara).
 */
function freqScore(wordFreq) {
  // Assume wordFreq ∈ [0, MAX_FREQ]
  const maxFreq = 100000;
  return 1 - Math.min(wordFreq / maxFreq, 1);
}

/*
2. Complexitat lèxica de la definició (c)
Amb spaCy pots calcular el nombre de paraules llargues, subordinacions o un score de llegibilitat (si vols ho podem fer amb textstat).
*/

function complexityScore(definition) {
  const nWords = definition.split(" ").length;
  const longWords = definition.split(" ").filter(w => w.length >= 8).length;
  return Math.min(longWords / nWords, 1);
}


/*
3. Similitud mitjana amb distractors (s)
Com més similars siguin les paraules incorrectes a la correcta, més difícil és.

Calcula la mitjana de similitud entre cada distractor i la resposta correcta.

Escala de 0 (gens similars, fàcil) a 1 (molt similars, difícil).
*/

function similarityScore(correct, distractors) {
  const sims = distractors.map(d => getSimilarity(correct, d)); // [0,1]
  return sims.reduce((a, b) => a + b, 0) / distractors.length;
}


/*
4. Fórmula total de dificultat
*/
function estimateDifficulty(wordFreq, definition, correct, distractors) {
  const f = freqScore(wordFreq);
  const c = complexityScore(definition);
  const s = similarityScore(correct, distractors);
  return (0.4 * f + 0.3 * c + 0.3 * s); // Resultat entre 0 (fàcil) i 1 (difícil)
}

/*
🧪 Exemple aplicat (pseudo):
*/

estimateDifficulty(
  wordFreq = 123, // endosar
  definition = "En el juego del tresillo, lograr que haga una segunda baza quien no lleva la contra.",
  correct = "endosar",
  distractors = ["cardio", "resetearse", "enceramiento"]
)

/*
Amb spacy pots fer servir:

import spacy
nlp = spacy.load("es_core_news_md")

def get_similarity(a, b):
    return nlp(a).similarity(nlp(b))

*/



// export function estimateDifficulty(question) {
//   const definitionComplexity = measureDefinitionReadingLevel(question.definition);
//   const targetWordFreq = getWordFrequency(question.correctAnswer);
//   const distractorSimilarity = averageSemanticDistance(question.distractors, question.correctAnswer);
// 
//   // Formula bàsica (exemple):
//   return 0.5 * definitionComplexity + 0.3 * (1 - targetWordFreq) + 0.2 * distractorSimilarity;
// }
// 
// 
// 

/*
🧠 1. Mesura empírica basada en jugadors (el més fiable)
Un cop tens dades d'ús reals, pots fer servir:

Taxa d'encerts: si només un 5% encerta la resposta, és difícil. Si un 80%, és fàcil.

Temps de resposta: preguntes que tarden més a respondre solen ser més difícils.

🔁 Això et permetria fer autotuning de la dificultat basada en estadístiques reals.

📚 2. Estimació lingüística de dificultat (a priori)
Si encara no tens prou jugadors o vols fer-ho abans de tenir dades:

a) Longitud o raresa de la paraula
Pots usar diccionaris com el SUBTLEX-ESP o freqüències del Wiktionary per saber si una paraula és comuna o no.

També podries fer servir FastText o Word2Vec i mirar com n’és de similar semànticament la definició amb la paraula correcta (si tenen poca afinitat, pot ser més difícil).

b) Complexitat lèxica de la definició
Mides com Flesch Reading Ease o bé mirar el nombre de paraules llargues, subordinades, etc.

Com més tècnica sigui una definició, probablement més difícil.

c) Distractors (les altres opcions)
Si les opcions incorrectes són molt properes semànticament o morfològicament (ex: encerar vs encerament), més difícil.

Si una opció és molt “lol” (afenfosmofobia), pot facilitar la tria per eliminació.

🧪 3. Machine learning bàsic
Amb prou preguntes etiquetades (fàcil, mitjana, difícil) o amb dades de jugadors, pots entrenar un model de regressió o classificació per predir dificultat segons:

Longitud de la paraula

Freqüència d’ús

Semblança semàntica entre definició i respostes

Nivell de lectura de la definició

Similaritat entre distractors i resposta correcta

*/



///////// FREQUENCIES /////////
/*

que es aixo ?
Pots usar diccionaris com el SUBTLEX-ESP o freqüències del Wiktionary per saber si una paraula és comuna o no.


ChatGPT ha dit:
Bona! T’explico:

📊 SUBTLEX-ESP
SUBTLEX-ESP és un diccionari de freqüències de paraules en espanyol basat en subtítols de pel·lícules i sèries. Està pensat per reflectir el llenguatge quotidià, i per això és molt usat en psicologia del llenguatge i educació.

Per què és útil?

Reflecteix com de “comuna” és una paraula en l’ús real.

Inclou valors com:

FREQcount: nombre d’aparicions.

Lg10WF: log10 de la freqüència (més estable estadísticament).

CD: diseminació contextual (com d’ampli és el seu ús en contextos diferents).

🔗 Accés gratuït al SUBTLEX-ESP (pots baixar-lo en .csv).

📖 Freqüències del Wiktionary
El Wiktionary conté una secció anomenada Frequency o Usage, depenent de l’idioma, on a vegades s’inclouen etiquetes com:

Top 5000 Spanish words

High-frequency word

Obsolete

També hi ha projectes derivats com:

https://en.wiktionary.org/wiki/Wiktionary:Frequency_lists

O dumps que fan estadístiques sobre les paraules més usades segons Wiktionary, Wikipedia, etc.

Menys fiable que SUBTLEX però pot ser útil si ja tens un corpus del Wiktionary o l’estàs usant com a font principal.

🧰 Per al teu cas:
Et recomano descarregar SUBTLEX-ESP i convertir-lo en un Map<string, number> on string és la paraula i number la seva freqüència.

Quan prepares les preguntes, busques si la paraula hi és i li assignes una dificultat segons com de baixa és la seva freq.

Vols que et passi un script per convertir el CSV de SUBTLEX en JSON usables des del teu joc?

*/