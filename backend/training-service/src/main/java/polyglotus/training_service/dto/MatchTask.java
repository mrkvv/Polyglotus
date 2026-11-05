package polyglotus.training_service.dto;

import java.util.List;
import java.util.Map;

public record MatchTask(List<Pair> pairs) {

    public record Pair(
            Integer id,
            String word,
            String translation
    ) {
        public static Pair fromMap(Map<String, Object> map) {
            Integer id = (Integer) map.get("id");
            String word = (String) map.get("en_word");
            String translation = (String) map.get("ru_word");

            return new Pair(id, word, translation);
        }
    }
}
