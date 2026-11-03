package polyglotus.dictionary_service.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class MotivationalPhraseRepository {

    private static final String DEFAULT_PHRASE = "Do your best!";

    private static final String GET_PHRASE_SQL = """
            SELECT phrase FROM motivational_phrases
            ORDER BY RANDOM() LIMIT 1
            """;

    private final JdbcTemplate jdbcTemplate;

    public MotivationalPhraseRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public String getPhrase() {
        List<String> result = jdbcTemplate.queryForList(GET_PHRASE_SQL, String.class);
        return result.isEmpty() ? DEFAULT_PHRASE : result.getFirst();
    }
}
