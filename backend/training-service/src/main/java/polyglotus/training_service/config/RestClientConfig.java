package polyglotus.training_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    private final String aiServiceUrl;

    public RestClientConfig(
            @Value("${ai.service.url}") String aiServiceUrl
    ) {
        this.aiServiceUrl = aiServiceUrl;
    }

    @Bean
    public RestClient restClient() {
        return RestClient.builder()
                .baseUrl(aiServiceUrl)
                .build();
    }
}
