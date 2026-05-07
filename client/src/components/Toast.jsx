export default function Toast({ message, type, isVisible }) {
  if (!isVisible) return null;

  const bgColor =
    type === 'success'
      ? 'bg-green-500'
      : type === 'error'
      ? 'bg-red-500'
      : 'bg-blue-500';

  return (
    <div
      className={`fixed bottom-6 right-6 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-bottom-5 duration-300`}
    >
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
