package polyglotus.dictionary_service.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record BloomHubTranslationGroup(
        String title,
        String definition,
        @JsonProperty("variants_of_words") List<String> translations,
        @JsonProperty("part_of_speech") String partOfSpeech
) {}
