package polyglotus.user_service.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class ThemesRepository {

    private static final String GET_THEMES_SQL = "SELECT * FROM themes";

    private final JdbcTemplate jdbcTemplate;

    public ThemesRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>> getAllThemes() {
        return jdbcTemplate.queryForList(GET_THEMES_SQL);
    }
}
