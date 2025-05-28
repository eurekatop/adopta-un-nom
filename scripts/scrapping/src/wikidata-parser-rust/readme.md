# rust


# compile
cargo build --release

# run
convert to more fastest format
pbzip2 -kdc latest-all.json.TEMP.bz2 | zstd -v -T6 -o test.zst
then parsex with rust
pzstd -dck -p10  /media/rfranr/HD320/wikidata/latest-all.json.formated.as.zst | stdbuf -oL ./target/release/wikidata_parser
