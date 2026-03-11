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
   * Calculate CP (Combat Power) based on Pokemon stats
   * Formula inspired by Pokemon GO
   */
  const calculateCP = (pokemon) => {
    const baseStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
    return Math.floor(baseStats * 3.5)
  }

  /**
   * Get background gradient colors based on Pokemon's primary type
   */
  const getTypeGradient = (type) => {
    const typeGradients = {
      normal: { from: '#A8A878', to: '#8A8A5C', light: '#C0C098' },
      fire: { from: '#F08030', to: '#DD6610', light: '#F5A060' },
      water: { from: '#6890F0', to: '#4870D0', light: '#88A8F8' },
      electric: { from: '#F8D030', to: '#D8B010', light: '#FFF050' },
      grass: { from: '#78C850', to: '#58A830', light: '#98D870' },
      ice: { from: '#98D8D8', to: '#78B8B8', light: '#B8F0F0' },
      fighting: { from: '#C03028', to: '#A01010', light: '#E05048' },
      poison: { from: '#A040A0', to: '#802080', light: '#C060C0' },
      ground: { from: '#E0C068', to: '#C0A048', light: '#F0D088' },
      flying: { from: '#A890F0', to: '#8870D0', light: '#C8B0F8' },
      psychic: { from: '#F85888', to: '#D83868', light: '#FF78A8' },
      bug: { from: '#A8B820', to: '#889800', light: '#C8D840' },
      rock: { from: '#B8A038', to: '#988018', light: '#D8C058' },
      ghost: { from: '#705898', to: '#503878', light: '#9078B8' },
      dragon: { from: '#7038F8', to: '#5018D8', light: '#9058FF' },
      dark: { from: '#705848', to: '#503828', light: '#907868' },
      steel: { from: '#B8B8D0', to: '#9898B0', light: '#D8D8F0' },
      fairy: { from: '#EE99AC', to: '#CE798C', light: '#FFB9CC' }
    }
    return typeGradients[type.toLowerCase()] || { from: '#777777', to: '#555555', light: '#999999' }
  }

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Modern Dark Search Page */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md relative animate-slide-in-from-right">
          {/* Back to Home Button */}
          <button
            onClick={() => navigate('/')}
            className="absolute -top-12 left-0 text-white/80 hover:text-white text-sm font-semibold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm transition-all flex items-center gap-2"
          >
            <span className="text-lg">←</span> Back
          </button>

          {/* Main Content Card */}
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Select Your
              </h1>
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-3xl sm:text-4xl font-bold text-white">Pokémon</h2>
                <span className="text-3xl">⚡</span>
              </div>
            </div>

            {/* Search Input with Autocomplete */}
            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter Pokémon name or ID..."
                className="w-full px-5 py-4 rounded-2xl bg-slate-700/50 border-2 border-slate-600 focus:border-blue-500 focus:outline-none text-white placeholder-slate-400 font-semibold shadow-lg transition-all duration-300 text-base backdrop-blur-sm"
                disabled={isLoading}
                autoComplete="off"
              />

              {/* Autocomplete Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 rounded-2xl shadow-2xl max-h-60 overflow-y-auto z-50 border-2 border-slate-700">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-5 py-3 hover:bg-slate-700 transition-colors capitalize text-white font-medium text-base border-b border-slate-700 last:border-b-0"
                    >
                      <span className="text-blue-400">🔍</span> {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Button */}
            <button
              onClick={() => handleSearch()}
              disabled={isLoading || !searchQuery}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold rounded-2xl shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 text-base uppercase tracking-wide flex items-center justify-center gap-2 mb-6"
            >
              {isLoading ? 'Searching...' : (
                <>
                  <span className="text-xl">⚡</span>
                  Search
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-800 text-slate-400">or</span>
              </div>
            </div>

            {/* Random Pokémon Button */}
            <button
              onClick={handleRandom}
              disabled={isLoading}
              className="w-full px-6 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-2xl shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 text-base uppercase tracking-wide"
              style={{
                fontFamily: 'Pokemon, sans-serif'
              }}
            >
              Search Random Pokémon
            </button>
          </div>

        </div>
      </div>

      {/* Loading/Error/Results Overlay (shows when there's data) - OUTSIDE containers for full screen */}
      {(isLoading || error || currentPokemon) && (
        <div className="fixed inset-0 z-50 animate-fade-in">
          {isLoading ? (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
              <div className="text-center">
                <div className="text-red-400 text-6xl mb-4">⚠️</div>
                <p className="text-red-400 font-semibold text-lg mb-2">{error}</p>
                <p className="text-slate-400 text-sm mb-6">Try another search</p>
                <button
                  onClick={() => {
                    setCurrentPokemon(null)
                    setError(null)
                  }}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
                >
                  Go Back
                </button>
              </div>
            </div>
          ) : currentPokemon ? (
            (() => {
              const primaryType = currentPokemon.types[0].type.name
              const typeGradient = getTypeGradient(primaryType)
              const cp = calculateCP(currentPokemon)

              return (
                <div
                  className="w-full h-full overflow-y-auto"
                  style={{
                    background: `linear-gradient(to bottom, ${typeGradient.from}, ${typeGradient.to})`
                  }}
                >
                  {/* Pokemon Card - Mobile Focused */}
                  <div className="min-h-screen flex flex-col p-4 sm:p-6 md:p-8">
                    {/* Header with CP and Close Button */}
                    <div className="flex items-start justify-between mb-4 max-w-4xl mx-auto w-full">
                      <button
                        onClick={() => {
                          setCurrentPokemon(null)
                          setError(null)
                        }}
                        className="text-white/80 hover:text-white transition-colors p-2"
                        aria-label="Close"
                      >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      <div className="text-right">
                        <div className="text-white/90 text-5xl sm:text-6xl md:text-7xl font-bold drop-shadow-lg">
                          {cp} CP
                        </div>
                      </div>
                    </div>

                    {/* Pokemon Image - Large and Centered */}
                    <div className="flex-1 flex items-center justify-center mb-4 md:mb-8">
                      <div className="relative">
                        {/* Decorative circles in background */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                          <div className="w-64 h-64 md:w-96 md:h-96 rounded-full bg-white/30 blur-3xl"></div>
                        </div>
                        <img
                          src={currentPokemon.sprites.other['official-artwork'].front_default || currentPokemon.sprites.front_default}
                          alt={currentPokemon.name}
                          className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 object-contain drop-shadow-2xl relative z-10 animate-float"
                        />
                      </div>
                    </div>

                    {/* Pokemon Info Card */}
                    <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 max-w-2xl mx-auto w-full">
                      {/* Name and Number */}
                      <div className="text-center">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold capitalize mb-2" style={{ color: typeGradient.from }}>
                          {currentPokemon.name}
                        </h2>
                        <p className="text-gray-500 font-mono text-sm md:text-base">
                          #{currentPokemon.id.toString().padStart(4, '0')}
                        </p>
                      </div>

                      {/* Type Badges */}
                      <div className="flex justify-center gap-2">
                        {currentPokemon.types.map((type) => (
                          <span
                            key={type.type.name}
                            className="px-4 py-2 md:px-6 md:py-3 rounded-full text-white font-semibold uppercase text-xs md:text-sm tracking-wide shadow-md"
                            style={{ backgroundColor: getTypeColor(type.type.name) }}
                          >
                            {type.type.name}
                          </span>
                        ))}
                      </div>

                      {/* Physical Stats */}
                      <div className="grid grid-cols-2 gap-4 md:gap-6 pt-2">
                        <div className="text-center">
                          <div className="text-gray-500 text-sm md:text-base font-semibold mb-1">Weight</div>
                          <div className="text-2xl md:text-3xl font-bold" style={{ color: typeGradient.from }}>
                            {(currentPokemon.weight / 10).toFixed(1)} KG
                          </div>
                        </div>
                        <div className="text-center border-l-2 border-gray-200">
                          <div className="text-gray-500 text-sm md:text-base font-semibold mb-1">Height</div>
                          <div className="text-2xl md:text-3xl font-bold" style={{ color: typeGradient.from }}>
                            {(currentPokemon.height / 10).toFixed(1)} M
                          </div>
                        </div>
                      </div>

                      {/* Base Stats */}
                      <div className="pt-4 border-t-2 border-gray-100">
                        <h3 className="text-lg md:text-xl font-bold mb-3 text-center" style={{ color: typeGradient.from }}>
                          Base Stats
                        </h3>
                        <div className="space-y-2 md:space-y-3">
                          {currentPokemon.stats.map((stat) => {
                            const statName = stat.stat.name
                              .replace('special-attack', 'Sp. Atk')
                              .replace('special-defense', 'Sp. Def')
                              .replace('hp', 'HP')
                              .replace('attack', 'Attack')
                              .replace('defense', 'Defense')
                              .replace('speed', 'Speed')
                            const statValue = stat.base_stat
                            const statPercentage = (statValue / 255) * 100

                            return (
                              <div key={statName} className="flex items-center gap-3 md:gap-4">
                                <div className="w-20 md:w-24 text-sm md:text-base font-semibold text-gray-600 capitalize">
                                  {statName}
                                </div>
                                <div className="flex-1 bg-gray-200 rounded-full h-2 md:h-3 overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                      width: `${statPercentage}%`,
                                      backgroundColor: typeGradient.from
                                    }}
                                  ></div>
                                </div>
                                <div className="w-10 md:w-12 text-right text-sm md:text-base font-bold text-gray-700">
                                  {statValue}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Abilities */}
                      <div className="pt-2">
                        <h3 className="text-sm md:text-base font-semibold text-gray-500 mb-2 text-center">Abilities</h3>
                        <div className="flex justify-center gap-2 flex-wrap">
                          {currentPokemon.abilities.map((ability) => (
                            <span
                              key={ability.ability.name}
                              className="px-3 py-1 md:px-4 md:py-2 bg-gray-100 text-gray-700 rounded-full text-xs md:text-sm font-medium capitalize"
                            >
                              {ability.ability.name.replace('-', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* View Full Details Button */}
                      <button
                        onClick={() => viewDetails(currentPokemon)}
                        className="w-full px-6 py-4 md:py-5 text-white font-bold rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 text-base md:text-lg uppercase tracking-wide"
                        style={{
                          background: `linear-gradient(to right, ${typeGradient.from}, ${typeGradient.to})`
                        }}
                      >
                        View Full Details
                      </button>
                    </div>

                    {/* Bottom padding for mobile */}
                    <div className="h-6 md:h-12"></div>
                  </div>
                </div>
              )
            })()
          ) : null}
        </div>
      )}
    </div>
  )
}

export default SearchPage
