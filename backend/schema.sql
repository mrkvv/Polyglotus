CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE levels (
    id SERIAL PRIMARY KEY,
    level_name VARCHAR(10) UNIQUE NOT NULL
);

CREATE TABLE avatars (
    id SERIAL PRIMARY KEY,
    avatar TEXT NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    yandex_id VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    level_id INTEGER REFERENCES levels(id) ON DELETE SET NULL,
    avatar_id INTEGER REFERENCES avatars(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE topics (
    id SERIAL PRIMARY KEY,
    topic_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE user_topics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_topic UNIQUE (user_id, topic_id)
);

CREATE TABLE user_streaks (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_training_date DATE
);

CREATE TABLE chat_messages(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    content TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'LLM')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE motivational_phrases(
    id SERIAL PRIMARY KEY,
    phrase TEXT NOT NULL
);

CREATE TABLE words(
    id SERIAL PRIMARY KEY,
    en VARCHAR(255) UNIQUE NOT NULL,
    embedding VECTOR(384) DEFAULT NULL
);

CREATE TABLE translations(
    id SERIAL PRIMARY KEY,
    ru VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE dictionary(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    word_id INTEGER REFERENCES words(id) NOT NULL,
    translation_id INTEGER REFERENCES translations(id) NOT NULL,
    part_of_speech VARCHAR(50) NOT NULL,
    progress_count INTEGER DEFAULT 0 NOT NULL,
    status VARCHAR(50) CHECK (status IN ('UNLEARNED', 'LEARNED')) DEFAULT 'UNLEARNED',
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_dictionary_record UNIQUE (user_id, word_id, translation_id, part_of_speech)
);

CREATE TABLE daily_words(
    date DATE PRIMARY KEY,
    word_id INTEGER REFERENCES words(id) NOT NULL,
    translation_id INTEGER REFERENCES translations(id) NOT NULL
);

CREATE INDEX idx_chat_messages_user ON chat_messages(user_id);
CREATE INDEX idx_dictionary_user ON dictionary(user_id);
CREATE INDEX idx_user_topics_user ON user_topics(user_id);

CREATE INDEX idx_words_embedding ON words
    USING hnsw (embedding vector_cosine_ops);
