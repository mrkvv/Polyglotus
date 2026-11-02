package polyglotus.dictionary_service.dto;

import java.util.Map;

public record Word(
    Integer id,
    String en,
    String ru,
    String partOfSpeech,
    Integer progressCount,
    String status,
    String addedAt
) {

    public static Word fromMap(Map<String, Object> map) {
        Integer id = (Integer) map.get("id");
        String en = (String) map.get("en_word");
        String ru = (String) map.get("ru_word");
        String partOfSpeech = (String) map.get("part_of_speech");
        Integer progressCount = (Integer) map.get("progress_count");
        String status = (String) map.get("status");
        String addedAt = map.get("added_at").toString();

        return new Word(id, en, ru, partOfSpeech, progressCount, status, addedAt);
    }
}
