package limiter.benchmark;

public final class BenchmarkConfig {

    private BenchmarkConfig() {}

    public static final String BASE_URL =
            "http://localhost:8080/api/v1/rate-limit/check";

    public static final String CLIENT_ID = "client1";

    public static final int REQUEST_COST = 1;

    // Concurrency
    public static final int THREAD_POOL_SIZE = 100;

    public static final int TOTAL_REQUESTS = 1000;

    // Expected Results
    public static final int BUCKET_CAPACITY = 100;

}