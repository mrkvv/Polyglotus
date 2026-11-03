package polyglotus.api_gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import polyglotus.api_gateway.service.RedisRateLimiterService;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.Map;

@Component
public class RateLimiterFilter implements GlobalFilter, Ordered {

    private static final String LOGIN_ACTION = "login";
    private static final String GET_REFERENCES_ACTION = "references";
    private static final String OTHER_ACTION = "other";

    private static final String LOGIN_PATH = "/auth/yandex";
    private static final String REFERENCES_PATH = "/references";

    private static final String X_USER_ID_HEADER = "X-User-Id";

    private static final String TOO_MANY_REQUESTS_ERROR = "TOO_MANY_REQUESTS";

    private static final Map<String, Integer> LIMITS = Map.of(
            LOGIN_ACTION,5,
            GET_REFERENCES_ACTION,5,
            OTHER_ACTION, 20
    );

    private final RedisRateLimiterService rateLimiterService;

    public RateLimiterFilter(RedisRateLimiterService rateLimiterService) {
        this.rateLimiterService = rateLimiterService;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getPath().toString();
        String action = defineAction(path);
        int limit = LIMITS.get(action);

        String ip = exchange.getRequest().getRemoteAddress().getAddress().getHostAddress();
        String userId = exchange.getRequest().getHeaders().getFirst(X_USER_ID_HEADER);

        Mono<Boolean> ipLimitCheck = rateLimiterService.checkIpLimit(action, ip, limit);
        Mono<Boolean> userLimitCheck = (userId == null) ? Mono.just(true) :
                rateLimiterService.checkUserLimit(action, userId, limit);

        return Mono.zip(userLimitCheck, ipLimitCheck)
                .flatMap(results -> {
                    boolean isUserLimitOk = results.getT1();
                    boolean isIpLimitOk = results.getT2();

                    if (isUserLimitOk && isIpLimitOk) {
                        return chain.filter(exchange);
                    } else {
                        return this.tooManyRequests(exchange, limit);
                    }
                });
    }

    private String defineAction(String path) {
        if (path.contains(LOGIN_PATH)) return LOGIN_ACTION;
        if (path.contains(REFERENCES_PATH)) return GET_REFERENCES_ACTION;
        return OTHER_ACTION;
    }

    private Mono<Void> tooManyRequests(ServerWebExchange exchange, int limit) {
        exchange.getResponse().setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);

        String response = "{\"message\":\"Too many requests. Limit: "+ limit + " per minute\"," +
                "\"error\": \"" + TOO_MANY_REQUESTS_ERROR + "\"}";
        DataBuffer buffer = exchange.getResponse()
                .bufferFactory()
                .wrap(response.getBytes(StandardCharsets.UTF_8));

        return exchange.getResponse().writeWith(Mono.just(buffer));
    }

    @Override
    public int getOrder() {
        return 10;
    }
}
