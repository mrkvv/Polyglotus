package polyglotus.embedder_service.model;

import java.util.Map;

public record Word(Integer id, String word) {

    public static Word fromMap(Map<String, Object> map) {
        Integer id = (Integer) map.get("id");
        String word = (String) map.get("word");

        return new Word(id, word);
    }
}
