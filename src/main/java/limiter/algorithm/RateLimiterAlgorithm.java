package limiter.algorithm;

import limiter.algorithm.model.AlgorithmResult;
import limiter.dto.RateLimitRequest;
import limiter.entity.BucketState;
import limiter.entity.ClientConfiguration;

public interface RateLimiterAlgorithm {
    AlgorithmResult execute(
            ClientConfiguration configuration,
            BucketState bucketState,
            RateLimitRequest request
    );

}
