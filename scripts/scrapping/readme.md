
python3 -m venv venv
source venv/bin/activate

pip3 install setuptools
pip3 install wiktextract


curl https://dumps.wikimedia.org/cawiktionary/latest/cawiktionary-latest-pages-articles.xml.bz2 > cawiktionary-latest-pages-articles.xml.bz2

mkdir -p ./mnt/data
python -m wiktextract --json --language ca --pages /mnt/data/cawiktionary-latest-pages-articles.xml.bz2 --output ./mnt/data/ca.json


deactivate


wiktwords --json --language ca --pages cawiktionary-latest-pages-articles.xml.bz2 --output ca.jsonl



https://github.com/tatuylonen/wiktextract
https://kaikki.org/dictionary/Catalan/
https://kaikki.org/dictionary/Catalan/kaikki.org-dictionary-Catalan.jsonl






ipus TypeScript per una entrada jsonl
ts
Copia
Modifica
type Definition = {
  glosses: string[];           // Llista de definicions
  examples?: string[];         // Exemples opcionals
  // Altres camps possibles: "tags", "raw_glosses", etc.
};

type Related = {
  word: string;                // Paraula relacionada
  sense?: string;              // Opcional: descripció o glossari
  tags?: string[];             // Ex. ["synonym"]
};

type Entry = {
  word: string;                // La paraula principal
  lang: string;                // "Catalan"
  pos: string;                 // Part of speech: "noun", "verb", etc.
  definitions: Definition[];   // Definicions
  related?: Related[];         // Paraules relacionades (sinònims, antònims, etc.)
  // Altres opcions que pots trobar: "forms", "sounds", "etymology_text", etc.
};
🎯 Exemple d’ús:
ts
Copia
Modifica
const paraula: Entry = {
  word: "llum",
  lang: "Catalan",
  pos: "noun",
  definitions: [
    {
      glosses: ["Radiació visible que pot ser percebuda per l'ull humà"],
      examples: ["La llum del sol il·luminava la sala."]
    }
  ],
  related: [
    { word: "claror", tags: ["synonym"] },
    { word: "foscor", tags: ["antonym"] }
  ]
};





# greps utiles
grep -I "\"word\": \"bolo\", \"pos" /home/rfranr/source/github.com/eurekatop/adopta-un-nom/scripts/scrapping/data/kaikki.org-dictionary-Español.jsonl > temp.jsonl



# download directories
wget -r -np -nH --cut-dirs=1 http://kaikki.org/dictionary/Euskara/
wget https://kaikki.org/dictionary/English/kaikki.org-dictionary-English.jsonl







# documentacion
LLista de propietats Wikidata: https://www.wikidata.org/wiki/Wikidata:List_of_properties
https://johnsamuel.info/wdprop/properties.html
Propietat en particular: https://www.wikidata.org/wiki/Property:P580
Wikidata Property Documentation Tool: https://tools.wmflabs.org/wdpdoc/




# scripts
# wikidata-similar.js ca
Intenta extraer les entrades similars a una determinada entrada de Wikidata mediante la API SparkSQL.
```
  node wikidata-similar.js caballo
```

# wikidata-parse-dump-latest-all.js
Parseja el dump de Wikidata 
El dump es descarrega de: https://dumps.wikimedia.org/wikidatawiki/entities/
Afagarem aques dump: 
https://dumps.wikimedia.org/wikidatawiki/entities/latest-all.json.bz2

cp latest-all.json.bz2 latest-all.json.TEMP-00.bz2 
cat  /media/rfranr/HD320/latest-all.json.TEMP-00.bz2 | bunzip2  | node wikidata-parse-dump-latest-all.js  
cat  /media/rfranr/HD320/wikidata/latest-all.json.TEMP.bz2 | bunzip2  | node wikidata-parse-dump-latest-all.js  
cat  /media/rfranr/HD320/wikidata/latest-all.json.bz2 | bunzip2  | node wikidata-parse-dump-latest-all.js 
cat  /media/rfranr/HD320/wikidata/latest-all.json.bz2 | bunzip2  | node wikidata-parse-dump-latest-all-v01.js 


curl https://dumps.wikimedia.org/wikidatawiki/entities/latest-all.json.bz2 | bunzip2  | node wikidata-parse-dump-latest-all.js 

curl https://dumps.wikimedia.org/wikidatawiki/entities/latest-all.json.bz2 | bunzip2  | node --inspect wikidata-parse-dump-latest-all.js 

# paralleizable
1. 🔥 Usa pbzip2 (paral·lel)
bash
worker
pbzip2 -dc /media/rfranr/HD320/wikidata/latest-all.json.bz2 | node main.js

# extreure properties
bzcat /media/rfranr/HD320/wikidata/latest-all.json.bz2 | jq '
  select(.id == "P31")
  | {
      id: .id,
      label: .labels.ca.value,
      description: .descriptions.ca.value
    }
'

# rust
convert to more fastest format
pbzip2 -kdc latest-all.json.TEMP.bz2 | zstd -v -T6 -o test.zst
then parsex with rust
pzstd -dck -p10  /media/rfranr/HD320/wikidata/test.zst | stdbuf -oL ./target/release/wikidata_parser
