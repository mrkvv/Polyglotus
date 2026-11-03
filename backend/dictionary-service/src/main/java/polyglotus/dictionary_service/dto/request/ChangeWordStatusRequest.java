package polyglotus.dictionary_service.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ChangeWordStatusRequest(
        @JsonProperty("status") String status,
        @JsonProperty("wordIds") List<Integer> wordIds
) {}
