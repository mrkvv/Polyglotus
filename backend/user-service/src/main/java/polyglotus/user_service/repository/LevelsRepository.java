package polyglotus.user_service.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class LevelsRepository {

    private static final String LEVEL_EXISTS_SQL = """
            SELECT EXISTS(SELECT 1 FROM levels WHERE id = ?)
            """;

    private static final String GET_LEVELS_SQL = "SELECT * FROM levels";

    private final JdbcTemplate jdbcTemplate;

    public LevelsRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean levelExists(Integer levelId) {
        return Boolean.TRUE.equals(
                jdbcTemplate.queryForObject(LEVEL_EXISTS_SQL, Boolean.class, levelId)
        );
    }

    public List<Map<String, Object>> getAllLevels() {
        return jdbcTemplate.queryForList(GET_LEVELS_SQL);
    }
}
