package limiter.service;

import jakarta.persistence.OptimisticLockException;
import jakarta.transaction.Transactional;
import limiter.algorithm.AlgorithmResolver;
import limiter.algorithm.RateLimiterAlgorithm;
import limiter.algorithm.model.AlgorithmResult;
import limiter.dto.RateLimitRequest;
import limiter.dto.RateLimitResponse;
import limiter.entity.BucketState;
import limiter.entity.ClientConfiguration;
import limiter.exception.ClientConfigurationNotFoundException;
import limiter.repository.BucketStateRepository;
import limiter.repository.ClientConfigurationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Transactional
public class RateLimiterServiceImpl implements RateLimiterService {
    private final ClientConfigurationRepository clientConfigurationRepository;

    private final BucketStateRepository bucketStateRepository;

    private final AlgorithmResolver algorithmResolver;
    int attempts = 3;


    @Autowired
    public RateLimiterServiceImpl(AlgorithmResolver algorithmResolver, BucketStateRepository bucketStateRepository, ClientConfigurationRepository clientConfigurationRepository) {
        this.algorithmResolver = algorithmResolver;
        this.bucketStateRepository = bucketStateRepository;
        this.clientConfigurationRepository = clientConfigurationRepository;
    }

    @Override
    public RateLimitResponse checkRateLimit(RateLimitRequest request) {



        ClientConfiguration clientConfiguration =
                clientConfigurationRepository.findByClientId(request.clientId())
                        .orElseThrow(() ->
                                new ClientConfigurationNotFoundException(
                                        "Configuration not found for client: " + request.clientId()));



            BucketState bucketState = bucketStateRepository.findByClientIdForUpdate(request.clientId())
                    .orElseGet(() -> {
                        BucketState state = new BucketState();
                        state.setClientId(request.clientId());
                        state.setAvailableTokens(clientConfiguration.getCapacity());
                        state.setLastRefillTime(Instant.now());
                        return state;
                    });

            RateLimiterAlgorithm algorithm =
                    algorithmResolver.resolve(clientConfiguration.getAlgorithm());

            AlgorithmResult result = algorithm.execute(
                    clientConfiguration,
                    bucketState,
                    request
            );



                bucketStateRepository.save(result.getUpdatedBucketState());

                return new RateLimitResponse(
                        result.isAllowed(),
                        result.getRemainingTokens(),
                        result.getRetryAfterSeconds()
                );

    }

}
