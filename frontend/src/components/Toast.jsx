import { useDashboard } from '../hooks/useDashboard';

export default function Toast() {
  const { toast } = useDashboard();

  if (!toast) return null;

  const bgColor =
    toast.type === 'success'
      ? 'bg-emerald-500/90'
      : toast.type === 'error'
      ? 'bg-red-500/90'
      : 'bg-amber-500/90';

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
      <div className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg text-sm font-medium max-w-sm`}>
        {toast.message}
      </div>
    </div>
  );
}
