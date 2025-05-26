use std::fs::OpenOptions;
use std::io::{self, BufRead, Write};
use rayon::prelude::*;
use serde_json::Value;
use rayon::current_thread_index;
use std::time::{Instant};

fn main() {
    let stdin = io::stdin();
    let handle = stdin.lock();

    const BATCH_SIZE: usize = 2_000;
    let mut buffer = Vec::with_capacity(BATCH_SIZE);
    let mut total_lines : usize = 0;
    let start = Instant::now();

    for line in handle.lines() {
        if let Ok(line) = line {
            buffer.push(line);
            if buffer.len() >= BATCH_SIZE {
                total_lines += buffer.len();

                process_batch(buffer.split_off(0));

                // Estimació
                let elapsed = start.elapsed();
                let secs = elapsed.as_secs_f64();
                let lines_per_sec = total_lines as f64 / secs;

                println!(
                    "⏱️  Processades {} línies en {:.1} s ({:.1} línies/s)",
                    total_lines, secs, lines_per_sec
                );
            }
        }
    }

    if !buffer.is_empty() {
        process_batch(buffer);
    }
}

fn process_batch(lines: Vec<String>) {
    lines.par_chunks(1000).for_each(|chunk| {
        // Obtenim l'índex del thread Rayon actual (només val dins .par_iter / .par_chunks)
        let thread_id = current_thread_index().unwrap_or(999);
        let filename = format!("output-thread-{}.txt", thread_id);

        // Obrim en mode append
        let mut file = OpenOptions::new()
            .create(true)
            .append(true)
            .open(&filename)
            .expect("No puc obrir fitxer");

        for line in chunk {
            let trimmed = line.trim();
            if trimmed == "[" || trimmed == "]" || !trimmed.starts_with('{') {
                continue;
            }

            let cleaned = trimmed.trim_end_matches(',');

            if let Ok(json) = serde_json::from_str::<Value>(cleaned) {
                let id = json["id"].as_str().unwrap_or("(sense id)");
                let _type = json["type"].as_str().unwrap_or("(sense type)");
                let label = json["labels"]["es"]["value"].as_str().unwrap_or("(sense etiqueta)");
                let description = json["descriptions"]["es"]["value"].as_str().unwrap_or("(sense descripció)");

                // Si vols filtrar, descomenta:
                // if _type != "item" {
                writeln!(file, "{}\t{}\t{}\t{}", id, _type, label, description).ok();
                // }
            }
        }
    });
}
