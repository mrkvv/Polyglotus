package polyglotus.training_service.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UserStreaksRepository {

    private static final String UPDATE_USER_STREAK_SQL = """
            UPDATE user_streaks
            SET current_streak = 0
            WHERE user_id = ?
                AND CURRENT_DATE - last_training_date > 1
            """;

    private static final String INCREMENT_USER_STREAK_SQL = """
            UPDATE user_streaks
            SET
                current_streak = current_streak + 1,
                longest_streak = GREATEST(longest_streak, current_streak + 1),
                last_training_date = CURRENT_DATE
            WHERE user_id = ? AND (last_training_date IS NULL OR last_training_date < CURRENT_DATE)
            """;

    private final JdbcTemplate jdbcTemplate;

    public UserStreaksRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void updateUserStreak(Integer userId) {
        jdbcTemplate.update(UPDATE_USER_STREAK_SQL, userId);
    }

    public void incrementUserStreak(Integer userId) {
        jdbcTemplate.update(INCREMENT_USER_STREAK_SQL, userId);
    }
}
