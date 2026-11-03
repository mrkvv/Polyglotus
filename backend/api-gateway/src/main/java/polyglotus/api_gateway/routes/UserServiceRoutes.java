package polyglotus.api_gateway.routes;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UserServiceRoutes {
    @Value("${user.service.url}")
    private String userServiceUrl;

    @Bean
    public RouteLocator userRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("user_login", r -> r
                        .path("/auth/yandex")
                        .uri(userServiceUrl))
                .route("user_logout", r -> r
                        .path("/auth/logout")
                        .uri(userServiceUrl))
                .route("user_onboarding", r -> r
                        .path("/users/me/onboarding")
                        .uri(userServiceUrl))
                .route("user_me", r -> r
                        .path("/users/me")
                        .uri(userServiceUrl))
                .route("user_change_level", r -> r
                        .path("/users/me/level")
                        .uri(userServiceUrl))
                .route("user_change_avatar", r -> r
                        .path("/users/me/avatar")
                        .uri(userServiceUrl))
                .route("user_change_topics", r -> r
                        .path("/users/me/topics")
                        .uri(userServiceUrl))
                .route("references", r -> r
                        .path("/references")
                        .uri(userServiceUrl))
                .build();
    }
}
