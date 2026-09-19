//package limiter.algorithm;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Component;
//
//@Component
//@RequiredArgsConstructor
//public class AlgorithmResolver {
//
//    private final TokenBucketAlgorithm tokenBucketAlgorithm;
//
//    public RateLimiterAlgorithm resolve(AlgorithmType algorithmType){
//
//        return switch (algorithmType){
//
//            case TOKEN_BUCKET -> tokenBucketAlgorithm;
//
//            default -> throw new IllegalArgumentException(
//                    "Unsupported algorithm : " + algorithmType
//            );
//
//        };
//
//    }
//
//}
