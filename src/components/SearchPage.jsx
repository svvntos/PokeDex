import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePokemon } from '../context/PokemonContext'
import { fetchPokemon, getRandomPokemonId, getTypeColor } from '../services/pokeapi'
import LoadingSpinner from './LoadingSpinner'

/**
 * Search Page Component
 * Displays an open Pokédex with search functionality
 * Top screen: Search input and controls
 * Bottom screen: Search results/preview
 */
const SearchPage = () => {
  const navigate = useNavigate()
  const { setSelectedPokemon, addToHistory, cachePokemon, getCachedPokemon, searchHistory } = usePokemon()

  const [searchQuery, setSearchQuery] = useState('')
  const [currentPokemon, setCurrentPokemon] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

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
    } catch (err) {
      setError(err.message)
      setCurrentPokemon(null)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle random Pokemon selection
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
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Open Pokédex Device */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left side - Top screen (Search Interface) */}
          <div className="pokedex-frame p-6 animate-slide-up">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-white font-bold text-xl">SEARCH</h2>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>

            <div className="pokedex-screen">
              <div className="space-y-4">
                {/* Search Input */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Enter Pokémon Name or ID
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="e.g., Pikachu or 25"
                    className="pokedex-input"
                    disabled={isLoading}
                  />
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleSearch()}
                    disabled={isLoading || !searchQuery}
                    className="pokedex-button pokedex-button-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    SEARCH
                  </button>
                  <button
                    onClick={handleRandom}
                    disabled={isLoading}
                    className="pokedex-button pokedex-button-secondary disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    RANDOM
                  </button>
                </div>

                {/* Search History */}
                {searchHistory.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-xs text-slate-400 uppercase tracking-wide mb-2">
                      Recent Searches
                    </h3>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {searchHistory.map((pokemon) => (
                        <button
                          key={pokemon.id}
                          onClick={() => handleSearch(pokemon.name)}
                          className="w-full text-left px-3 py-2 rounded bg-slate-700/50 hover:bg-slate-700 text-white text-sm transition-colors flex items-center gap-2"
                        >
                          <img
                            src={pokemon.sprites.front_default}
                            alt={pokemon.name}
                            className="w-8 h-8"
                          />
                          <span className="capitalize">{pokemon.name}</span>
                          <span className="ml-auto text-slate-400 text-xs">
                            #{pokemon.id.toString().padStart(3, '0')}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Bottom screen (Results) */}
          <div className="pokedex-frame p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-white font-bold text-xl">RESULTS</h2>
              {currentPokemon && (
                <span className="text-pokedex-yellow text-sm font-mono">
                  #{currentPokemon.id.toString().padStart(3, '0')}
                </span>
              )}
            </div>

            <div className="pokedex-screen min-h-[400px] flex items-center justify-center">
              {isLoading ? (
                <LoadingSpinner />
              ) : error ? (
                <div className="text-center">
                  <div className="text-red-400 text-6xl mb-4">⚠️</div>
                  <p className="text-red-400 font-semibold">{error}</p>
                  <p className="text-slate-500 text-sm mt-2">Try another search</p>
                </div>
              ) : currentPokemon ? (
                <div className="w-full space-y-4 animate-fade-in">
                  {/* Pokemon Image */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <img
                        src={currentPokemon.sprites.other['official-artwork'].front_default || currentPokemon.sprites.front_default}
                        alt={currentPokemon.name}
                        className="w-48 h-48 object-contain drop-shadow-2xl animate-float"
                      />
                    </div>
                  </div>

                  {/* Pokemon Name */}
                  <h3 className="text-3xl font-bold text-white text-center capitalize">
                    {currentPokemon.name}
                  </h3>

                  {/* Types */}
                  <div className="flex justify-center gap-2">
                    {currentPokemon.types.map((type) => (
                      <span
                        key={type.type.name}
                        className="type-badge"
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
                      <div className="text-white font-bold">{(currentPokemon.height / 10).toFixed(1)} m</div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <div className="text-slate-400 text-xs uppercase">Weight</div>
                      <div className="text-white font-bold">{(currentPokemon.weight / 10).toFixed(1)} kg</div>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <button
                    onClick={() => viewDetails(currentPokemon)}
                    className="w-full pokedex-button pokedex-button-primary"
                  >
                    VIEW FULL STATS
                  </button>
                </div>
              ) : (
                <div className="text-center text-slate-500">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="font-semibold">Search for a Pokémon</p>
                  <p className="text-sm mt-2">Enter a name or ID above</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-white/60 hover:text-white transition-colors text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default SearchPage
