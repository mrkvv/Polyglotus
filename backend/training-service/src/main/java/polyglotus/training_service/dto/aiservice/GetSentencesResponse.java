package polyglotus.training_service.dto.aiservice;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GetSentencesResponse(
        List<Sentence> sentences
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Sentence(Integer id, String sentence, String answer) {}
}
