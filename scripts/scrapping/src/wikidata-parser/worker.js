import { parentPort } from 'worker_threads';
import { processLine } from './processLine.js';

/// parentPort.on('message', (line) => {
///   try {
///     if (!line.trim().startsWith('{')) return;
/// 
///     const item = JSON.parse(line.replace(/,\s*$/, ''));
///     const id = item.id;
///     const label = item.labels?.es?.value ?? '(sense etiqueta)';
///     const description = item.descriptions?.es?.value ?? '(sense descripció)';
/// 
///     // Només un resum per exemple
///     parentPort.postMessage({ id, label, description });
///   } catch (err) {
///     parentPort.postMessage({ error: err.message });
///   }
/// });


parentPort.on('error', (err) => {
  console.error('Worker error:', err);
});


//parentPort.on('message', async (line ) => {
//  const data = await processLine(line);
//  parentPort.postMessage({ data:data });
//});


parentPort.on('message', async (lines) => {
  //const results = [];

  //for (const line of lines) {
  //  try {
  //    const data = await processLine(line);
  //    if (data) results.push(data);
  //    //results.push({
  //    //  line: line
  //    //});
  //  } catch (err) {
  //    results.push({ error: err.message });
  //  }
  //}

  const results = await Promise.all(lines.map(line => processLine(line)));
  const filteredResults = results.filter(result => result !== null && result !== "") ;



//
  parentPort.postMessage({ data: filteredResults });
});