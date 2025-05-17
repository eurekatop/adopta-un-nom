#!/bin/bash

echo "Input file: $1"
FILEPATH="$1"

# Read from a file or STDIN
while IFS=$' ' read -r surt timestamp json; do
  langs=$(echo "$json" | jq -r '.languages // empty')
  if [[ "$langs" == *cat* ]]; then
    url=$(echo "$json" | jq -r '.url')
    echo "URL: $url"
    echo "Languages: $langs"
    echo "--------"
  fi
done < "$FILEPATH"
