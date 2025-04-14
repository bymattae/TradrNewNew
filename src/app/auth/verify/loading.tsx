export default function LoadingVerify() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="h-8 w-48 bg-zinc-800 rounded-lg animate-pulse mx-auto mb-2"></div>
          <div className="h-4 w-64 bg-zinc-800 rounded-lg animate-pulse mx-auto"></div>
        </div>

        <div className="flex justify-center gap-2 my-8">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="w-12 h-12 bg-zinc-800 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>

        <div className="h-12 bg-zinc-800 rounded-lg animate-pulse"></div>

        <div className="text-center">
          <div className="h-4 w-32 bg-zinc-800 rounded-lg animate-pulse mx-auto"></div>
        </div>
      </div>
    </div>
  );
} 