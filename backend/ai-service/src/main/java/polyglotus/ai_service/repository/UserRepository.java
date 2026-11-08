package polyglotus.ai_service.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserRepository {

    private static final String UNKNOWN = "Unknown";

    private static final String GET_USER_LEVEL_SQL = """
            SELECT l.level_name AS level
            FROM users u
            JOIN levels l ON u.level_id = l.id
            WHERE u.id = ?
            """;

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public String getUserLevel(Integer userId) {
        List<String> result = jdbcTemplate.queryForList(GET_USER_LEVEL_SQL, String.class, userId);
        return result.isEmpty() ? UNKNOWN : result.getFirst();
    }
}
