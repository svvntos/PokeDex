/**
 * Loading Spinner Component
 * Pokéball-themed loading animation
 */
const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="pokeball-spinner">
        {/* Pokéball design */}
        <div className="w-full h-full rounded-full border-4 border-slate-700 overflow-hidden relative bg-white">
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-red-500"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-4 border-slate-700 z-10">
            <div className="absolute inset-1.5 rounded-full bg-slate-800"></div>
          </div>
          {/* Horizontal band */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-700 transform -translate-y-1/2"></div>
        </div>
      </div>
      <p className="text-white mt-4 font-semibold animate-pulse">Loading...</p>
    </div>
  )
}

export default LoadingSpinner
