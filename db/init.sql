CREATE TABLE IF NOT EXISTS words (
    id SERIAL PRIMARY KEY,
    word TEXT NOT NULL
);

COPY words(word)
FROM '/docker-entrypoint-initdb.d/words.txt'
WITH (FORMAT text);