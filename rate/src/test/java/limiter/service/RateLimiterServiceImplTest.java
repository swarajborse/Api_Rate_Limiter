package limiter.service;

import limiter.dto.RateLimitRequest;
import limiter.dto.RateLimitResponse;
import limiter.entity.ClientConfiguration;
import limiter.exception.ClientConfigurationNotFoundException;
import limiter.repository.ClientConfigurationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RateLimiterServiceImplTest {

    @Mock
    private ClientConfigurationRepository clientConfigurationRepository;

    @Mock
    private RedisLuaService redisLuaService;

    @InjectMocks
    private RateLimiterServiceImpl rateLimiterService;


    @Test
    void shouldAllowRequestWhenTokensAreAvailable() {


        RateLimitRequest request =
                new RateLimitRequest("client1", 1);

        ClientConfiguration configuration =
                new ClientConfiguration();

        configuration.setClientId("client1");
        configuration.setCapacity(10);
        configuration.setRefillRate(2);

        when(clientConfigurationRepository.findByClientId("client1"))
                .thenReturn(Optional.of(configuration));


        when(redisLuaService.executeTokenBucket(
                "client1",
                10,
                2,
                1
        )).thenReturn(List.of(1L, 9L, 0L));


        RateLimitResponse response =
                rateLimiterService.checkRateLimit(request);

        assertTrue(response.allowed());
        assertEquals(9, response.remainingTokens());
        assertEquals(0, response.retryAfterMillis());


        verify(clientConfigurationRepository)
                .findByClientId("client1");

        verify(redisLuaService)
                .executeTokenBucket(
                        "client1",
                        10,
                        2,
                        1
                );
    }

    @Test
    void shouldThrowExceptionWhenClientConfigurationNotFound() {

        RateLimitRequest request =
                new RateLimitRequest("unknown-client", 1);

        when(clientConfigurationRepository.findByClientId("unknown-client"))
                .thenReturn(Optional.empty());

        assertThrows(
                ClientConfigurationNotFoundException.class,
                () -> rateLimiterService.checkRateLimit(request)
        );

        verify(redisLuaService, never())
                .executeTokenBucket(
                        anyString(),
                        anyInt(),
                        anyInt(),
                        anyInt()
                );
    }

    @Test
    void shouldRejectRequestWhenTokensAreExhausted() {

        RateLimitRequest request =
                new RateLimitRequest("client1", 1);

        ClientConfiguration configuration =
                new ClientConfiguration();

        configuration.setClientId("client1");
        configuration.setCapacity(10);
        configuration.setRefillRate(2);

        when(clientConfigurationRepository.findByClientId("client1"))
                .thenReturn(Optional.of(configuration));

        when(redisLuaService.executeTokenBucket(
                "client1",
                10,
                2,
                1
        )).thenReturn(List.of(0L, 0L, 5L));

        RateLimitResponse response =
                rateLimiterService.checkRateLimit(request);

        assertFalse(response.allowed());
        assertEquals(0, response.remainingTokens());
        assertEquals(5, response.retryAfterMillis());

        verify(clientConfigurationRepository)
                .findByClientId("client1");

        verify(redisLuaService)
                .executeTokenBucket(
                        "client1",
                        10,
                        2,
                        1
                );
    }

}