package limiter.benchmark;

import com.fasterxml.jackson.databind.ObjectMapper;
import limiter.dto.RateLimitRequest;
import limiter.dto.RateLimitResponse;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.Callable;
import java.util.concurrent.CountDownLatch;

public class BenchmarkTask implements Callable<Void> {

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final BenchmarkResult benchmarkResult;
    private final CountDownLatch startLatch;

    public BenchmarkTask(
            HttpClient httpClient,
            ObjectMapper objectMapper,
            BenchmarkResult benchmarkResult,
            CountDownLatch startLatch
    ) {
        this.httpClient = httpClient;
        this.objectMapper = objectMapper;
        this.benchmarkResult = benchmarkResult;
        this.startLatch = startLatch;
    }

    @Override
    public Void call() {

        try {

            // Wait until all tasks are ready
            startLatch.await();

            // Build request DTO
            RateLimitRequest request =
                    new RateLimitRequest(
                            BenchmarkConfig.CLIENT_ID,
                            BenchmarkConfig.REQUEST_COST
                    );

            // Serialize request
            String requestBody =
                    objectMapper.writeValueAsString(request);

            // Create HTTP request
            HttpRequest httpRequest =
                    HttpRequest.newBuilder()
                            .uri(URI.create(BenchmarkConfig.BASE_URL))
                            .header("Content-Type", "application/json")
                            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                            .build();

            // Start timer
            long startTime = System.nanoTime();

            HttpResponse<String> response =
                    httpClient.send(
                            httpRequest,
                            HttpResponse.BodyHandlers.ofString()
                    );

            // Stop timer
            long endTime = System.nanoTime();

            long latency = endTime - startTime;

            // HTTP status validation
            if (response.statusCode() != 200) {

                System.out.println("Status : " + response.statusCode());
                System.out.println("Body   : " + response.body());

                benchmarkResult.getHttpErrors().incrementAndGet();
                return null;
            }

            // Deserialize response
            RateLimitResponse rateLimitResponse =
                    objectMapper.readValue(
                            response.body(),
                            RateLimitResponse.class
                    );

            // Allowed / Rejected
            if (rateLimitResponse.allowed()) {
                benchmarkResult.getAllowedRequests().incrementAndGet();
            } else {
                benchmarkResult.getRejectedRequests().incrementAndGet();
            }

            // Update latency statistics
            benchmarkResult.getTotalLatency().addAndGet(latency);

            benchmarkResult.getMinLatency()
                    .accumulateAndGet(latency, Math::min);

            benchmarkResult.getMaxLatency()
                    .accumulateAndGet(latency, Math::max);

            // Store individual latency
            benchmarkResult.getLatencies().add(latency);

        } catch (Exception e) {

            benchmarkResult.getExceptions().incrementAndGet();

        }

        return null;
    }
}