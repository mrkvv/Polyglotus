package polyglotus.ai_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    private final String embedderServiceUrl;

    public RestClientConfig(
            @Value("${embedder.service.url}") String embedderServiceUrl
    ) {
        this.embedderServiceUrl = embedderServiceUrl;
    }

    @Bean
    public RestClient restClient() {
        return RestClient.builder()
                .baseUrl(embedderServiceUrl)
                .build();
    }
}
