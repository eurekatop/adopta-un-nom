#!/bin/bash
set -x
BASE_URL="https://data.commoncrawl.org/cc-index/collections/CC-MAIN-2024-10/indexes"

while read -r file; do
  echo "Descarregant $file ..."
  curl -s "$BASE_URL/$file" | gunzip -c | grep '"languages":"ca"' >> urls-catala.txt
done < cc-index.paths
