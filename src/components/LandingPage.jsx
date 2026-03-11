import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchPokemon } from '../services/pokeapi'

/**
 * Landing Page Component
 * Displays a closed Pokédex device with an ENTER button
 * Features rotating Pokemon card showcase and welcome message
 */
const LandingPage = () => {
  const navigate = useNavigate()
  const [isAnimating, setIsAnimating] = useState(false)
  const [pokemonRolodex, setPokemonRolodex] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Gradient backgrounds for cards (rotating colors)
  const cardGradients = [
    'linear-gradient(135deg, #FF9A56 0%, #FF6B35 100%)', // Orange
    'linear-gradient(135deg, #A8D8FF 0%, #6BB6FF 100%)', // Blue
    'linear-gradient(135deg, #B4E7CE 0%, #7ED7AF 100%)', // Green
    'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)', // Pink
    'linear-gradient(135deg, #DDA0DD 0%, #BA55D3 100%)', // Purple
    'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'  // Gold
  ]

  // Load initial random Pokemon
  useEffect(() => {
    const loadRandomPokemon = async () => {
      try {
        // Load 6 random Pokemon for the rolodex
        const randomIds = Array.from({ length: 6 }, () =>
          Math.floor(Math.random() * 1025) + 1
        )
        const pokemonData = await Promise.all(
          randomIds.map(id => fetchPokemon(id))
        )
        setPokemonRolodex(pokemonData)
      } catch (error) {
        console.error('Error loading Pokemon rolodex:', error)
      }
    }
    loadRandomPokemon()
  }, [])

  // Rotate rolodex every 3 seconds
  useEffect(() => {
    if (pokemonRolodex.length === 0) return

    const interval = setInterval(async () => {
      // Move to next card
      setCurrentIndex(prev => (prev + 1) % pokemonRolodex.length)

      // Load a new Pokemon to replace the one that's moving off screen
      try {
        const newId = Math.floor(Math.random() * 1025) + 1
        const newPokemon = await fetchPokemon(newId)
        setPokemonRolodex(prev => {
          const updated = [...prev]
          updated[(currentIndex + 3) % 6] = newPokemon // Replace the card 3 positions ahead
          return updated
        })
      } catch (error) {
        console.error('Error loading new Pokemon:', error)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [pokemonRolodex, currentIndex])

  const handleEnter = () => {
    // Haptic feedback for mobile devices
    if (navigator.vibrate) {
      navigator.vibrate(50) // Small 50ms vibration
    }

    setIsAnimating(true)
    // Pokédex opening animation - navigate after animation completes
    setTimeout(() => {
      navigate('/search')
    }, 1200) // Increased to 1200ms for smoother animation
  }

  return (
    <div className={`min-h-screen bg-black flex flex-col relative overflow-hidden ${isAnimating ? 'animate-fade-zoom-out' : ''}`}>
      {/* Top - Pokédex Title */}
      <div className="absolute top-8 left-6 md:top-12 md:left-12 z-10">
        <h1
          className="text-5xl md:text-7xl font-bold"
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
              0 0 25px rgba(255,203,5,0.6)
            `,
            WebkitTextStroke: '1.5px #003A70'
          }}
        >
          Pokédex
        </h1>
      </div>

      {/* Pokeball Icon Decoration - Center Left (Actual Pokéball colors) */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 md:left-16">
        <div className="w-64 h-64 md:w-80 md:h-80 rounded-full relative overflow-hidden" style={{ opacity: 0.15 }}>
          {/* Top half - Faded Dark Red */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-red-900/80 to-red-800/70"></div>

          {/* Bottom half - Faded White */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gray-200/60 to-white/50"></div>

          {/* Middle black band */}
          <div className="absolute top-1/2 left-0 right-0 h-3 bg-black/80 transform -translate-y-1/2"></div>

          {/* Center button - Clickable with higher z-index and opacity */}
          <button
            onClick={handleEnter}
            className="absolute top-1/2 left-1/2 w-20 h-20 md:w-24 md:h-24 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%)',
              border: '6px solid #1a1a1a',
              boxShadow: '0 0 20px rgba(255,255,255,0.3), inset 0 0 10px rgba(0,0,0,0.2)',
              opacity: 1,
              zIndex: 30
            }}
            aria-label="Enter Pokédex"
          >
            {/* Inner shine effect */}
            <div className="w-full h-full rounded-full relative overflow-hidden">
              <div
                className="absolute top-1 left-1 w-6 h-6 bg-white/60 rounded-full blur-sm"
                style={{ opacity: 0.8 }}
              ></div>
            </div>
          </button>
        </div>
      </div>

      {/* Right Side - Pokemon Rolodex (Overlapping Cards) */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 md:right-8">
        <div className="relative" style={{ height: '280px', width: '180px' }}>
          {pokemonRolodex.length > 0 && [-1, 0, 1].map((offset) => {
            const index = (currentIndex + offset + pokemonRolodex.length) % pokemonRolodex.length
            const pokemon = pokemonRolodex[index]
            const gradientIndex = index % cardGradients.length

            // Position and scale based on offset
            const isCenter = offset === 0
            const isPrev = offset === -1
            const isNext = offset === 1

            let translateY = '0px'
            let scale = 1
            let opacity = 1
            let zIndex = 10

            if (isPrev) {
              translateY = '-70px'
              scale = 0.85
              opacity = 0.6
              zIndex = 5
            } else if (isCenter) {
              translateY = '0px'
              scale = 1
              opacity = 1
              zIndex = 20
            } else if (isNext) {
              translateY = '70px'
              scale = 0.85
              opacity = 0.6
              zIndex = 5
            }

            return (
              <div
                key={`${pokemon.id}-${index}`}
                className="absolute rounded-2xl shadow-2xl cursor-pointer overflow-hidden transition-all duration-500 ease-out"
                style={{
                  background: cardGradients[gradientIndex],
                  width: '180px',
                  height: '200px',
                  transform: `translateY(${translateY}) scale(${scale})`,
                  opacity,
                  zIndex,
                  top: '50%',
                  left: '0',
                  marginTop: '-100px'
                }}
                onClick={handleEnter}
              >
                {/* Card Content */}
                <div className="flex flex-col items-center justify-between h-full p-4">
                  {/* Pokemon Image - Top */}
                  <div className="relative w-28 h-28 flex-shrink-0">
                    <img
                      src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                      alt={pokemon.name}
                      className="w-full h-full object-contain drop-shadow-2xl"
                    />
                  </div>

                  {/* Pokemon Info - Bottom */}
                  <div className="w-full text-center">
                    {/* Pokemon Name */}
                    <h3 className="text-base font-bold text-white capitalize mb-1.5 truncate"
                        style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.4)' }}>
                      {pokemon.name}
                    </h3>

                    {/* Pokemon Types */}
                    <div className="flex gap-1.5 justify-center flex-wrap">
                      {pokemon.types.map(({ type }) => (
                        <span
                          key={type.name}
                          className="text-[10px] px-2.5 py-1 rounded-full text-white font-semibold uppercase bg-white/25 backdrop-blur-sm"
                          style={{
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            border: '1px solid rgba(255,255,255,0.3)'
                          }}
                        >
                          {type.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom - Pokemon Count */}
      <div className="absolute bottom-6 left-6 md:bottom-8 md:left-12">
        <p className="text-white/70 text-sm md:text-base">
          <span className="font-bold text-white">1,025</span> Pokémon<br />in your Pokédex
        </p>
      </div>
    </div>
  )
}

export default LandingPage
