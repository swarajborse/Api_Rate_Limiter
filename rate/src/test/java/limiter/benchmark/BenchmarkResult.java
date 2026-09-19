package limiter.benchmark;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class BenchmarkResult {

    // Request Statistics
    private final AtomicInteger allowedRequests = new AtomicInteger();
    private final AtomicInteger rejectedRequests = new AtomicInteger();
    private final AtomicInteger httpErrors = new AtomicInteger();
    private final AtomicInteger exceptions = new AtomicInteger();

    // Latency Statistics (nanoseconds)
    private final AtomicLong totalLatency = new AtomicLong();
    private final AtomicLong minLatency = new AtomicLong(Long.MAX_VALUE);
    private final AtomicLong maxLatency = new AtomicLong();

    // Store every request latency (needed for P95/P99)
    private final List<Long> latencies =
            Collections.synchronizedList(new ArrayList<>());

    // Total benchmark execution time
    private long executionTime;

    public AtomicInteger getAllowedRequests() {
        return allowedRequests;
    }

    public AtomicInteger getRejectedRequests() {
        return rejectedRequests;
    }

    public AtomicInteger getHttpErrors() {
        return httpErrors;
    }

    public AtomicInteger getExceptions() {
        return exceptions;
    }

    public AtomicLong getTotalLatency() {
        return totalLatency;
    }

    public AtomicLong getMinLatency() {
        return minLatency;
    }

    public AtomicLong getMaxLatency() {
        return maxLatency;
    }

    public List<Long> getLatencies() {
        return latencies;
    }

    public long getExecutionTime() {
        return executionTime;
    }

    public void setExecutionTime(long executionTime) {
        this.executionTime = executionTime;
    }

}