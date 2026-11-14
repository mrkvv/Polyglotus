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
VALUES ('Маленькие шаги каждый день ведут к большим результатам.'),
       ('Ошибки — это доказательство того, что вы пытаетесь.');

-- Аватарки: вставляем svg прям сюда

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
