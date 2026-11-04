package polyglotus.training_service.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Repository
public class DictionaryRepository {

    private static final String GET_UNLEARNED_WORDS_SQL = """
            SELECT d.id,
                   en.word AS en_word,
                   ru.word AS ru_word,
                   d.part_of_speech
            FROM dictionary d
            JOIN en_words en ON d.en_word = en.id
            JOIN ru_words ru ON d.ru_word = ru.id
            WHERE d.user_id = ? AND d.status = 'UNLEARNED'
            ORDER BY RANDOM()
            LIMIT ?
            """;

    private static final String GET_EN_DISTRACTORS_BY_USER_AND_PART_OF_SPEECH_SQL = """
            SELECT en.word AS en_word
            FROM dictionary d
            JOIN en_words en ON d.en_word = en.id
            WHERE d.user_id = ?
                   AND en.word NOT IN (%s)
                   AND d.part_of_speech = ?
            GROUP BY en.word
            ORDER BY RANDOM()
            LIMIT ?
            """;

    private static final String GET_EN_DISTRACTORS_BY_PART_OF_SPEECH_SQL = """
            SELECT en.word AS en_word
            FROM dictionary d
            JOIN en_words en ON d.en_word = en.id
            WHERE en.word NOT IN (%s)
                  AND d.part_of_speech = ?
            GROUP BY en.word
            ORDER BY RANDOM()
            LIMIT ?
            """;

    private static final String GET_EN_DISTRACTORS_SQL = """
            SELECT en.word AS en_word
            FROM dictionary d
            JOIN en_words en ON d.en_word = en.id
            WHERE en.word NOT IN (%s)
            GROUP BY en.word
            ORDER BY RANDOM()
            LIMIT ?
            """;

    private static final String GET_RU_DISTRACTORS_BY_USER_AND_PART_OF_SPEECH_SQL = """
            SELECT ru.word AS ru_word
            FROM dictionary d
            JOIN ru_words ru ON d.ru_word = ru.id
            WHERE d.user_id = ?
                   AND ru.word NOT IN (%s)
                   AND d.part_of_speech = ?
            GROUP BY ru.word
            ORDER BY RANDOM()
            LIMIT ?
            """;

    private static final String GET_RU_DISTRACTORS_BY_PART_OF_SPEECH_SQL = """
            SELECT ru.word AS ru_word
            FROM dictionary d
            JOIN ru_words ru ON d.ru_word = ru.id
            WHERE ru.word NOT IN (%s)
                  AND d.part_of_speech = ?
            GROUP BY ru.word
            ORDER BY RANDOM()
            LIMIT ?
            """;

    private static final String GET_RU_DISTRACTORS_SQL = """
            SELECT ru.word AS ru_word
            FROM dictionary d
            JOIN ru_words ru ON d.ru_word = ru.id
            WHERE ru.word NOT IN (%s)
            GROUP BY ru.word
            ORDER BY RANDOM()
            LIMIT ?
            """;

    private static final String INCREMENT_PROGRESS_COUNT_SQL = """
            UPDATE dictionary
            SET progress_count = progress_count + 1,
                status = CASE
                    WHEN progress_count + 1 = 3 THEN 'LEARNED'
                    ELSE status
                END
            WHERE id = ? AND user_id = ? AND progress_count < 3
            """;

    private final JdbcTemplate jdbcTemplate;

    public DictionaryRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>> getUnlearnedWordsByUserId(Integer userId, Integer amount) {
        return jdbcTemplate.queryForList(GET_UNLEARNED_WORDS_SQL, userId, amount);
    }

    public List<String> getEnDistractorsByUserAndPartOfSpeech(
            Integer userId, String partOfSpeech, List<String> wordsToAvoid, int amount
    ) {
        return queryDistractorsByUserAndPartOfSpeech(
                GET_EN_DISTRACTORS_BY_USER_AND_PART_OF_SPEECH_SQL,
                userId, partOfSpeech, wordsToAvoid, amount
        );
    }

    public List<String> getRuDistractorsByUserAndPartOfSpeech(
            Integer userId, String partOfSpeech, List<String> wordsToAvoid, int amount
    ) {
        return queryDistractorsByUserAndPartOfSpeech(
                GET_RU_DISTRACTORS_BY_USER_AND_PART_OF_SPEECH_SQL,
                userId, partOfSpeech, wordsToAvoid, amount
        );
    }

    public List<String> getEnDistractorsByPartOfSpeech(
            String partOfSpeech, List<String> wordsToAvoid, int amount
    ) {
        return queryDistractorsByPartOfSpeech(
                GET_EN_DISTRACTORS_BY_PART_OF_SPEECH_SQL,
                partOfSpeech, wordsToAvoid, amount
        );
    }

    public List<String> getRuDistractorsByPartOfSpeech(
            String partOfSpeech, List<String> wordsToAvoid, int amount
    ) {
        return queryDistractorsByPartOfSpeech(
                GET_RU_DISTRACTORS_BY_PART_OF_SPEECH_SQL,
                partOfSpeech, wordsToAvoid, amount
        );
    }

    public List<String> getAnyEnDistractors(List<String> wordsToAvoid, int amount) {
        return queryAnyDistractors(GET_EN_DISTRACTORS_SQL, wordsToAvoid, amount);
    }

    public List<String> getAnyRuDistractors(List<String> wordsToAvoid, int amount) {
        return queryAnyDistractors(GET_RU_DISTRACTORS_SQL, wordsToAvoid, amount);
    }



    private List<String> queryDistractorsByUserAndPartOfSpeech(
            String sqlTemplate, Integer userId, String partOfSpeech,
            List<String> wordsToAvoid, int amount
    ) {
        String sql = insertPlaceholders(sqlTemplate, wordsToAvoid.size());

        List<Object> params = new ArrayList<>();
        params.add(userId);
        params.addAll(wordsToAvoid);
        params.add(partOfSpeech);
        params.add(amount);

        return jdbcTemplate.queryForList(sql, String.class, params.toArray());
    }

    private List<String> queryDistractorsByPartOfSpeech(
            String sqlTemplate, String partOfSpeech, List<String> wordsToAvoid, int amount
    ) {
        String sql = insertPlaceholders(sqlTemplate, wordsToAvoid.size());

        List<Object> params = new ArrayList<>(wordsToAvoid);
        params.add(partOfSpeech);
        params.add(amount);

        return jdbcTemplate.queryForList(sql, String.class, params.toArray());
    }

    private List<String> queryAnyDistractors(String sqlTemplate, List<String> wordsToAvoid, int amount) {
        String sql = insertPlaceholders(sqlTemplate, wordsToAvoid.size());

        List<Object> params = new ArrayList<>(wordsToAvoid);
        params.add(amount);

        return jdbcTemplate.queryForList(sql, String.class, params.toArray());
    }

    private String insertPlaceholders(String template, int amount) {
        String placeholders =
                String.join(", ", Collections.nCopies(amount, "?"));
        return String.format(template, placeholders);
    }

    public void markCorrect(Integer userId, List<Integer> ids) {
        List<Object[]> batchArgs = new ArrayList<>();

        for(Integer id : ids) {
            Object[] args = { id, userId };
            batchArgs.add(args);
        }

        if(!batchArgs.isEmpty()) {
            jdbcTemplate.batchUpdate(INCREMENT_PROGRESS_COUNT_SQL, batchArgs);
        }
    }
}
