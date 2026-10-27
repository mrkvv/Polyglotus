package polyglotus.user_service.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class UserTopicsRepository {

    private static final String INSERT_USER_TOPIC_SQL = """
            INSERT INTO user_topics (user_id, topic_id)
            VALUES (?, ?)
            ON CONFLICT (user_id, topic_id) DO NOTHING
            """;

    private static final String GET_USER_TOPICS_SQL = """
            SELECT topic_id FROM user_topics
            WHERE user_id = ?
            """;

    private static final String DELETE_USER_TOPICS_SQL = """
            DELETE FROM user_topics
            WHERE user_id = ?
            """;

    private final JdbcTemplate jdbcTemplate;

    public UserTopicsRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void insertTopics(Integer userId, List<Integer> topicIds) {
        List<Object[]> batchArgs = new ArrayList<>();

        for(Integer topicId : topicIds) {
            Object[] args = {
                    userId,
                    topicId
            };
            batchArgs.add(args);
        }

        if(!batchArgs.isEmpty()) {
            jdbcTemplate.batchUpdate(INSERT_USER_TOPIC_SQL, batchArgs);
        }
    }

    public List<Integer> getUserTopics(Integer userId) {
        return jdbcTemplate.queryForList(GET_USER_TOPICS_SQL, userId)
                .stream()
                .map(item -> (Integer) item.get("topic_id"))
                .toList();
    }

    public void deleteUserTopics(Integer userId) {
        jdbcTemplate.update(DELETE_USER_TOPICS_SQL, userId);
    }
}
