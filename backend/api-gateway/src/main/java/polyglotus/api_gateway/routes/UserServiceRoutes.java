package polyglotus.api_gateway.routes;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import polyglotus.api_gateway.model.path.UserServicePath;

@Configuration
public class UserServiceRoutes {
    @Value("${user.service.url}")
    private String userServiceUrl;

    @Bean
    public RouteLocator userRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("user_login", r -> r
                        .path(UserServicePath.LOGIN.path())
                        .uri(userServiceUrl))
                .route("user_logout", r -> r
                        .path(UserServicePath.LOGOUT.path())
                        .uri(userServiceUrl))
                .route("user_onboarding", r -> r
                        .path(UserServicePath.ONBOARDING.path())
                        .uri(userServiceUrl))
                .route("user_me", r -> r
                        .path(UserServicePath.USERS_ME.path())
                        .uri(userServiceUrl))
                .route("user_change_level", r -> r
                        .path(UserServicePath.USERS_ME_LEVEL.path())
                        .uri(userServiceUrl))
                .route("user_change_avatar", r -> r
                        .path(UserServicePath.USERS_ME_AVATAR.path())
                        .uri(userServiceUrl))
                .route("user_change_topics", r -> r
                        .path(UserServicePath.USERS_ME_TOPICS.path())
                        .uri(userServiceUrl))
                .route("user_change_theme", r -> r
                        .path(UserServicePath.USERS_ME_THEME.path())
                        .uri(userServiceUrl))
                .route("references", r -> r
                        .path(UserServicePath.REFERENCES.path())
                        .uri(userServiceUrl))
                .build();
    }
}
