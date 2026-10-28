package polyglotus.api_gateway.service;

import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
public class RedisRateLimiterService {

    private final ReactiveRedisTemplate<String, String> redisTemplate;

    private static final String IP_PREFIX = "rateLimit:ip:";
    private static final String USER_PREFIX = "rateLimit:user:";

    private static final String SEPARATOR = ":";

    private static final long TTL_SECONDS = 60;

    public RedisRateLimiterService(ReactiveRedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public Mono<Boolean> checkIpLimit(String action, String ip, int limit) {
        String key = IP_PREFIX + action + SEPARATOR + ip + SEPARATOR + getCurrentMinute();
        return this.incrementAndCheck(key, limit);
    }

    public Mono<Boolean> checkUserLimit(String action, String userId, int limit) {
        String key = USER_PREFIX + action + SEPARATOR + userId + SEPARATOR + getCurrentMinute();
        return this.incrementAndCheck(key, limit);
    }

    public Mono<Boolean> incrementAndCheck(String key, int limit) {
        return redisTemplate.opsForValue()
                .increment(key)
                .flatMap(count -> {
                    if (count == 1) {
                        return redisTemplate.expire(key, Duration.ofSeconds(TTL_SECONDS))
                                .thenReturn(count <= limit);
                    }
                    else {
                        return Mono.just(count <= limit);
                    }
                });
    }

    private String getCurrentMinute() {
        return String.valueOf(LocalDateTime.now().getMinute());
    }
}
