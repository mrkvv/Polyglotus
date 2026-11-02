package polyglotus.api_gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import polyglotus.api_gateway.service.RedisSessionService;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class AuthFilter implements GlobalFilter, Ordered {

    private static final List<String> PUBLIC_PATHS = List.of(
            "/auth/yandex",
            "/auth/logout",
            "/references"
    );

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String X_USER_ID_HEADER = "X-User-Id";
    private static final String BEARER_PREFIX = "Bearer ";
    private static final String USER_ID_REDIS_KEY = "user_id";

    private static final String UNAUTHORIZED_ERROR = "UNAUTHORIZED";

    private final RedisSessionService sessionService;

    public AuthFilter(RedisSessionService sessionService) {
        this.sessionService = sessionService;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getPath().toString();

        if (isPublicPath(path)) return chain.filter(exchange);

        String authHeaderValue = exchange.getRequest()
                .getHeaders().getFirst(AUTHORIZATION_HEADER);
        if (authHeaderValue == null || !authHeaderValue.startsWith(BEARER_PREFIX)) {
            return unauthorized(exchange, "Missing or invalid Authorization header");
        }

        String token = authHeaderValue.substring(BEARER_PREFIX.length());
        return sessionService.getSession(token)
                .flatMap(sessionData -> {
                    if (sessionData.isEmpty()) {
                        return unauthorized(exchange, "Invalid or expired token");
                    }

                    String userId = (String) sessionData.get(USER_ID_REDIS_KEY);

                    if (userId == null) {
                        return unauthorized(exchange, "Invalid session data");
                    }

                    ServerWebExchange mutatedExchange = exchange.mutate()
                            .request(r -> r
                                    .header(X_USER_ID_HEADER, userId)
                                    .headers(headers -> headers.remove(AUTHORIZATION_HEADER))
                            )
                            .build();

                    return chain.filter(mutatedExchange);
                })
                .switchIfEmpty(unauthorized(exchange, "Session not found or expired"));
    }

    private boolean isPublicPath(String path) {
        return PUBLIC_PATHS.stream().anyMatch(path::startsWith);
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange, String message) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);

        String response = "{\"message\":\"" + message + "\"," +
                "\"error\": \"" + UNAUTHORIZED_ERROR + "\"}";
        DataBuffer buffer = exchange.getResponse()
                .bufferFactory()
                .wrap(response.getBytes(StandardCharsets.UTF_8));

        return exchange.getResponse().writeWith(Mono.just(buffer));
    }

    @Override
    public int getOrder() {
        return -100;
    }
}
