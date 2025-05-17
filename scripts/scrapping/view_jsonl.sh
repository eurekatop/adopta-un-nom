#!/bin/bash

# Verifica que s'ha passat un fitxer com a argument
if [ -z "$1" ]; then
  echo "Ús: $0 fitxer.jsonl"
  exit 1
fi

# Llegeix línia per línia i filtra
while IFS= read -r line; do
  # Rebutja si el mot sembla un gentilici per sufix
  if echo "$line" | grep -qE '"word"\s*:\s*".*(í|ès|ina|enc|esa|ins|ívol)"'; then
    continue
  fi

  # Rebutja si no és un nom comú
  if ! echo "$line" | grep -q '"pos"\s*:\s*"noun"'; then
    continue
  fi

  # Rebutja si la definició conté "relatiu", "natural de", "pertanyent a"
  if echo "$line" | grep -iqE '"glosses"\s*:\s*\[.*(relatiu|natural de|pertanyent a).*"\]'; then
    continue
  fi

  # Si passa tots els filtres, mostra'l bonic
  echo "$line" | json_pp
  echo "---"
done < "$1"
