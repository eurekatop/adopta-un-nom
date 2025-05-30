#!/bin/bash
mkdir -p public/logos/sm

for img in ./public/logos/*.png; do
  filename=$(basename "$img")
  dest="public/logos/sm/$filename"

  # Example resize command
  convert "$img" -resize 120x "$dest"

  echo "Converted $img → $dest"
done
