package limiter.service;

import limiter.dto.RateLimitRequest;
import limiter.dto.RateLimitResponse;
import limiter.entity.ClientConfiguration;
import limiter.exception.ClientConfigurationNotFoundException;
import limiter.repository.ClientConfigurationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class RateLimiterServiceImpl implements RateLimiterService {

    private final ClientConfigurationRepository clientConfigurationRepository;

    private final RedisLuaService redisLuaService;


    @Override
    public RateLimitResponse checkRateLimit(RateLimitRequest request) {

        ClientConfiguration clientConfiguration =
                clientConfigurationRepository
                        .findByClientId(request.clientId())
                        .orElseThrow(() ->
                                new ClientConfigurationNotFoundException(
                                        "Configuration not found for client: "
                                                + request.clientId()));



        List<Object> result =
                redisLuaService.executeTokenBucket(
                        request.clientId(),
                        clientConfiguration.getCapacity(),
                        clientConfiguration.getRefillRate(),
                        request.requestCost()
                );

        boolean allowed =
                ((Long) result.get(0)) == 1;

        int remainingTokens =
                ((Long) result.get(1)).intValue();

        long retryAfterMillis =
                ((Long) result.get(2));

        return new RateLimitResponse(
                allowed,
                remainingTokens,
                retryAfterMillis
        );


    }
}

