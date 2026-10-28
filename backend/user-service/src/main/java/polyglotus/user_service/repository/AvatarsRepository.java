package polyglotus.user_service.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class AvatarsRepository {

    private static final String AVATAR_EXISTS_SQL = """
            SELECT EXISTS(SELECT 1 FROM avatars WHERE id = ?)
            """;

    private static final String GET_AVATARS_SQL = "SELECT * FROM avatars";

    private final JdbcTemplate jdbcTemplate;

    public AvatarsRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean avatarExists(Integer avatarId) {
        return Boolean.TRUE.equals(
                jdbcTemplate.queryForObject(AVATAR_EXISTS_SQL, Boolean.class, avatarId)
        );
    }

    public List<Map<String, Object>> getAllAvatars() {
        return jdbcTemplate.queryForList(GET_AVATARS_SQL);
    }
}
