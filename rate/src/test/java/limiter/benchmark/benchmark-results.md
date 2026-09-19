API Rate Limiter Benchmark
(Redis+Lua)

Environment
-----------
Requests          : 1000
Thread Pool       : 100
Bucket Capacity   : 100

Results
-------
Allowed           : 100
Rejected          : 900
HTTP Errors       : 0
Exceptions        : 0

Performance
-----------
Execution Time    : 1.42 sec
Throughput        : 704 req/sec
Average Latency   : 123 ms
P50              : 114 ms
P95              : 257 ms
P99              : 344 ms
Max Latency       : 428 ms




API Rate Limiter Benchmark
(PostgreSQL)

Environment
-----------
Requests          : 1000
Thread Pool       : 100
Bucket Capacity   : 100

Results
-------
Allowed           : 100
Rejected          : 900
HTTP Errors       : 0
Exceptions        : 0

Performance
-----------
Execution Time    : 2.74 sec
Throughput        : 365 req/sec
Average Latency   : 255 ms
P50              : 187 ms
P95              : 603 ms
P99              : 822 ms
Max Latency       : 1168 ms







**__Benchmark Results__**

Metric                  PostgreSQL      Redis + Lua    Improvement
  ----------------- ---------------- ---------------- --------------
Throughput          364.99 req/sec   704.35 req/sec        +92.98%
Average Latency         255.312 ms       123.257 ms   51.72% lower
P95 Latency             603.242 ms       257.278 ms   57.35% lower
P99 Latency             822.636 ms       344.683 ms   58.10% lower
Maximum Latency        1168.066 ms       428.960 ms   63.28% lower

 **Correctness Validation**

-   Allowed Requests: 100
-   Rejected Requests: 900
-   HTTP Errors: 0
-   Exceptions: 0

 **Key Findings**

-   Redis reduced average request latency by approximately 52%.
-   Redis increased throughput by approximately 93%.
-   Redis Lua scripts maintained atomic token updates under concurrent
    load.
  -   Zero HTTP errors and zero exceptions occurred during the benchmark.