package polyglotus.api_gateway.routes;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import polyglotus.api_gateway.model.path.AiServicePath;

@Configuration
public class AiServiceRoutes {

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    @Bean
    public RouteLocator aiRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("chat", r -> r
                        .path(AiServicePath.CHAT.path())
                        .uri(aiServiceUrl))
                .build();
    }
}
