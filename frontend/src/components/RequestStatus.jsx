export default function RequestStatus({ entry }) {
  if (!entry) return null;

  const isAllowed = entry.status === 'ALLOWED';
  const isError = entry.status === 'ERROR';

  return (
    <div
      className={`rounded-xl border p-5 ${
        isError
          ? 'bg-gray-500/10 border-gray-500/20'
          : isAllowed
          ? 'bg-emerald-500/10 border-emerald-500/20'
          : 'bg-red-500/10 border-red-500/20'
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
            isError
              ? 'bg-gray-500/20 text-gray-400'
              : isAllowed
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-red-500/20 text-red-400'
          }`}
        >
          {isError ? '!' : isAllowed ? '✓' : '✕'}
        </div>
        <div>
          <p
            className={`text-lg font-bold ${
              isError ? 'text-gray-400' : isAllowed ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {isError ? 'ERROR' : isAllowed ? 'ALLOWED' : 'RATE LIMITED'}
          </p>
          <p className="text-xs text-dark-400">{entry.timestamp}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-dark-800 rounded-lg p-2.5">
          <p className="text-[11px] text-dark-400 uppercase">Remaining</p>
          <p className="text-lg font-bold text-dark-100">{entry.remainingTokens}</p>
        </div>
        <div className="bg-dark-800 rounded-lg p-2.5">
          <p className="text-[11px] text-dark-400 uppercase">Retry After</p>
          <p className="text-lg font-bold text-dark-100">
            {entry.retryAfterMillis > 0 ? `${entry.retryAfterMillis}ms` : 'N/A'}
          </p>
        </div>
        <div className="bg-dark-800 rounded-lg p-2.5">
          <p className="text-[11px] text-dark-400 uppercase">Response Time</p>
          <p className="text-lg font-bold text-dark-100">{entry.responseTime}ms</p>
        </div>
        <div className="bg-dark-800 rounded-lg p-2.5">
          <p className="text-[11px] text-dark-400 uppercase">HTTP Status</p>
          <p className="text-lg font-bold text-dark-100">
            {isError ? '500' : isAllowed ? '200' : '429'}
          </p>
        </div>
      </div>
    </div>
  );
}
