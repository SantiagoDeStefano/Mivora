
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <div className={`w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center text-white font-bold ${className}`}>
      M
    </div>
  )
}
