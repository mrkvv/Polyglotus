package polyglotus.dictionary_service.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class DictionaryRepository {

    private static final String INSERT_RECORD_SQL = """
            INSERT INTO dictionary(user_id, en_word, ru_word, part_of_speech)
            VALUES (?, ?, ?, ?)
            ON CONFLICT ON CONSTRAINT unique_dictionary_record DO NOTHING
            RETURNING id
            """;

    private static final String SELECT_RECORD_BY_ID_SQL = """
            SELECT d.id,
                en.word AS en_word,
                ru.word AS ru_word,
                d.part_of_speech,
                d.progress_count,
                d.status,
                d.added_at
            FROM dictionary d
            JOIN en_words en ON d.en_word = en.id
            JOIN ru_words ru ON d.ru_word = ru.id
            WHERE d.id = ?
            """;

    private static final String GET_RECORD_ID_SQL = """
            SELECT id FROM dictionary
            WHERE user_id = ?
                AND en_word = ?
                AND ru_word = ?
                AND part_of_speech = ?
            """;

    private static final String SELECT_PAGE_BASE_SQL = """
        SELECT d.id,
            en.word AS en_word,
            ru.word AS ru_word,
            d.part_of_speech,
            d.progress_count,
            d.status,
            d.added_at
        FROM dictionary d
        JOIN en_words en ON d.en_word = en.id
        JOIN ru_words ru ON d.ru_word = ru.id
        WHERE d.user_id = ?
        """;

    private static final String SELECT_PAGE_BY_STATUS_SQL =
            SELECT_PAGE_BASE_SQL + " AND d.status = ? ORDER BY d.added_at DESC "
                    + "LIMIT ? OFFSET ?";

    private static final String SELECT_PAGE_SQL =
            SELECT_PAGE_BASE_SQL + " ORDER BY d.added_at DESC LIMIT ? OFFSET ?";

    private static final String COUNT_DICTIONARY_RECORDS_SQL = """
            SELECT COUNT(*) FROM dictionary
            WHERE user_id = ?
            """;

    private static final String COUNT_DICTIONARY_RECORDS_BY_STATUS_SQL =
            COUNT_DICTIONARY_RECORDS_SQL + " AND status = ?";

    private static final String DELETE_WORD_SQL = """
            DELETE FROM dictionary
            WHERE id = ? AND user_id = ?
            """;

    private static final String UPDATE_WORD_STATUS_SQL = """
            UPDATE dictionary
            SET status = ?
            WHERE id = ? AND user_id = ?
            """;

    private static final String EDIT_WORD_SQL = """
            UPDATE dictionary
            SET en_word = ?,
                ru_word = ?,
                part_of_speech = ?
            WHERE id = ? AND user_id = ?
            RETURNING id
            """;

    private static final String GET_USER_TRANSLATIONS_SQL = """
            SELECT d.id, r.word AS translation, d.part_of_speech
            FROM dictionary d
            JOIN ru_words r ON d.ru_word = r.id
            JOIN en_words e ON d.en_word = e.id
            WHERE d.user_id = ? AND e.word = ?
            ORDER BY d.added_at DESC
            """;

    private final JdbcTemplate jdbcTemplate;

    public DictionaryRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Integer insertAndGetRecordId(
            Integer userId, Integer enWordId, Integer ruWordId, String partOfSpeech
    ) {
        List<Integer> existing = jdbcTemplate.queryForList(
                GET_RECORD_ID_SQL, Integer.class,
                userId, enWordId, ruWordId, partOfSpeech
        );
        if (!existing.isEmpty()) return existing.getFirst();


        List<Integer> inserted = jdbcTemplate.queryForList(
                INSERT_RECORD_SQL, Integer.class,
                userId, enWordId, ruWordId, partOfSpeech
        );
        if(!inserted.isEmpty()) return inserted.getFirst();


        return jdbcTemplate.queryForObject(
                GET_RECORD_ID_SQL, Integer.class,
                userId, enWordId, ruWordId, partOfSpeech
        );
    }

    public Map<String, Object> getRecordById(Integer recordId) {
        return jdbcTemplate.queryForMap(SELECT_RECORD_BY_ID_SQL, recordId);
    }

    public List<Map<String, Object>> getPage(
            Integer userId, Integer page, Integer size, String status
    ) {
        Integer offset = page * size;
        return status == null
                ? jdbcTemplate.queryForList(SELECT_PAGE_SQL, userId, size, offset)
                : jdbcTemplate.queryForList(SELECT_PAGE_BY_STATUS_SQL, userId, status, size, offset);
    }

    public Integer recordsCount(Integer userId, String status) {
        Integer count = status == null
                ? jdbcTemplate.queryForObject(COUNT_DICTIONARY_RECORDS_SQL, Integer.class, userId)
                : jdbcTemplate.queryForObject(COUNT_DICTIONARY_RECORDS_BY_STATUS_SQL, Integer.class, userId, status);

        return count == null ? 0 : count;
    }

    public void deleteWord(Integer userId, Integer wordId) {
        jdbcTemplate.update(DELETE_WORD_SQL, wordId, userId);
    }

    public void deleteWordsBatch(Integer userId, List<Integer> wordIds) {
        List<Object[]> batchArgs = new ArrayList<>();

        for(Integer id : wordIds) {
            Object[] args = { id, userId };
            batchArgs.add(args);
        }

        if(!batchArgs.isEmpty()) {
            jdbcTemplate.batchUpdate(DELETE_WORD_SQL, batchArgs);
        }
    }

    public boolean setWordStatus(Integer userId, Integer wordId, String status) {
        int affected = jdbcTemplate.update(UPDATE_WORD_STATUS_SQL, status, wordId, userId);
        return affected > 0;
    }

    public void setWordsStatusBatch(Integer userId, List<Integer> wordIds, String status) {
        List<Object[]> batchArgs = new ArrayList<>();

        for(Integer wordId : wordIds) {
            Object[] args = {
                    status,
                    wordId,
                    userId
            };
            batchArgs.add(args);
        }

        if(!batchArgs.isEmpty()) {
            jdbcTemplate.batchUpdate(UPDATE_WORD_STATUS_SQL, batchArgs);
        }
    }

    public List<Integer> editWord(
            Integer wordId, Integer userId,
            Integer enWordId, Integer ruWordId,
            String partOfSpeech
    ) {
        return jdbcTemplate.queryForList(
                EDIT_WORD_SQL, Integer.class,
                enWordId, ruWordId, partOfSpeech, wordId, userId
        );
    }

    public List<Map<String, Object>> getUserTranslations(Integer userId, String enWord) {
        return jdbcTemplate.queryForList(GET_USER_TRANSLATIONS_SQL, userId, enWord);
    }
}
