package limiter.repository;

import limiter.algorithm.AlgorithmType;
import limiter.entity.ClientConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ClientConfigurationRepository extends JpaRepository<ClientConfiguration, UUID> {

    Optional<ClientConfiguration> findByClientId(String clientId);

    boolean existsByClientId(String clientId);
}
