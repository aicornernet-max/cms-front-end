export default function FullScreenLoader() {
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  );
}