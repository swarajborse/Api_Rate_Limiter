package limiter.repository;

import limiter.entity.BucketState;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface BucketStateRepository extends JpaRepository<BucketState, UUID> {

  Optional<BucketState> findByClientId(String clientId);
}
