#!/bin/bash
node filtra-jsonl-spanish.js data/kaikki.org-dictionary-Español.jsonl \
  > >(tee output.log) \
  2> >(tee error.log >&2)
