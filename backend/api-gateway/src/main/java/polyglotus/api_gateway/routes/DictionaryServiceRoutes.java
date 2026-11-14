package polyglotus.api_gateway.routes;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import polyglotus.api_gateway.model.path.DictionaryServicePath;

@Configuration
public class DictionaryServiceRoutes {

    @Value("${dictionary.service.url}")
    private String dictionaryServiceUrl;

    @Bean
    public RouteLocator dictionaryRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("dictionary_get", r -> r
                        .path(DictionaryServicePath.DICTIONARY.path())
                        .uri(dictionaryServiceUrl))
                .route("dictionary_words", r -> r
                        .path(DictionaryServicePath.WORDS.path())
                        .uri(dictionaryServiceUrl))
                .route("dictionary_status", r -> r
                        .path(DictionaryServicePath.STATUS.path())
                        .uri(dictionaryServiceUrl))
                .route("get_translations", r -> r
                        .path(DictionaryServicePath.TRANSLATIONS.path())
                        .uri(dictionaryServiceUrl))
                .route("get_daily_word", r -> r
                        .path(DictionaryServicePath.DAILY_WORD.path())
                        .uri(dictionaryServiceUrl))
                .route("motivational_phrase", r -> r
                        .path(DictionaryServicePath.PHRASE.path())
                        .uri(dictionaryServiceUrl))
                .build();
    }
}
