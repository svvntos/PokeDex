import { createContext, useContext, useState, useEffect } from 'react'

const PokemonContext = createContext()

/**
 * Custom hook to use Pokemon context
 * @throws {Error} If used outside of PokemonProvider
 */
export const usePokemon = () => {
  const context = useContext(PokemonContext)
  if (!context) {
    throw new Error('usePokemon must be used within a PokemonProvider')
  }
  return context
}

/**
 * Pokemon Context Provider
 * Manages global state for selected Pokemon, search history, and cache
 */
export const PokemonProvider = ({ children }) => {
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const [searchHistory, setSearchHistory] = useState([])
  const [cache, setCache] = useState({})

  // Load data from localStorage on mount
  useEffect(() => {
    const savedPokemon = localStorage.getItem('selectedPokemon')
    const savedHistory = localStorage.getItem('searchHistory')
    const savedCache = localStorage.getItem('pokemonCache')

    if (savedPokemon) {
      setSelectedPokemon(JSON.parse(savedPokemon))
    }
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory))
    }
    if (savedCache) {
      setCache(JSON.parse(savedCache))
    }
  }, [])

  // Save to localStorage when state changes
  useEffect(() => {
    if (selectedPokemon) {
      localStorage.setItem('selectedPokemon', JSON.stringify(selectedPokemon))
    }
  }, [selectedPokemon])

  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory))
  }, [searchHistory])

  useEffect(() => {
    localStorage.setItem('pokemonCache', JSON.stringify(cache))
  }, [cache])

  /**
   * Add a Pokemon to search history
   * @param {Object} pokemon - Pokemon data object
   */
  const addToHistory = (pokemon) => {
    setSearchHistory(prev => {
      const filtered = prev.filter(p => p.id !== pokemon.id)
      return [pokemon, ...filtered].slice(0, 10) // Keep last 10
    })
  }

  /**
   * Cache Pokemon data with 24-hour TTL
   * @param {string} key - Cache key (pokemon name or id)
   * @param {Object} data - Pokemon data to cache
   */
  const cachePokemon = (key, data) => {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
      ttl: 24 * 60 * 60 * 1000 // 24 hours
    }
    setCache(prev => ({ ...prev, [key]: cacheEntry }))
  }

  /**
   * Get cached Pokemon data if not expired
   * @param {string} key - Cache key
   * @returns {Object|null} Cached data or null if expired/not found
   */
  const getCachedPokemon = (key) => {
    const cached = cache[key]
    if (!cached) return null

    const isExpired = Date.now() - cached.timestamp > cached.ttl
    if (isExpired) {
      // Remove expired cache entry
      setCache(prev => {
        const newCache = { ...prev }
        delete newCache[key]
        return newCache
      })
      return null
    }

    return cached.data
  }

  const value = {
    selectedPokemon,
    setSelectedPokemon,
    searchHistory,
    addToHistory,
    cachePokemon,
    getCachedPokemon,
    clearCache: () => setCache({})
  }

  return (
    <PokemonContext.Provider value={value}>
      {children}
    </PokemonContext.Provider>
  )
}
