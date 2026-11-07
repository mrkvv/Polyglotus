package polyglotus.embedder_service.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import polyglotus.embedder_service.model.Embedding;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class WordsRepository {

    private static final String GET_WORDS_WITHOUT_EMBEDDING_SQL = """
            SELECT id, word FROM en_words
            WHERE embedding IS NULL
            LIMIT ?
            """;

    private static final String UPDATE_EMBEDDING_SQL = """
            UPDATE en_words
            SET embedding = CAST(? AS vector)
            WHERE id = ?
            """;

    private static final String FIND_TOP_K_SQL = """
            SELECT e.id, e.word, e.embedding <=> CAST(? AS vector) AS distance
            FROM en_words e
            JOIN dictionary d ON e.id = d.en_word
            WHERE d.user_id = ? AND e.embedding IS NOT NULL
            ORDER BY distance
            LIMIT ?
            """;

    private final JdbcTemplate jdbcTemplate;

    public WordsRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>> getWordsWithoutEmbedding(int limit) {
        return jdbcTemplate.queryForList(GET_WORDS_WITHOUT_EMBEDDING_SQL, limit);
    }

    public void updateEmbeddingBatch(List<Embedding> embeddings) {
        List<Object[]> batchArgs = new ArrayList<>();

        for(Embedding embedding : embeddings) {
            Object[] args = {
                    embedding.embedding(),
                    embedding.id()
            };
            batchArgs.add(args);
        }

        if(!batchArgs.isEmpty()) {
            jdbcTemplate.batchUpdate(UPDATE_EMBEDDING_SQL, batchArgs);
        }
    }

    public List<Map<String, Object>> getTopK(float[] queryEmbedding, Integer userId, int topK) {
        return jdbcTemplate.queryForList(
                FIND_TOP_K_SQL,
                queryEmbedding, userId, topK
        );
    }
}
