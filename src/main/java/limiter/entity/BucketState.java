package limiter.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.time.Instant;
import java.time.temporal.Temporal;
import java.util.UUID;
import jakarta.persistence.Version;

@Entity
@Table(name = "bucket_state")
@Data
public class BucketState {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "client_id", nullable = false, unique = true)
    private String clientId;

    @PositiveOrZero
    @Column(nullable = false)
    public int availableTokens;

    @Column(nullable = false)
    public Instant lastRefillTime;

    @Version
    @Column
    private Long version;




}