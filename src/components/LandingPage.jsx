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
    // Pokédex opening animation - navigate after animation completes
    setTimeout(() => {
      navigate('/search')
    }, 1200) // Increased to 1200ms for smoother animation
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-0 md:p-4 overflow-hidden">
      {/* Pokédex Image Container */}
      <div className="w-full md:max-w-md relative">
        <div className={`relative w-full h-screen md:h-auto ${isAnimating ? 'animate-slide-out-to-left' : ''}`}>
          {/* Pokédex Image - fills screen on mobile, contained on desktop */}
          <img
            src="/Pokedex-Start page.jpeg"
            alt="Closed Pokédex Device"
            className="w-full h-full md:h-auto object-cover md:object-contain md:rounded-lg shadow-2xl"
          />

          {/* "Pokédex" Title - positioned ABOVE the hinge line at 20% */}
          <div className="absolute top-[20%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <h1
              className="text-5xl md:text-6xl font-bold tracking-wider"
              style={{
                fontFamily: 'Pokemon, sans-serif',
                color: '#FFCB05',
                textShadow: `
                  -3px -3px 0 #3D7DCA,
                  3px -3px 0 #3D7DCA,
                  -3px 3px 0 #3D7DCA,
                  3px 3px 0 #3D7DCA,
                  -3px 0 0 #3D7DCA,
                  3px 0 0 #3D7DCA,
                  0 -3px 0 #3D7DCA,
                  0 3px 0 #3D7DCA,
                  0 0 20px rgba(255,203,5,0.6)
                `,
                WebkitTextStroke: '1px #003A70'
              }}
            >
              Pokédex
            </h1>
          </div>

          {/* Professor Oak - positioned at 60% (down 5% from 55%) */}
          <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <img
              src="/professor-oak.png"
              alt="Professor Oak presenting Pokédex"
              className="w-48 md:w-64 h-auto object-contain animate-float"
              style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))' }}
            />
          </div>

          {/* Clickable Triangle/Arrow (Bottom Left) - moved up to 5.5% */}
          <button
            onClick={handleEnter}
            disabled={isAnimating}
            className="absolute bottom-[5.5%] left-[0.5%] w-20 h-20 md:bottom-[6.5%] md:left-[1.5%] md:w-24 md:h-24 cursor-pointer hover:scale-125 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Enter Pokédex"
            style={{
              background: 'transparent',
              border: 'none',
            }}
          >
            {/* Blinking arrow overlay on the triangle */}
            <div className="w-full h-full flex items-center justify-center">
              <span
                className="text-yellow-400 text-4xl md:text-5xl font-bold animate-blink"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(255,203,5,0.8))',
                  transform: 'rotate(0deg)'
                }}
              >
                ▶
              </span>
            </div>
          </button>
        </div>

        {/* Attribution - hidden on mobile, visible on desktop */}
        <div className="hidden md:block text-center mt-6 text-white/60 text-sm">
          <p>Interactive Pokédex Experience</p>
          <p className="text-xs mt-1">Powered by PokéAPI</p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
