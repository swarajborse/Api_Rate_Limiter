--------------------------------------------------
-- INPUTS
--------------------------------------------------

local key = KEYS[1]

local capacity = tonumber(ARGV[1])
local refillRate = tonumber(ARGV[2])      -- tokens / second
local currentTime = tonumber(ARGV[3])     -- milliseconds
local requestCost = tonumber(ARGV[4])

--------------------------------------------------
-- READ CURRENT BUCKET
--------------------------------------------------

local availableTokens =
    tonumber(redis.call('HGET', key, 'availableTokens'))

local lastRefillTime =
    tonumber(redis.call('HGET', key, 'lastRefillTime'))

--------------------------------------------------
-- FIRST REQUEST
--------------------------------------------------

if availableTokens == nil then

    availableTokens = capacity - requestCost
    lastRefillTime = currentTime

    redis.call(
        'HSET',
        key,
        'availableTokens', availableTokens,
        'lastRefillTime', lastRefillTime
    )

    return {
        1,                  -- allowed
        availableTokens,    -- remaining tokens
        0                   -- retryAfter(ms)
    }

end

--------------------------------------------------
-- REFILL TOKENS
--------------------------------------------------

local elapsedTime = currentTime - lastRefillTime

-- whole tokens earned
local tokensToAdd =
    math.floor((elapsedTime * refillRate) / 1000)

if tokensToAdd > 0 then

    availableTokens =
        math.min(
            capacity,
            availableTokens + tokensToAdd
        )

    --------------------------------------------------
    -- Preserve leftover milliseconds
    --------------------------------------------------

    lastRefillTime =
        lastRefillTime +
        math.floor((tokensToAdd * 1000) / refillRate)

end

--------------------------------------------------
-- CHECK REQUEST
--------------------------------------------------

local allowed = 0
local retryAfter = 0

if availableTokens >= requestCost then

    availableTokens =
        availableTokens - requestCost

    allowed = 1

else

    --------------------------------------------------
    -- Time until next token
    --------------------------------------------------

    -- ms needed for 1 token minus time already elapsed since last refill
    retryAfter =
        math.ceil(
            (1000 / refillRate) - (currentTime - lastRefillTime)
        )

    if retryAfter < 0 then
        retryAfter = 0
    end

end

--------------------------------------------------
-- SAVE BUCKET
--------------------------------------------------

redis.call(
    'HSET',
    key,
    'availableTokens', availableTokens,
    'lastRefillTime', lastRefillTime
)

--------------------------------------------------
-- RETURN RESULT
--------------------------------------------------

return {
    allowed,
    availableTokens,
    retryAfter
}