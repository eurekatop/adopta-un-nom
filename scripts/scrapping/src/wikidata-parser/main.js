#!/usr/bin/env node

import readline from 'readline';
import { Worker } from 'worker_threads';
import os from 'os';

const maxWorkers = os.availableParallelism?.() || 10;
const idleWorkers = [];
const running = new Set();
const BATCH_SIZE = 5000;

let linesProcessed = 0;

const queue = [];

function createWorker() {
  const worker = new Worker('./worker.js', { type: 'module' });
  worker.on('message', (msg) => {
    running.delete(worker);
    idleWorkers.push(worker);

    if (msg.error) {
      console.error(`Error: ${msg.error}`);
    } else {
      if ( msg.data?.length > 0 ) {
        process.stdout.write(`Lines processed: ${JSON.stringify(msg)}`);
        process.stdout.write(`Lines processed: ${linesProcessed}\n`);
      }
    }

    dispatch();
  });

  worker.on('error', (err) => {
    console.error('Worker error:', err);
  });

  return worker;
}

function dispatch() {
  while (idleWorkers.length && queue.length >= BATCH_SIZE) {
    const lines = queue.splice(0, BATCH_SIZE);
    const worker = idleWorkers.pop();
    running.add(worker);
    worker.postMessage(lines);
  }
}

for (let i = 0; i < maxWorkers; i++) {
  idleWorkers.push(createWorker());
}

const rl = readline.createInterface({
  input: process.stdin,
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  linesProcessed++;

  if ( linesProcessed % BATCH_SIZE == 0  ) {
      process.stdout.write(`\rLines send: ${linesProcessed}\n`);
  }


  queue.push(line);
  dispatch();
});

rl.on('close', () => {
  const interval = setInterval(() => {
    process.stdout.write(`\rLines processed: ${linesProcessed}, queue: ${queue.length}, active: ${running.size}`);
    if (queue.length === 0 && running.size === 0) {
      clearInterval(interval);
      process.stdout.write('\n✅ Tot processat.\n');
      process.exit(0);
    }
  }, 1000);
});
