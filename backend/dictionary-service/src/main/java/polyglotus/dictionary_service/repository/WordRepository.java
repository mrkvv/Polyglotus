package polyglotus.dictionary_service.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class WordRepository {

    private static final String RU_WORDS_TABLE = "ru_words";
    private static final String EN_WORDS_TABLE = "en_words";

    private static final String UPSERT_WORD_SQL = """
            INSERT INTO %s (word) VALUES (?)
            ON CONFLICT (word) DO NOTHING RETURNING id
            """;

    private static final String GET_ID_BY_WORD_SQL = """
            SELECT id FROM %s WHERE word = ?
            """;

    private static final String COUNT_EN_WORDS_SQL = "SELECT COUNT(*) FROM en_words";

    private static final String GET_DAILY_WORD_SQL = """
            SELECT d.date AS date, e.word AS word
            FROM daily_words d
            JOIN en_words e ON d.en_word = e.id
            WHERE d.date = CURRENT_DATE;
            """;

    private static final String INSERT_DAILY_WORD_SQL = """
            INSERT INTO daily_words(date, en_word)
            VALUES (CURRENT_DATE, ?)
            ON CONFLICT (date) DO NOTHING
            """;

    private final JdbcTemplate jdbcTemplate;

    public WordRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private Integer findOrCreateWord(String table, String word) {
        String selectSql = String.format(GET_ID_BY_WORD_SQL, table);
        List<Integer> existing = jdbcTemplate.queryForList(selectSql, Integer.class, word);
        if(!existing.isEmpty()) {
            return existing.getFirst();
        }

        String insertSql = String.format(UPSERT_WORD_SQL, table);
        List<Integer> inserted = jdbcTemplate.queryForList(insertSql, Integer.class, word);
        if(!inserted.isEmpty()) {
            return inserted.getFirst();
        }

        return jdbcTemplate.queryForObject(selectSql, Integer.class, word);
    }

    public Integer findOrCreateEnWord(String word) {
        return findOrCreateWord(EN_WORDS_TABLE, word);
    }

    public Integer findOrCreateRuWord(String word) {
        return findOrCreateWord(RU_WORDS_TABLE, word);
    }

    public Integer getTotalAmountOfWords() {
        return jdbcTemplate.queryForObject(COUNT_EN_WORDS_SQL, Integer.class);
    }

    public Optional<Map<String, Object>> getDailyWord() {
        List<Map<String, Object>> result = jdbcTemplate.queryForList(GET_DAILY_WORD_SQL);
        return result.stream().findFirst();
    }

    public void insertDailyWord(Integer wordId) {
        jdbcTemplate.update(INSERT_DAILY_WORD_SQL, wordId);
    }
}
