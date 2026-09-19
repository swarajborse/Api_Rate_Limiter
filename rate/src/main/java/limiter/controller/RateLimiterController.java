package limiter.controller;

import jakarta.validation.Valid;
import limiter.dto.RateLimitRequest;
import limiter.dto.RateLimitResponse;
import limiter.service.RateLimiterService;
import limiter.service.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/rate-limit")
@RequiredArgsConstructor
public class RateLimiterController {

    private final RateLimiterService rateLimiterService;
    private final RedisService redisService;


    @PostMapping("/check")
    public ResponseEntity<RateLimitResponse> checkRateLimit(@Valid @RequestBody RateLimitRequest request) {
        RateLimitResponse response = rateLimiterService.checkRateLimit(request);

        return ResponseEntity.ok(response);

    }

}
