package polyglotus.dictionary_service.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import polyglotus.dictionary_service.dto.BloomHubTranslationGroup;
import polyglotus.dictionary_service.dto.response.BloomHubApiResponse;

import java.util.List;

@Service
public class BloomHubService {

    private static final String TRANSLATIONS_PATH_TEMPLATE =
            "/api/v1/words/{word}/translations";

    private final RestClient restClient;

    public BloomHubService(RestClient restClient) {
        this.restClient = restClient;
    }

    public List<BloomHubTranslationGroup> getTranslations(String enWord) {
        BloomHubApiResponse response = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path(TRANSLATIONS_PATH_TEMPLATE)
                        .queryParam("language", "ru")
                        .build(enWord)
                )
                .retrieve()
                .body(BloomHubApiResponse.class);

        if(response == null || response.getTranslationGroups() == null) {
            return List.of();
        }
        return response.getTranslationGroups();
    }
}
