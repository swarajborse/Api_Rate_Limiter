package limiter.service;

import java.util.List;

public interface RedisLuaService {

    List<Object> executeTokenBucket(
            String clientId,
            int capacity,
            int refillRate,
            int requestCost
    );

}