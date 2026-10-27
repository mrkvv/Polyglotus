package polyglotus.user_service.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
public class UserRepository {

    private static final String INSERT_USER_SQL = """
            INSERT INTO users (yandex_id, first_name, last_name)
            VALUES (?, ?, ?)
            ON CONFLICT (yandex_id) DO UPDATE
                SET first_name = EXCLUDED.first_name,
                    last_name  = EXCLUDED.last_name
            RETURNING id
            """;

    private static final String SET_LEVEL_AND_AVATAR_SQL = """
            UPDATE users SET level_id = ?, avatar_id = ?
            WHERE id = ?
            """;

    private static final String GET_USER_INFO_SQL = """
            SELECT u.id,
                   u.yandex_id,
                   u.first_name,
                   u.last_name,
                   u.level_id,
                   u.avatar_id,
                   u.created_at,
                   s.current_streak,
                   s.longest_streak,
                   s.last_training_date
            FROM users u
            LEFT JOIN user_streaks s ON s.user_id = u.id
            WHERE u.id = ?
            """;

    private static final String SET_USER_LEVEL_SQL = """
            UPDATE users SET level_id = ?
            WHERE id = ?
            """;

    private static final String SET_USER_AVATAR_SQL = """
            UPDATE users SET avatar_id = ?
            WHERE id = ?
            """;

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Integer insertUserAndGetId(String yandexId, String firstName, String lastName) {
        return jdbcTemplate.queryForObject(INSERT_USER_SQL, Integer.class,
                yandexId, firstName, lastName);
    }

    public void updateUser(Integer userId, Integer levelId, Integer avatarId) {
        jdbcTemplate.update(SET_LEVEL_AND_AVATAR_SQL, levelId, avatarId, userId);
    }

    public Map<String, Object> getUserInfo(Integer userId) {
        return jdbcTemplate.queryForMap(GET_USER_INFO_SQL, userId);
    }

    public void setUserLevel(Integer userId, Integer newLevelId) {
        jdbcTemplate.update(SET_USER_LEVEL_SQL, newLevelId, userId);
    }

    public void setUserAvatar(Integer userId, Integer newAvatarId) {
        jdbcTemplate.update(SET_USER_AVATAR_SQL, newAvatarId, userId);
    }
}
