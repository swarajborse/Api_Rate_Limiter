package limiter.dto;

public record RateLimitResponse(
        boolean allowed,
        int remainingTokens,
        long retryAfterMillis
) {}



