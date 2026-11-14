package polyglotus.api_gateway.routes;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import polyglotus.api_gateway.model.path.TrainingServicePath;

@Configuration
public class TrainingServiceRoutes {

    @Value("${training.service.url}")
    private String trainingServiceUrl;

    @Bean
    public RouteLocator trainingRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("training_translation", r -> r
                        .path(TrainingServicePath.TRAINING_TRANSLATE.path())
                        .uri(trainingServiceUrl))
                .route("training_match", r -> r
                        .path(TrainingServicePath.TRAINING_MATCH.path())
                        .uri(trainingServiceUrl))
                .route("training_fill", r -> r
                        .path(TrainingServicePath.TRAINING_FILL.path())
                        .uri(trainingServiceUrl))
                .route("training_mark_correct", r -> r
                        .path(TrainingServicePath.MARK_CORRECT.path())
                        .uri(trainingServiceUrl))
                .build();
    }
}
