DROP PROCEDURE IF EXISTS generate_quiz;

DELIMITER //


CREATE PROCEDURE generate_quiz(IN num_words INT)
BEGIN
  DECLARE i INT DEFAULT 0;
  DECLARE chosen_index INT;
  DECLARE chosen_lex VARCHAR(500);
  DECLARE chosen_word VARCHAR(255);
  DECLARE current_lex VARCHAR(500);
  DECLARE current_word VARCHAR(255);
  DECLARE def TEXT;
  DECLARE opt_json JSON DEFAULT JSON_ARRAY();

  -- Taula temporal per guardar opcions
  CREATE TEMPORARY TABLE IF NOT EXISTS temp_options (
    pos INT AUTO_INCREMENT PRIMARY KEY,
    lexicographical_id VARCHAR(500),
    word VARCHAR(255)
  ) ENGINE=MEMORY;

  DELETE FROM temp_options;

  -- Recollim paraules aleatòries vàlides
  WHILE i < num_words DO
    SELECT lexicographical_id, word
    INTO current_lex, current_word
    FROM dictionary_entries
    WHERE category NOT LIKE 'Forma%'
      AND word NOT IN (
        SELECT word FROM blacklisted_words WHERE language_id = 1
      )
    ORDER BY RAND()
    LIMIT 1;

    INSERT INTO temp_options (lexicographical_id, word)
    VALUES (current_lex, current_word);

    SET i = i + 1;
  END WHILE;

  -- Triem una posició com a correcta
  SET chosen_index := FLOOR(RAND() * num_words) + 1;

  -- Obtenim la lexicographical_id i la paraula correcta
  SELECT lexicographical_id, word
  INTO chosen_lex, chosen_word
  FROM temp_options
  WHERE pos = chosen_index;

  -- Busquem definició aleatòria d'aquesta paraula
  SELECT definition
  INTO def
  FROM dictionary_definitions
  WHERE lexicographical_id = chosen_lex
  ORDER BY RAND()
  LIMIT 1;

  -- Construïm el JSON_ARRAY amb JSON_ARRAY_APPEND
  SET i = 1;
  WHILE i <= num_words DO
    SELECT word INTO current_word FROM temp_options WHERE pos = i;
    SET opt_json = JSON_ARRAY_APPEND(opt_json, '$', current_word);
    SET i = i + 1;
  END WHILE;

  -- Retornem JSON final
  SELECT JSON_OBJECT(
    'question', def,
    'options', opt_json,
    'correct', chosen_word
  ) AS quiz_json;

  DROP TEMPORARY TABLE IF EXISTS temp_options;
END //

DELIMITER ;
