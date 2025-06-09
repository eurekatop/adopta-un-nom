#!/bin/bash

DIC_PATH="dictionaries/dictionaries/ca/index.dic"
OUT_FILE="flexions.txt"

if ! command -v hunspell &> /dev/null; then
  echo "❌ Cal instal·lar 'hunspell'"
  exit 1
fi

if [ ! -f "$DIC_PATH" ]; then
  echo "❌ No s'ha trobat el fitxer: $DIC_PATH"
  exit 1
fi

echo "🧠 Extraient flexions del fitxer $DIC_PATH..."
> "$OUT_FILE" # Esborra el fitxer si ja existeix

cut -d '/' -f 1 "$DIC_PATH" | sort -u | while read -r word; do
  # -m mostra totes les flexions
  hunspell -d ca -i utf-8 -m <<< "$word" | grep -v '^@' | grep -v '^\*' >> "$OUT_FILE"
done

# Elimina duplicats i buits
sort -u "$OUT_FILE" | grep -v '^$' > "${OUT_FILE}.tmp"
mv "${OUT_FILE}.tmp" "$OUT_FILE"

echo "✅ Flexions desades a $OUT_FILE"
