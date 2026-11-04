package polyglotus.api_gateway.routes;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TrainingServiceRoutes {

    @Value("${training.service.url}")
    private String trainingServiceUrl;

    @Bean
    public RouteLocator trainingRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("training_translation", r -> r
                        .path("/training/translate")
                        .uri(trainingServiceUrl))
                .route("training_match", r -> r
                        .path("/training/match")
                        .uri(trainingServiceUrl))
                .route("training_fill", r -> r
                        .path("/training/fill")
                        .uri(trainingServiceUrl))
                .route("training_mark_correct", r -> r
                        .path("/training/mark-correct")
                        .uri(trainingServiceUrl))
                .build();
    }
}
