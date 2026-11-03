package polyglotus.dictionary_service.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import polyglotus.dictionary_service.dto.BloomHubTranslationGroup;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record BloomHubApiResponse (
        @JsonProperty("data") DataWrapper dataWrapper
) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record DataWrapper(
            @JsonProperty("meaning_translations")
            List<BloomHubTranslationGroup> translationGroups
    ) {}

    public List<BloomHubTranslationGroup> getTranslationGroups() {
        return dataWrapper.translationGroups();
    }
}
