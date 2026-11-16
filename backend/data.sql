INSERT INTO levels (level_name, level_description)
VALUES ('A1', 'Начинаю с нуля'), ('A2', 'Знаю основы'),
       ('B1', 'Могу поддержать беседу'),('B2', 'Говорю уверенно'),
       ('C1', 'Свободно владею'), ('C2', 'Уровень носителя')
    ON CONFLICT (level_name) DO NOTHING;

INSERT INTO topics (topic_name)
VALUES ('Путешествия'),
       ('Технологии'),
       ('Здоровье и спорт'),
       ('Образование')
    ON CONFLICT (topic_name) DO NOTHING;

INSERT INTO motivational_phrases (phrase)
VALUES ('Today is a great day to learn.'),
       ('Challenge yourself today.'),
       ('Keep going, you''re doing great!'),
       ('Every new word you learn is a step closer to fluency.'),
       ('Learning English opens doors to the whole world.'),
       ('Practice makes perfect. Keep practicing!'),
       ('Don''t be afraid to make mistakes. That''s how you learn!'),
       ('One word at a time, one day at a time.'),
       ('You are building a great habit. Keep it up!'),
       ('A little progress each day adds up to big results.'),
       ('Consistency is the key to fluency. Keep going!'),
       ('Show up for yourself today.'),
       ('Your daily practice is your superpower.'),
       ('Mistakes are just stepping stones to success.'),
       ('Believe in your progress.'),
       ('Imagine where English will take you.'),
       ('Your future self will thank you for practicing today.'),
       ('Ready for today''s challenge?'),
       ('Keep shining!'),
       ('Let''s learn something new!'),
       ('Take pride in your progress.'),
       ('Your hard work is paying off.'),
       ('A few minutes a day changes everything.'),
       ('Every effort counts.'),
       ('Make today count.'),
       ('Just focus on today''s lesson.'),
       ('Embrace the learning process.'),
       ('Stay curious and keep exploring!'),
       ('You''re doing better than you think.'),
       ('Push your boundaries today');

-- Аватарки: вставляем svg прям сюда

INSERT INTO themes (theme_name)
VALUES ('light'), ('dark')
    ON CONFLICT (theme_name) DO NOTHING;

INSERT INTO en_words (word)
VALUES ('apple'), ('book'), ('cat'), ('dog'), ('house'),
       ('water'), ('friend'), ('family'), ('school'), ('music'),
       ('sun'), ('moon'), ('star'), ('tree'), ('river'),
       ('mountain'), ('city'), ('country'), ('people'), ('child'),
       ('morning'), ('evening'), ('night'), ('today'), ('tomorrow'),
       ('yesterday'), ('week'), ('month'), ('year'), ('time'),
       ('work'), ('study'), ('travel'), ('listen'), ('speak'),
       ('read'), ('write'), ('learn'), ('teach'), ('help'),
       ('happy'), ('sad'), ('angry'), ('tired'), ('hungry'),
       ('beautiful'), ('difficult'), ('important'), ('interesting'), ('dangerous'),
       ('quickly'), ('slowly'), ('carefully'), ('usually'), ('always'),
       ('sometimes'), ('never'), ('often'), ('already'), ('still'),
       ('weather'), ('rain'), ('snow'), ('wind'), ('cloud'),
       ('ocean'), ('island'), ('forest'), ('desert'), ('field'),
       ('bridge'), ('road'), ('station'), ('airport'), ('hospital'),
       ('market'), ('restaurant'), ('library'), ('museum'), ('theatre'),
       ('journey'), ('adventure'), ('experience'), ('knowledge'), ('success'),
       ('failure'), ('decision'), ('opinion'), ('problem'), ('solution'),
       ('opportunity'), ('challenge'), ('achievement'), ('environment'), ('community'),
       ('government'), ('society'), ('culture'), ('tradition'), ('generation')
    ON CONFLICT (word) DO NOTHING;
