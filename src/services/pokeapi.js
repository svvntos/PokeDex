import axios from 'axios'

const BASE_URL = 'https://pokeapi.co/api/v2'

/**
 * API service for interacting with PokeAPI
 */

/**
 * Fetch Pokemon data by name or ID
 * @param {string|number} nameOrId - Pokemon name or Pokedex ID
 * @returns {Promise<Object>} Pokemon data
 * @throws {Error} If Pokemon not found or network error
 */
export const fetchPokemon = async (nameOrId) => {
  try {
    const response = await axios.get(`${BASE_URL}/pokemon/${nameOrId}`)
    return response.data
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`Pokémon "${nameOrId}" not found`)
    }
    throw new Error('Failed to fetch Pokémon data. Please check your connection.')
  }
}

/**
 * Fetch Pokemon species data (for evolution chain, flavor text)
 * @param {number} id - Pokemon ID
 * @returns {Promise<Object>} Species data
 */
export const fetchPokemonSpecies = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/pokemon-species/${id}`)
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch species data')
  }
}

/**
 * Fetch evolution chain data
 * @param {string} url - Evolution chain URL from species data
 * @returns {Promise<Object>} Evolution chain data
 */
export const fetchEvolutionChain = async (url) => {
  try {
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch evolution chain')
  }
}

/**
 * Generate random Pokemon ID (1-1025 for Gen 1-9)
 * @returns {number} Random Pokemon ID
 */
export const getRandomPokemonId = () => {
  return Math.floor(Math.random() * 1025) + 1
}

/**
 * Fetch multiple Pokemon for preloading
 * @param {number[]} ids - Array of Pokemon IDs
 * @returns {Promise<Object[]>} Array of Pokemon data
 */
export const fetchMultiplePokemon = async (ids) => {
  try {
    const promises = ids.map(id => fetchPokemon(id))
    return await Promise.all(promises)
  } catch (error) {
    console.error('Error preloading Pokemon:', error)
    return []
  }
}

/**
 * Get type color for styling
 * @param {string} type - Pokemon type
 * @returns {string} Hex color code
 */
export const getTypeColor = (type) => {
  const typeColors = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC'
  }
  return typeColors[type.toLowerCase()] || '#777777'
}
