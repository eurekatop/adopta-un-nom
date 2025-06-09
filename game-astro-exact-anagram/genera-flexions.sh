#!/bin/bash

# === Configura el nom de l'idioma i els fitxers ===
LANG="ca"
DIC="${LANG}.dic"
AFF="${LANG}.aff"
ZH="compiled-${LANG}.zhfst"

# === Comprovació d'existència de fitxers ===
if [ ! -f "$DIC" ] || [ ! -f "$AFF" ]; then
  echo "❌ No s'han trobat els fitxers $DIC i $AFF al directori actual"
  exit 1
fi

# === Compila el diccionari hunspell a format zhfst ===
echo "⚙️ Compilant $DIC i $AFF a $ZH..."
hfst-ospell convert "$AFF" "$DIC" -o "$ZH"
if [ $? -ne 0 ]; then
  echo "❌ Error durant la compilació amb hfst-ospell"
  exit 1
fi

# === Processa totes les paraules del diccionari i genera les flexions ===
echo "📤 Generant flexions..."
mkdir -p output
cut -d '/' -f1 "$DIC" | sort -u | while read -r word; do
  echo "🔎 $word" >> output/flexions.txt
  echo "$word" | hfst-ospell -s "$ZH" | grep -Eo '\b\w+\b' >> output/flexions.txt
  echo "" >> output/flexions.txt
done

echo "✅ Flexions generades a output/flexions.txt"
