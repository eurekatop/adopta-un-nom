use adopta_un_nom;

DROP TABLE IF EXISTS dictionary_definitions;

DROP TABLE IF EXISTS dictionary_entries;

DROP TABLE IF EXISTS languages;

-- 🌍 Taula de llengües
CREATE TABLE languages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,     -- ex: 'es', 'en'
    name VARCHAR(100) NOT NULL            -- ex: 'Español', 'English'
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- 📘 Taula d’entrades del diccionari
CREATE TABLE dictionary_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,         -- ID únic global (clau primària)
    entry_index INT NOT NULL,                  -- 👈 Número d’entrada per la paraula (1, 2, 3...)
    word VARCHAR(100) NOT NULL,
    category VARCHAR(255),
    pos VARCHAR(30),
    language_id INT NOT NULL,
    lexicographical_id VARCHAR(500) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (language_id) REFERENCES languages(id)
        ON DELETE RESTRICT,
    UNIQUE (word, language_id, entry_index),   -- 👈 Evita dupes
    INDEX idx_lookup (word, language_id, pos)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- 📖 Taula de definicions associades
CREATE TABLE dictionary_definitions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lexicographical_id VARCHAR(500) NOT NULL,         -- FK lògica
    definition_order INT NOT NULL,                    -- 1, 2, 3...
    definition TEXT NOT NULL,
    language_id INT NOT NULL,                         -- ex: definició traduïda
    FOREIGN KEY (lexicographical_id) REFERENCES dictionary_entries(lexicographical_id)
        ON DELETE CASCADE,
    FOREIGN KEY (language_id) REFERENCES languages(id)
        ON DELETE RESTRICT
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;


CREATE TABLE blacklisted_words (
    id INT AUTO_INCREMENT PRIMARY KEY,
    word VARCHAR(255) NOT NULL,
    language_id INT NOT NULL,
    UNIQUE KEY uniq_word_lang (word, language_id),
    FOREIGN KEY (language_id) REFERENCES languages(id)
        ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE game_sessions (
  session_id VARCHAR(36) PRIMARY KEY,
  score INT DEFAULT 0,
  total INT DEFAULT 0,
  language_id INT NOT NULL,                         
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);




INSERT INTO languages (code, name) VALUES 
  ('es', 'Español'),
  ('en', 'Anglès'),
  ('ca', 'Català');