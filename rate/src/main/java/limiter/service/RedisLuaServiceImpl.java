package limiter.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RedisLuaServiceImpl implements RedisLuaService {

    private final StringRedisTemplate redisTemplate;
    private final RedisScript<List> tokenBucketScript;

    @Override
    public List<Object> executeTokenBucket(
            String clientId,
            int capacity,
            int refillRate,
            int requestCost
    ) {

        return redisTemplate.execute(
                tokenBucketScript,
                List.of("bucket:" + clientId),
                String.valueOf(capacity),
                String.valueOf(refillRate),
                String.valueOf(System.currentTimeMillis()),
                String.valueOf(requestCost)
        );
    }
}