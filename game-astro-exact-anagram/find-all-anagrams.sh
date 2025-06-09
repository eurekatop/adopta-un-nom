#!/bin/bash

DIC_PATH="dictionaries/dictionaries/ca/index.dic"

if [ ! -f "$DIC_PATH" ]; then
  echo "❌ No s'ha trobat el fitxer $DIC_PATH"
  exit 1
fi

cut -d '/' -f 1 "$DIC_PATH" | sort -u | while read -r word; do
  # Filtra paraules amb menys de 4 lletres
  if [ ${#word} -ge 4 ]; then
    echo "🔍 Buscant anagrames per: $word"
    node get-anagrams-from-dic.js "$word" "$DIC_PATH"
  fi
done
