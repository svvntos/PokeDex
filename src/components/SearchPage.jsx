import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePokemon } from '../context/PokemonContext'
import { fetchPokemon, getRandomPokemonId, getTypeColor, fetchPokemonSuggestions } from '../services/pokeapi'
import LoadingSpinner from './LoadingSpinner'

/**
 * Search Page Component
 * Displays an open Pokédex with search functionality using background image
 * Search bar positioned in the middle
 * Bottom aqua blue area has "Search Random Pokémon" text with Pokemon font
 */
const SearchPage = () => {
  const navigate = useNavigate()
  const { setSelectedPokemon, addToHistory, cachePokemon, getCachedPokemon } = usePokemon()

  const [searchQuery, setSearchQuery] = useState('')
  const [currentPokemon, setCurrentPokemon] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  /**
   * Fetch autocomplete suggestions when user types
   */
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length >= 1) {
        const results = await fetchPokemonSuggestions(searchQuery)
        setSuggestions(results)
        setShowSuggestions(results.length > 0)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  /**
   * Handle Pokemon search
   * @param {string} query - Pokemon name or ID
   */
  const handleSearch = async (query) => {
    if (!query && !searchQuery) {
      setError('Please enter a Pokémon name or ID')
      return
    }

    const searchTerm = (query || searchQuery).toLowerCase().trim()
    setError(null)
    setIsLoading(true)
    setShowSuggestions(false) // Hide suggestions when searching

    try {
      // Check cache first
      let pokemonData = getCachedPokemon(searchTerm)

      if (!pokemonData) {
        // Fetch from API if not cached
        pokemonData = await fetchPokemon(searchTerm)
        cachePokemon(searchTerm, pokemonData)
      }

      setCurrentPokemon(pokemonData)
      addToHistory(pokemonData)
      setSearchQuery('')
      setSuggestions([])
    } catch (err) {
      setError(err.message)
      setCurrentPokemon(null)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle clicking a suggestion
   * @param {string} pokemonName - Selected Pokemon name
   */
  const handleSuggestionClick = (pokemonName) => {
    setSearchQuery(pokemonName)
    setShowSuggestions(false)
    handleSearch(pokemonName)
  }

  /**
   * Handle random Pokemon selection (clicking the aqua area text)
   */
  const handleRandom = () => {
    const randomId = getRandomPokemonId()
    handleSearch(randomId.toString())
  }

  /**
   * Navigate to details page with selected Pokemon
   */
  const viewDetails = (pokemon) => {
    setSelectedPokemon(pokemon)
    navigate('/details')
  }

  /**
   * Handle Enter key press in search input
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-0 md:p-4 overflow-hidden">
      {/* Search Page with Background Image */}
      <div className="w-full md:max-w-md relative">
        <div className="relative w-full h-screen md:h-auto animate-slide-in-from-right">
          {/* Background Image - Search Page Pokédex */}
          <img
            src="/Search Page PNG.jpg"
            alt="Open Pokédex Search Interface"
            className="w-full h-full md:h-auto object-cover md:object-contain md:rounded-lg shadow-2xl"
          />

          {/* Search Bar - Positioned in the middle (around 50% vertical) */}
          <div className="absolute top-[48%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[85%] sm:w-[80%] md:w-[75%] max-w-md px-4">
            <div className="space-y-4">
              {/* Search Input with Autocomplete */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter Pokémon name or ID..."
                  className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-xl bg-white/95 backdrop-blur-sm border-3 border-slate-300 focus:border-blue-500 focus:outline-none text-slate-800 placeholder-slate-400 font-semibold shadow-xl transition-all duration-300 animate-input-float text-sm sm:text-base"
                  disabled={isLoading}
                  autoComplete="off"
                />

                {/* Autocomplete Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl max-h-60 overflow-y-auto z-50 border-2 border-blue-300">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors capitalize text-slate-800 font-medium text-sm sm:text-base border-b border-slate-100 last:border-b-0"
                      >
                        <span className="text-blue-600">🔍</span> {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Button - Blue with Pikachu */}
              <button
                onClick={() => handleSearch()}
                disabled={isLoading || !searchQuery}
                className="w-full px-6 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 text-sm sm:text-base uppercase tracking-wide flex items-center justify-center gap-2"
              >
                {isLoading ? 'Searching...' : (
                  <>
                    <span className="text-xl">⚡</span>
                    Search
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Bottom Aqua Blue Area - "Search Random Pokémon" Text with Pokemon Font - Clickable */}
          <button
            onClick={handleRandom}
            disabled={isLoading}
            className="absolute bottom-[7%] sm:bottom-[8%] md:bottom-[9%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[85%] sm:w-[80%] text-center cursor-pointer hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              fontFamily: 'Pokemon, sans-serif'
            }}
          >
            <p
              className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl tracking-wider"
              style={{
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
              Search Random Pokémon
            </p>
          </button>

          {/* Loading/Error/Results Overlay (shows when there's data) */}
          {(isLoading || error || currentPokemon) && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-8 z-50">
              <div className="bg-slate-800 rounded-2xl p-4 sm:p-6 md:p-8 max-w-sm sm:max-w-md w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
                {/* Close Button */}
                <button
                  onClick={() => {
                    setCurrentPokemon(null)
                    setError(null)
                  }}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/60 hover:text-white text-2xl sm:text-3xl font-bold transition-colors z-10"
                  aria-label="Close"
                >
                  ✕
                </button>

                {isLoading ? (
                  <div className="py-8">
                    <LoadingSpinner />
                  </div>
                ) : error ? (
                  <div className="text-center py-6">
                    <div className="text-red-400 text-5xl sm:text-6xl mb-4">⚠️</div>
                    <p className="text-red-400 font-semibold text-base sm:text-lg">{error}</p>
                    <p className="text-slate-400 text-sm mt-2">Try another search</p>
                  </div>
                ) : currentPokemon ? (
                  <div className="w-full space-y-4 sm:space-y-5 animate-fade-in pt-6">
                    {/* Pokemon Image */}
                    <div className="flex justify-center">
                      <div className="relative">
                        <img
                          src={currentPokemon.sprites.other['official-artwork'].front_default || currentPokemon.sprites.front_default}
                          alt={currentPokemon.name}
                          className="w-36 h-36 sm:w-48 sm:h-48 object-contain drop-shadow-2xl animate-float"
                        />
                      </div>
                    </div>

                    {/* Pokemon Name */}
                    <h3 className="text-2xl sm:text-3xl font-bold text-white text-center capitalize">
                      {currentPokemon.name}
                    </h3>

                    {/* Pokemon ID */}
                    <p className="text-center text-pokedex-yellow font-mono font-bold text-lg">
                      #{currentPokemon.id.toString().padStart(3, '0')}
                    </p>

                    {/* Types */}
                    <div className="flex justify-center gap-2 flex-wrap">
                      {currentPokemon.types.map((type) => (
                        <span
                          key={type.type.name}
                          className="type-badge text-xs sm:text-sm"
                          style={{ backgroundColor: getTypeColor(type.type.name) }}
                        >
                          {type.type.name}
                        </span>
                      ))}
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <div className="text-slate-400 text-xs uppercase">Height</div>
                        <div className="text-white font-bold text-sm sm:text-base">{(currentPokemon.height / 10).toFixed(1)} m</div>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <div className="text-slate-400 text-xs uppercase">Weight</div>
                        <div className="text-white font-bold text-sm sm:text-base">{(currentPokemon.weight / 10).toFixed(1)} kg</div>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => viewDetails(currentPokemon)}
                      className="w-full px-4 py-3 sm:py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition-all transform hover:scale-105 active:scale-95 text-sm sm:text-base uppercase"
                    >
                      View Full Stats
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Back to Home Button */}
          <button
            onClick={() => navigate('/')}
            className="absolute top-3 left-3 sm:top-4 sm:left-4 text-white/80 hover:text-white text-xs sm:text-sm font-semibold bg-black/40 hover:bg-black/60 px-3 py-2 rounded-lg backdrop-blur-sm transition-all"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default SearchPage
