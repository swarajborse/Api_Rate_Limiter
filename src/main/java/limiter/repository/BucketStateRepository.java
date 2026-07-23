package limiter.repository;

import jakarta.persistence.LockModeType;
import limiter.entity.BucketState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface BucketStateRepository extends JpaRepository<BucketState, UUID> {

  Optional<BucketState> findByClientId(String clientId);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("""
       SELECT b
       FROM BucketState b
       WHERE b.clientId = :clientId
       """)
  Optional<BucketState> findByClientIdForUpdate(
          @Param("clientId") String clientId
  );
}
