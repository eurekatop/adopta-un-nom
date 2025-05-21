#!/bin/bash
node filtra-jsonl-english.js data/kaikki.org-dictionary-English.jsonl \
  > >(tee output.english.log) \
  2> >(tee error..english.log >&2)
