package polyglotus.training_service.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record MarkCorrectRequest(
        @JsonProperty("ids") List<Integer> idsToMark
) {}
