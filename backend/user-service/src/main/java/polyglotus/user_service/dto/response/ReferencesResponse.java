package polyglotus.user_service.dto.response;

import java.util.List;
import java.util.Map;

public record ReferencesResponse (
    List<Level> levels,
    List<Topic> topics,
    List<Avatar> avatars
) {
    public record Level(Integer id, String name) {
        public static Level fromMap(Map<String, Object> map) {
            Integer id = (Integer) map.get("id");
            String name = (String) map.get("level_name");
            return new Level(id, name);
        }
    }

    public record Topic(Integer id, String name) {
        public static Topic fromMap(Map<String, Object> map) {
            Integer id = (Integer) map.get("id");
            String name = (String) map.get("topic_name");
            return new Topic(id, name);
        }
    }

    public record Avatar(Integer id, String svg) {
        public static Avatar fromMap(Map<String, Object> map) {
            Integer id = (Integer) map.get("id");
            String svg = (String) map.get("avatar");
            return new Avatar(id, svg);
        }
    }
}
