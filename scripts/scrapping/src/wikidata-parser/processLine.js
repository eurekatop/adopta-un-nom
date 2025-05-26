function console_log( bufferOutput, message) {
  return bufferOutput += message + "\n";
}

function processLine(line) {
    let bufferOutput = "";


    if (!line.trim().startsWith('{')) return;

    let item;
    try {
      item = JSON.parse(line.replace(/,\s*$/, '')); // treu la coma final si cal
    } catch (err) {
      console.error('Error parsing JSON:', err);
      return;
    }

    const id = item.id;
    const label = item.labels?.es?.value ?? '(sense etiqueta)';
    const description = item.descriptions?.es?.value ?? '(sense descripció)';
    const aliases = Object.values(item.aliases?.es ?? {}).flat() ?? [];

    
    // Properties:
    // instance of
    const p31 = item.claims?.P31?.map(claim =>
      claim.mainsnak?.datavalue?.value?.id
    ).filter(Boolean) ?? [];
    // subclass of
    const p279 = item.claims?.P279?.map(claim =>
      claim.mainsnak?.datavalue?.value?.id
    ).filter(Boolean) ?? [];
    // date of death
    const p570 = item.claims?.P570?.map(claim =>
      claim.mainsnak?.datavalue?.value?.time
    ).filter(Boolean) ?? [];

    // SiteLinks:
    // wikipedia
    const wikiEs = item.sitelinks?.['eswiki']?.title ?? '';
    const wikiEn = item.sitelinks?.['enwiki']?.title ?? '';
    const wikiCat = item.sitelinks?.['cawiki']?.title ?? '';



    // hackish remove is a test: Quan va morir
    //if ( !p570 || !p570.length ) {
    //  return;
    //}

    //if ( !p279.length || (p279.length && !p279.includes("Q19588")) ) { // elemento quimico
    // return;
    //}

    if (id && label && item?.type !== "item" ) {
      bufferOutput = console_log( bufferOutput, `ID: ${id}`);
      bufferOutput = console_log( bufferOutput, `Etiqueta (es): ${label}`);
      bufferOutput = console_log( bufferOutput, `Description (es): ${description}`);
      if (p31.length) {
        bufferOutput = console_log( bufferOutput, `P31 (instance of): ${p31.join(', ')}`);
      }
      if (p279.length) {
        bufferOutput = console_log( bufferOutput, `P279 (subclass of): ${p279.join(', ')}`);
      }
      if (p570.length) {
        bufferOutput = console_log( bufferOutput, `P570 (date of death): ${p570.join(', ')}`);
      }
      if (wikiEs) {
        bufferOutput = console_log( bufferOutput, `Wikipedia (es): https://es.wikipedia.org/wiki/${wikiEs}`);
      }
      if (wikiEn) {
        bufferOutput = console_log( bufferOutput, `Wikipedia (en): https://en.wikipedia.org/wiki/${wikiEn}`);
      }
      if (wikiCat) {
        bufferOutput = console_log( bufferOutput, `Wikipedia (ca): https://ca.wikipedia.org/wiki/${wikiCat}`);
      }
      if (aliases.length) {
        for (const alias of aliases) {
          bufferOutput = console_log( bufferOutput, `Alias (es): ${JSON.stringify(alias)}`);
        }
      }

      bufferOutput = console_log( bufferOutput, '---');
    }

    return bufferOutput ;
}


export  {
  processLine
};