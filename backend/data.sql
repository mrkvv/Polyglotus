INSERT INTO levels (level_name)
VALUES ('A1'), ('A2'), ('B1'),
       ('B2'), ('C1'), ('C2')
    ON CONFLICT (level_name) DO NOTHING;

INSERT INTO topics (topic_name)
VALUES ('Путешествия'),
       ('Технологии'),
       ('Здоровье и спорт'),
       ('Образование')
    ON CONFLICT (topic_name) DO NOTHING;

INSERT INTO motivational_phrases (phrase)
VALUES ('Маленькие шаги каждый день ведут к большим результатам.'),
       ('Ошибки — это доказательство того, что вы пытаетесь.');

-- Аватарки: вставляем svg прям сюда