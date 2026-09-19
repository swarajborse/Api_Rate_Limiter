//package limiter.service;
//
//import limiter.redis.RedisBucketState;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.stereotype.Service;
//
//@Service
//public class RedisBucketServiceImpl implements RedisBucketService {
//
//    private static final String PREFIX = "bucket:";
//
//    private final RedisTemplate<String, RedisBucketState> redisTemplate;
//
//    public RedisBucketServiceImpl(
//            RedisTemplate<String, RedisBucketState> redisTemplate) {
//        this.redisTemplate = redisTemplate;
//    }
//
//    @Override
//    public RedisBucketState getBucket(String clientId) {
//        return redisTemplate.opsForValue().get(PREFIX + clientId);
//    }
//
//    @Override
//    public void saveBucket(RedisBucketState bucket) {
//        redisTemplate.opsForValue()
//                .set(PREFIX + bucket.getClientId(), bucket);
//    }
//
//    @Override
//    public void deleteBucket(String clientId) {
//        redisTemplate.delete(PREFIX + clientId);
//    }
//}