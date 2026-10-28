package polyglotus.user_service.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UserStreaksRepository {
    private static final String INITIALIZE_USER_STREAK_SQL = """
            INSERT INTO user_streaks(user_id)
            VALUES (?) ON CONFLICT(user_id) DO NOTHING
            """;

    private final JdbcTemplate jdbcTemplate;

    public UserStreaksRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void insertUser(Integer userId) {
        jdbcTemplate.update(INITIALIZE_USER_STREAK_SQL, userId);
    }
}
