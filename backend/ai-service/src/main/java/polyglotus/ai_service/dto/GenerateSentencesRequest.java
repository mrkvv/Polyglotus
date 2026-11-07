package polyglotus.ai_service.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import polyglotus.ai_service.model.Word;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GenerateSentencesRequest(
        @JsonProperty("words") List<Word> words,
        @JsonProperty("level") String level
) { }
