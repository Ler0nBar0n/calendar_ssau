export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-[calc(100vw-3rem)] sm:max-w-md bg-[#1E293B] text-white px-5 py-3.5 rounded-2xl shadow-xl border border-white/10 font-medium break-words">
      {message}
    </div>
  );
}