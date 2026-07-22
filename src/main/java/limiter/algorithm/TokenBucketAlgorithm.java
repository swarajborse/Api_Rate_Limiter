package limiter.algorithm;

import limiter.algorithm.model.AlgorithmResult;
import limiter.dto.RateLimitRequest;
import limiter.entity.BucketState;
import limiter.entity.ClientConfiguration;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;

@Component
public class TokenBucketAlgorithm implements RateLimiterAlgorithm {

    @Override
    public AlgorithmResult execute(
            ClientConfiguration configuration,
            BucketState bucketState,
            RateLimitRequest request) {

        Instant now = Instant.now();

        long elapsedSeconds =
                Duration.between(bucketState.getLastRefillTime(), now)
                        .getSeconds();

        int earnedTokens =
                (int) (elapsedSeconds * configuration.getRefillRate());

        int updatedTokens = Math.min(
                configuration.getCapacity(),
                bucketState.getAvailableTokens() + earnedTokens
        );

        bucketState.setAvailableTokens(updatedTokens);
        bucketState.setLastRefillTime(now);

        if (updatedTokens < request.requestCost()) {

            return new AlgorithmResult(false, updatedTokens, 1, bucketState);
        }

        updatedTokens -= request.requestCost();

        bucketState.setAvailableTokens(updatedTokens);

        return new AlgorithmResult(true, updatedTokens, 0, bucketState
        );
    }
}
