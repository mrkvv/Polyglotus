package polyglotus.ai_service.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record TopKResponse(
        List<Word> words
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    private record Word(String word) {}

    public List<String> getStringWords() {
        return words.stream()
                .map(Word::word)
                .toList();
    }
}
