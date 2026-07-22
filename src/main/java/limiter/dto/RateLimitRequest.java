package limiter.dto;

public record RateLimitRequest(
        String clientId,
        int requestCost
) {}
