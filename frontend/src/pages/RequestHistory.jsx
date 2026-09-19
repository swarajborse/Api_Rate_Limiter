import { useDashboard } from '../hooks/useDashboard';
import RequestTable from '../components/RequestTable';

export default function RequestHistory() {
  const { requestHistory, clients } = useDashboard();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark-50">Request History</h1>
        <p className="text-sm text-dark-400 mt-1">
          All rate limiter requests · {requestHistory.length} total
        </p>
      </div>

      <div className="bg-dark-700 border border-dark-600 rounded-xl p-5">
        <RequestTable history={requestHistory} clients={clients} />
      </div>
    </div>
  );
}
