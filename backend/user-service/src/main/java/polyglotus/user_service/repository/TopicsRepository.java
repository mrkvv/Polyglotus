package polyglotus.user_service.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
public class TopicsRepository {
    private static final String GET_EXISTING_TOPICS_COUNT_SQL = """
            SELECT COUNT(*) FROM topics
            WHERE id IN (%s)
            """;

    private static final String GET_TOPICS_SQL = "SELECT * FROM topics";

    private static final String TOPICS_DELIMITER = ", ";

    private final JdbcTemplate jdbcTemplate;

    public TopicsRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean topicsExist(List<Integer> topics) {
        String topicsString = topics.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(TOPICS_DELIMITER));

        String sql = String.format(GET_EXISTING_TOPICS_COUNT_SQL, topicsString);

        Integer existingTopicsCount = jdbcTemplate.queryForObject(sql, Integer.class);

        return (existingTopicsCount != null) && (topics.size() == existingTopicsCount);
    }

    public List<Map<String, Object>> getAllTopics() {
        return jdbcTemplate.queryForList(GET_TOPICS_SQL);
    }
}
