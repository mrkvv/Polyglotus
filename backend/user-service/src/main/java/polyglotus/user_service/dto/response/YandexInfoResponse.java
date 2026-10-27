package polyglotus.user_service.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record YandexInfoResponse (
    @JsonProperty("id") String yandexId,
    @JsonProperty("first_name")  String firstName,
    @JsonProperty("last_name") String lastName
) {}
