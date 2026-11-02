package polyglotus.dictionary_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class AppConfig {

    private static final String BLOOM_HUB_BASE_URL = "https://vocab-bloom-hub.com";

    @Bean
    public RestClient bloomHubRestClient() {
        return RestClient.builder()
                .baseUrl(BLOOM_HUB_BASE_URL)
                .build();
    }
}
