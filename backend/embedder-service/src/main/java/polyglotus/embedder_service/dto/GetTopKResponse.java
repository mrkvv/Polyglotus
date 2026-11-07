package polyglotus.embedder_service.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public record GetTopKResponse(
    List<Word> words,
    Integer topK
) {
    private record Word(String word,Double distance) {}

    public static GetTopKResponse from(List<Map<String, Object>> rawInfo, Integer topK) {
        List<Word> words = new ArrayList<>();

        for(Map<String, Object> map : rawInfo) {
            String word = (String) map.get("word");
            Double distance = (Double) map.get("distance");

            words.add(new Word(word, distance));
        }

        return new GetTopKResponse(words, topK);
    }
}
