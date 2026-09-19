package limiter.dto;

public record BucketStateResponse(
        String clientId,
        int availableTokens,
        long lastRefillTime
) {}
