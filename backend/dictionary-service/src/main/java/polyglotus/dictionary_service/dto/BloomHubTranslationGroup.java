package polyglotus.dictionary_service.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Collection;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record BloomHubTranslationGroup(
        String title,
        String definition,
        @JsonProperty("variants_of_words") List<String> translations,
        @JsonProperty("part_of_speech") String partOfSpeech
) {
    public BloomHubTranslationGroup without(Collection<String> translations) {
        if (this.translations == null || translations == null || translations.isEmpty()) {
            return this;
        }
        return new BloomHubTranslationGroup(
                title,
                definition,
                this.translations.stream()
                        .filter(t -> !translations.contains(t))
                        .toList(),
                partOfSpeech
        );
    }
}
