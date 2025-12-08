export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-gray-800 border-t-pink-500 animate-spin" />
          <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-b-pink-400 animate-spin animation-delay-150" />
        </div>
        <p className="text-sm text-gray-400 animate-pulse">Loading...</p>
      </div>
    </div>
  )
}
