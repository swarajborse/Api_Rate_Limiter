package limiter.benchmark;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.net.http.HttpClient;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.*;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class ConcurrencyBenchmark {

    @Test
    void shouldHandleConcurrentRequestsCorrectly() throws Exception {

        ExecutorService executorService =
                Executors.newFixedThreadPool(
                        BenchmarkConfig.THREAD_POOL_SIZE
                );

        HttpClient httpClient =
                HttpClient.newBuilder()
                        .connectTimeout(Duration.ofSeconds(5))
                        .build();

        ObjectMapper objectMapper = new ObjectMapper();

        BenchmarkResult benchmarkResult = new BenchmarkResult();

        CountDownLatch startLatch = new CountDownLatch(1);

        List<Future<Void>> futures = new ArrayList<>();

        long benchmarkStart = System.nanoTime();

        // Submit all benchmark tasks
        for (int i = 0; i < BenchmarkConfig.TOTAL_REQUESTS; i++) {

            futures.add(
                    executorService.submit(
                            new BenchmarkTask(
                                    httpClient,
                                    objectMapper,
                                    benchmarkResult,
                                    startLatch
                            )
                    )
            );

        }

        // Start all requests simultaneously
        startLatch.countDown();

        // Wait for completion
        for (Future<Void> future : futures) {
            future.get();
        }

        long benchmarkEnd = System.nanoTime();

        benchmarkResult.setExecutionTime(
                benchmarkEnd - benchmarkStart
        );

        executorService.shutdown();

        executorService.awaitTermination(
                1,
                TimeUnit.MINUTES
        );

        // -------------------------------
        // Calculate Statistics
        // -------------------------------

        long totalRequests =
                benchmarkResult.getAllowedRequests().get()
                        + benchmarkResult.getRejectedRequests().get();

        double averageLatencyMs =
                benchmarkResult.getTotalLatency().get()
                        / 1_000_000.0
                        / totalRequests;

        double minLatencyMs =
                benchmarkResult.getMinLatency().get()
                        / 1_000_000.0;

        double maxLatencyMs =
                benchmarkResult.getMaxLatency().get()
                        / 1_000_000.0;

        double executionTimeSeconds =
                benchmarkResult.getExecutionTime()
                        / 1_000_000_000.0;

        double throughput =
                totalRequests / executionTimeSeconds;

        // -------------------------------
        // Percentiles
        // -------------------------------

        List<Long> latencies =
                new ArrayList<>(
                        benchmarkResult.getLatencies()
                );

        Collections.sort(latencies);

        double p50 =
                percentile(latencies, 50) / 1_000_000.0;

        double p95 =
                percentile(latencies, 95) / 1_000_000.0;

        double p99 =
                percentile(latencies, 99) / 1_000_000.0;

        // -------------------------------
        // Print Benchmark Report
        // -------------------------------

        System.out.println();
        System.out.println("========================================");
        System.out.println("      API RATE LIMITER BENCHMARK");
        System.out.println("========================================");

        System.out.printf(
                "Total Requests      : %d%n",
                BenchmarkConfig.TOTAL_REQUESTS
        );

        System.out.printf(
                "Thread Pool Size    : %d%n",
                BenchmarkConfig.THREAD_POOL_SIZE
        );

        System.out.printf(
                "Allowed Requests    : %d%n",
                benchmarkResult.getAllowedRequests().get()
        );

        System.out.printf(
                "Rejected Requests   : %d%n",
                benchmarkResult.getRejectedRequests().get()
        );

        System.out.printf(
                "HTTP Errors         : %d%n",
                benchmarkResult.getHttpErrors().get()
        );

        System.out.printf(
                "Exceptions          : %d%n",
                benchmarkResult.getExceptions().get()
        );

        System.out.println("----------------------------------------");

        System.out.printf(
                "Execution Time      : %.2f sec%n",
                executionTimeSeconds
        );

        System.out.printf(
                "Throughput          : %.2f req/sec%n",
                throughput
        );

        System.out.printf(
                "Average Latency     : %.3f ms%n",
                averageLatencyMs
        );

        System.out.printf(
                "Minimum Latency     : %.3f ms%n",
                minLatencyMs
        );

        System.out.printf(
                "Maximum Latency     : %.3f ms%n",
                maxLatencyMs
        );

        System.out.printf(
                "P50 Latency         : %.3f ms%n",
                p50
        );

        System.out.printf(
                "P95 Latency         : %.3f ms%n",
                p95
        );

        System.out.printf(
                "P99 Latency         : %.3f ms%n",
                p99
        );

        System.out.println("========================================");

        // -------------------------------
        // Assertions
        // -------------------------------

        assertEquals(
                BenchmarkConfig.BUCKET_CAPACITY,
                benchmarkResult.getAllowedRequests().get()
        );

        assertEquals(
                BenchmarkConfig.TOTAL_REQUESTS
                        - BenchmarkConfig.BUCKET_CAPACITY,
                benchmarkResult.getRejectedRequests().get()
        );

        assertEquals(
                0,
                benchmarkResult.getHttpErrors().get()
        );

        assertEquals(
                0,
                benchmarkResult.getExceptions().get()
        );

    }

    private long percentile(
            List<Long> latencies,
            int percentile
    ) {

        if (latencies.isEmpty()) {
            return 0;
        }

        int index =
                (int) Math.ceil(
                        percentile / 100.0
                                * latencies.size()
                ) - 1;

        return latencies.get(
                Math.max(0,
                        Math.min(index, latencies.size() - 1))
        );
    }

}