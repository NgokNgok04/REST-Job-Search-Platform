export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-4">
          <span className="text-3xl font-bold text-blue-600">Linked</span>
          <span className="text-3xl font-bold text-gray-700">in</span>
        </div>

        {/* Loading Bar */}
        <div className="relative w-48 h-1 bg-gray-300 overflow-hidden rounded">
          <div className="absolute h-full bg-blue-600 animate-loading-bar">
            LOADINGGG
          </div>
        </div>
      </div>
    </div>
  );
}
