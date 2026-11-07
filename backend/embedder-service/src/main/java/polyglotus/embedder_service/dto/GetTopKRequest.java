package polyglotus.embedder_service.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GetTopKRequest(
        @JsonProperty("userId") Integer userId,
        @JsonProperty("messages") List<String> messages,
        @JsonProperty("topK") Integer topK
) {

    public String getDialogContent() {
        return String.join("\n", messages);
    }
}
