package limiter.service;

import limiter.dto.RateLimitRequest;
import limiter.dto.RateLimitResponse;

public interface RateLimiterService {

    RateLimitResponse checkRateLimit(
            RateLimitRequest request
    );
}
