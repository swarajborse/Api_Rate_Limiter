package limiter.dto;

import limiter.algorithm.AlgorithmType;

import java.time.Instant;
import java.util.UUID;

public record ClientConfigurationResponse(
        UUID id,
        String clientId,
        AlgorithmType algorithm,
        int capacity,
        int refillRate,
        boolean enabled,
        Instant createdAt,
        Instant updatedAt
) {}
