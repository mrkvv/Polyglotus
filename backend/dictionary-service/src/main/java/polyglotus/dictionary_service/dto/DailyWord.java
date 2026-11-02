package polyglotus.dictionary_service.dto;

import java.util.Map;

public record DailyWord(
        String word,
        String date
) {
    public static DailyWord fromMap(Map<String, Object> map) {
        String word = (String) map.get("word");
        String date = map.get("date").toString();
        return new DailyWord(word, date);
    }
}
