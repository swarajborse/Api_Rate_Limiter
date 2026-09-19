package limiter.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record ClientConfigurationRequest(
        @NotBlank String clientId,
        @Positive int capacity,
        @Positive int refillRate,
        boolean enabled
) {}
