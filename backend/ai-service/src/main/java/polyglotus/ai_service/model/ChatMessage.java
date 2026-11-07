package polyglotus.ai_service.model;

import java.util.Map;

public record ChatMessage(
        Integer id,
        Integer userId,
        String content,
        String role,
        String createdAt
) {
    private static final String USER_ROLE = "user";
    private static final String ASSISTANT_ROLE = "LLM";

    public static ChatMessage fromMap(Map<String, Object> map) {
        Integer id = (Integer) map.get("id");
        Integer userId = (Integer) map.get("user_id");
        String content = (String) map.get("content");
        String role = (String) map.get("role");
        String createdAt = map.get("created_at").toString();

        return new ChatMessage(id, userId, content, role, createdAt);
    }

    public static ChatMessage user(Integer userId, String content) {
        return new ChatMessage(null, userId, content, USER_ROLE, null);
    }

    public static ChatMessage assistant(Integer userId, String content) {
        return new ChatMessage(null, userId, content, ASSISTANT_ROLE, null);
    }
}
