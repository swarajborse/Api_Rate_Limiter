package limiter.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import limiter.algorithm.AlgorithmType;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "client_configuration",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_client_id", columnNames = "client_id")
        }
)
@Data
public class ClientConfiguration {

    @Id
    @GeneratedValue
    private UUID id;

    @NotBlank
    @Column(name = "client_id", nullable = false)
    private String clientId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public AlgorithmType algorithm;

    @Positive
    @Column(nullable = false)
    public int capacity;

    @Positive
    @Column(nullable = false)
    public int refillRate;

    @Column(nullable = false)
    private boolean enabled;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;


}