package polyglotus.api_gateway.routes;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DictionaryServiceRoutes {

    @Value("${dictionary.service.url}")
    private String dictionaryServiceUrl;

    @Bean
    public RouteLocator dictionaryRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("dictionary_get", r -> r
                        .path("/dictionary")
                        .uri(dictionaryServiceUrl))
                .route("dictionary_words", r -> r
                        .path("/dictionary/words/**")
                        .uri(dictionaryServiceUrl))
                .route("dictionary_status", r -> r
                        .path("/dictionary/words/status/**")
                        .uri(dictionaryServiceUrl))
                .route("get_translations", r -> r
                        .path("/translations")
                        .uri(dictionaryServiceUrl))
                .route("get_daily_word", r -> r
                        .path("/daily-word")
                        .uri(dictionaryServiceUrl))
                .route("motivational_phrase", r -> r
                        .path("/phrase")
                        .uri(dictionaryServiceUrl))
                .build();
    }
}
