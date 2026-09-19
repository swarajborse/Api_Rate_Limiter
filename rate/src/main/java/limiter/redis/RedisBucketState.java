package limiter.redis;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RedisBucketState {

    private String clientId;
    private int availableTokens;
    private Instant lastRefillTime;

}