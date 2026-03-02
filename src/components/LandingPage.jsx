import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

/**
 * Landing Page Component
 * Displays a closed Pokédex device with an ENTER button
 * Features 3D-styled red Pokédex with iconic design elements
 */
const LandingPage = () => {
  const navigate = useNavigate()
  const [isAnimating, setIsAnimating] = useState(false)

  const handleEnter = () => {
    setIsAnimating(true)
    // Simulate Pokédex opening animation
    setTimeout(() => {
      navigate('/search')
    }, 800)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Closed Pokédex Device */}
        <div className={`transition-all duration-800 ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
          <div className="pokedex-frame p-8 relative">
            {/* Top decorative section */}
            <div className="flex items-center gap-4 mb-8">
              {/* Main blue lens */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg relative overflow-hidden">
                  <div className="absolute top-2 left-2 w-6 h-6 bg-white/40 rounded-full"></div>
                  <div className={`absolute inset-0 bg-blue-400/30 ${isAnimating ? '' : 'animate-pulse'}`}></div>
                </div>
                {/* Lens border */}
                <div className="absolute -inset-1 rounded-full border-4 border-white/20"></div>
              </div>

              {/* Small indicator lights */}
              <div className="flex gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500 shadow-md"></div>
                <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-md"></div>
                <div className="w-4 h-4 rounded-full bg-green-500 shadow-md"></div>
              </div>
            </div>

            {/* Main screen area (closed) */}
            <div className="bg-slate-900 rounded-lg p-6 mb-6 shadow-inner">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-24 h-24 relative animate-float">
                    {/* Pokéball icon */}
                    <div className="w-full h-full rounded-full border-4 border-slate-700 overflow-hidden relative">
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-red-500"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-4 border-slate-700">
                        <div className="absolute inset-2 rounded-full bg-slate-800"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <h1 className="text-4xl font-bold text-white text-shadow">
                  POKÉDEX
                </h1>
                <p className="text-slate-400 text-sm">
                  National Pokédex Database
                </p>
                <p className="text-pokedex-yellow text-xs font-mono">
                  Gen I - IX | 1025 Pokémon
                </p>
              </div>
            </div>

            {/* Control panel */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* D-pad simulation */}
              <div className="flex items-center justify-center">
                <div className="relative w-20 h-20">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-8 bg-slate-800 rounded-t"></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-8 bg-slate-800 rounded-b"></div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-6 bg-slate-800 rounded-l"></div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-6 bg-slate-800 rounded-r"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-slate-900 rounded"></div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-500 shadow-md"></div>
                <div className="w-10 h-10 rounded-full bg-red-400 shadow-md"></div>
              </div>
            </div>

            {/* ENTER button */}
            <button
              onClick={handleEnter}
              disabled={isAnimating}
              className="w-full pokedex-button pokedex-button-primary text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnimating ? 'OPENING...' : 'ENTER POKÉDEX'}
            </button>

            {/* Bottom hinge indicator */}
            <div className="mt-6 flex justify-center gap-1">
              <div className="w-16 h-1 bg-slate-800 rounded"></div>
            </div>
          </div>

          {/* Attribution */}
          <div className="text-center mt-6 text-white/60 text-sm">
            <p>Interactive Pokédex Experience</p>
            <p className="text-xs mt-1">Powered by PokéAPI</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
