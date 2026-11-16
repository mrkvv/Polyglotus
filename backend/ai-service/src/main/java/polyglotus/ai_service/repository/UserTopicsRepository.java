package polyglotus.ai_service.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserTopicsRepository {

    private static final String GET_USER_TOPICS_SQL = """
            SELECT t.topic_name
            FROM user_topics u
            JOIN topics t ON u.topic_id = t.id
            WHERE u.user_id = ?
            """;

    private final JdbcTemplate jdbcTemplate;

    public UserTopicsRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<String> getUserTopics(Integer userId) {
        return jdbcTemplate.queryForList(GET_USER_TOPICS_SQL, String.class, userId);
    }
}
