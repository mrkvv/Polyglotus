package polyglotus.user_service.repository;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Repository
public class RedisRepository {

    private static final String KEY_PREFIX = "session:";
    private static final Duration SESSION_TTL = Duration.ofHours(24);

    private static final String USER_ID_FIELD = "user_id";
    private static final String EXPIRES_AT_FIELD = "expires_at";

    private final StringRedisTemplate redisTemplate;

    public RedisRepository(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public String createSession(Integer userId) {
        String token = UUID.randomUUID().toString();
        String key = KEY_PREFIX + token;

        redisTemplate.opsForHash().putAll(key, Map.of(
                USER_ID_FIELD, userId.toString(),
                EXPIRES_AT_FIELD, Instant.now().plus(SESSION_TTL).toString()
        ));
        redisTemplate.expire(key, SESSION_TTL);

        return token;
    }

    public void deleteSession(String token) {
        redisTemplate.delete(KEY_PREFIX + token);
    }
}
