package limiter.service;

import limiter.algorithm.AlgorithmType;
import limiter.dto.BucketStateResponse;
import limiter.dto.ClientConfigurationRequest;
import limiter.dto.ClientConfigurationResponse;
import limiter.entity.ClientConfiguration;
import limiter.exception.ClientAlreadyExistsException;
import limiter.exception.ClientConfigurationNotFoundException;
import limiter.repository.ClientConfigurationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final ClientConfigurationRepository clientConfigurationRepository;
    private final StringRedisTemplate redisTemplate;

    @Override
    public ClientConfigurationResponse createClient(ClientConfigurationRequest request) {
        if (clientConfigurationRepository.existsByClientId(request.clientId())) {
            throw new ClientAlreadyExistsException(
                    "Client already exists: " + request.clientId());
        }

        ClientConfiguration config = new ClientConfiguration();
        config.setClientId(request.clientId());
        config.setAlgorithm(AlgorithmType.TOKEN_BUCKET);
        config.setCapacity(request.capacity());
        config.setRefillRate(request.refillRate());
        config.setEnabled(request.enabled());
        config.setCreatedAt(Instant.now());
        config.setUpdatedAt(Instant.now());

        ClientConfiguration saved = clientConfigurationRepository.save(config);
        return toResponse(saved);
    }

    @Override
    public List<ClientConfigurationResponse> getAllClients() {
        return clientConfigurationRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public ClientConfigurationResponse getClientByClientId(String clientId) {
        ClientConfiguration config = clientConfigurationRepository
                .findByClientId(clientId)
                .orElseThrow(() ->
                        new ClientConfigurationNotFoundException(
                                "Configuration not found for client: " + clientId));
        return toResponse(config);
    }

    @Override
    public ClientConfigurationResponse updateClient(String clientId, ClientConfigurationRequest request) {
        ClientConfiguration config = clientConfigurationRepository
                .findByClientId(clientId)
                .orElseThrow(() ->
                        new ClientConfigurationNotFoundException(
                                "Configuration not found for client: " + clientId));

        config.setCapacity(request.capacity());
        config.setRefillRate(request.refillRate());
        config.setEnabled(request.enabled());
        config.setUpdatedAt(Instant.now());

        ClientConfiguration saved = clientConfigurationRepository.save(config);
        return toResponse(saved);
    }

    @Override
    public ClientConfigurationResponse deactivateClient(String clientId) {
        ClientConfiguration config = clientConfigurationRepository
                .findByClientId(clientId)
                .orElseThrow(() ->
                        new ClientConfigurationNotFoundException(
                                "Configuration not found for client: " + clientId));

        config.setEnabled(false);
        config.setUpdatedAt(Instant.now());

        ClientConfiguration saved = clientConfigurationRepository.save(config);
        return toResponse(saved);
    }

    @Override
    public void deleteClient(String clientId) {
        ClientConfiguration config = clientConfigurationRepository
                .findByClientId(clientId)
                .orElseThrow(() ->
                        new ClientConfigurationNotFoundException(
                                "Configuration not found for client: " + clientId));

        redisTemplate.delete("bucket:" + clientId);
        clientConfigurationRepository.delete(config);
    }

    @Override
    public BucketStateResponse getBucketState(String clientId) {
        var entries = redisTemplate.opsForHash()
                .entries("bucket:" + clientId);

        if (entries.isEmpty()) {
            return new BucketStateResponse(clientId, 0, 0);
        }

        int availableTokens = entries.containsKey("availableTokens")
                ? Integer.parseInt(entries.get("availableTokens").toString())
                : 0;
        long lastRefillTime = entries.containsKey("lastRefillTime")
                ? Long.parseLong(entries.get("lastRefillTime").toString())
                : 0;

        return new BucketStateResponse(clientId, availableTokens, lastRefillTime);
    }

    private ClientConfigurationResponse toResponse(ClientConfiguration config) {
        return new ClientConfigurationResponse(
                config.getId(),
                config.getClientId(),
                config.getAlgorithm(),
                config.getCapacity(),
                config.getRefillRate(),
                config.isEnabled(),
                config.getCreatedAt(),
                config.getUpdatedAt()
        );
    }
}
