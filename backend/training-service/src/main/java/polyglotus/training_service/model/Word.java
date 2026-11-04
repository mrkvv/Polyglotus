package polyglotus.training_service.model;

import java.util.Map;

public record Word(
    Integer id,
    String enWord,
    String ruWord,
    String partOfSpeech
) {
    public static Word fromMap(Map<String, Object> map) {
        Integer id = (Integer) map.get("id");
        String enWord = (String) map.get("en_word");
        String ruWord = (String) map.get("ru_word");
        String partOfSpeech = (String) map.get("part_of_speech");

        return new Word(id, enWord, ruWord, partOfSpeech);
    }
}
