package limiter.algorithm.model;

import limiter.entity.BucketState;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlgorithmResult {
    private boolean allowed;

    private int remainingTokens;

    private long retryAfterSeconds;

    private BucketState updatedBucketState;
}
