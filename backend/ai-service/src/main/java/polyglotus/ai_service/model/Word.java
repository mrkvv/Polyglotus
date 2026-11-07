package polyglotus.ai_service.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record Word(
        @JsonProperty("id") Integer id,
        @JsonProperty("word") String word
) {}
