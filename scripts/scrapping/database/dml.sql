DELETE FROM dictionary_definitions;
DELETE FROM dictionary_entries;
DELETE FROM languages;

INSERT INTO languages (code, name) VALUES 
  ('es', 'Español'),
  ('en', 'Español'),
  ('ca', 'Català');