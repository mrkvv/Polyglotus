package polyglotus.training_service.dto.aiservice;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public record GetSentencesRequest(
        List<Word> words,
        String level
) {
    private record Word(Integer id, String word, String translation) {}

    public static GetSentencesRequest from(
            List<Map<String, Object>> rawWords, String level
    ) {
        List<Word> words = new ArrayList<>();

        for(Map<String, Object> rawWord : rawWords) {
            Integer id = (Integer) rawWord.get("id");
            String word = (String) rawWord.get("en_word");
            String translation = (String) rawWord.get("ru_word");

            words.add(new Word(id, word, translation));
        }
        return new GetSentencesRequest(words, level);
    }

}
