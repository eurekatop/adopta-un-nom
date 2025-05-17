#!/bin/bash
set -x

BASE_URL="https://data.commoncrawl.org/crawl-data/CC-MAIN-2024-10"

# Llegeix les rutes des de cc-index.paths
while read -r path; do
  filename=$(basename "$path")

  echo "Descarregant $filename ..."
  curl -s "$BASE_URL/$path" | gunzip -c | grep '"languages":"ca"' | \
    jq -r '.url' >> urls-catala.txt

done < cc-index.paths

echo "Fet! Guarda't les URLs en català a urls-catala.txt"
