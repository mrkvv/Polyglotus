package polyglotus.ai_service.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import polyglotus.ai_service.model.ChatMessage;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class ChatMessagesRepository {

    private static final String GET_USER_CHAT_HISTORY_SQL = """
            SELECT id, user_id, content, role, created_at
            FROM chat_messages
            WHERE user_id = ?
            ORDER BY created_at ASC
            """;

    private static final String INSERT_MESSAGE_SQL = """
            INSERT INTO chat_messages(user_id, content, role)
            VALUES (?, ?, ?)
            """;

    private static final String DELETE_HISTORY_SQL = """
            DELETE FROM chat_messages
            WHERE user_id = ?
            """;

    private final JdbcTemplate jdbcTemplate;

    public ChatMessagesRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>> getUserChatHistory(Integer userId) {
        return jdbcTemplate.queryForList(GET_USER_CHAT_HISTORY_SQL, userId);
    }

    public void insertMessages(Integer userId, List<ChatMessage> messages) {
        List<Object[]> batchArgs = new ArrayList<>();

        for(ChatMessage msg : messages) {
            Object[] args = {
                    userId,
                    msg.content(),
                    msg.role()
            };
            batchArgs.add(args);
        }

        if(!batchArgs.isEmpty()) {
            jdbcTemplate.batchUpdate(INSERT_MESSAGE_SQL, batchArgs);
        }
    }

    public void deleteDialog(Integer userId) {
        jdbcTemplate.update(DELETE_HISTORY_SQL, userId);
    }
}
