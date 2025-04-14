export default function LoadingJoin() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="h-8 w-48 bg-zinc-800 rounded-lg animate-pulse mx-auto mb-2"></div>
          <div className="h-4 w-64 bg-zinc-800 rounded-lg animate-pulse mx-auto"></div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg bg-zinc-900 p-1">
            <div className="h-12 bg-zinc-800 rounded-lg animate-pulse"></div>
          </div>

          <div className="h-12 bg-zinc-800 rounded-lg animate-pulse"></div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-black px-2 text-gray-400">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-zinc-800 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
} 