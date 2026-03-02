import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePokemon } from '../context/PokemonContext'
import { fetchPokemonSpecies, getTypeColor } from '../services/pokeapi'

/**
 * Details Page Component
 * Displays comprehensive Pokémon information
 * Shows stats, abilities, moves, evolution chain, and sprites
 */
const DetailsPage = () => {
  const navigate = useNavigate()
  const { selectedPokemon } = usePokemon()
  const [species, setSpecies] = useState(null)
  const [activeTab, setActiveTab] = useState('stats')

  useEffect(() => {
    if (!selectedPokemon) {
      navigate('/search')
      return
    }

    // Fetch species data for flavor text
    const loadSpecies = async () => {
      try {
        const speciesData = await fetchPokemonSpecies(selectedPokemon.id)
        setSpecies(speciesData)
      } catch (error) {
        console.error('Failed to load species data:', error)
      }
    }

    loadSpecies()
  }, [selectedPokemon, navigate])

  if (!selectedPokemon) {
    return null
  }

  // Get English flavor text
  const getFlavorText = () => {
    if (!species) return 'Loading description...'
    const flavorTextEntry = species.flavor_text_entries.find(
      (entry) => entry.language.name === 'en'
    )
    return flavorTextEntry?.flavor_text.replace(/\f/g, ' ') || 'No description available.'
  }

  // Calculate stat percentage for progress bars
  const getStatPercentage = (baseStat) => {
    return Math.min((baseStat / 255) * 100, 100)
  }

  // Get stat color based on value
  const getStatColor = (baseStat) => {
    if (baseStat >= 100) return 'from-green-500 to-emerald-600'
    if (baseStat >= 70) return 'from-blue-500 to-cyan-600'
    if (baseStat >= 40) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-rose-600'
  }

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/search')}
            className="text-white/80 hover:text-white transition-colors mb-4 flex items-center gap-2"
          >
            <span>←</span> Back to Search
          </button>

          <div className="pokedex-frame p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold text-white capitalize">
                {selectedPokemon.name}
              </h1>
              <span className="text-2xl font-mono text-pokedex-yellow">
                #{selectedPokemon.id.toString().padStart(3, '0')}
              </span>
            </div>

            <div className="flex gap-2">
              {selectedPokemon.types.map((type) => (
                <span
                  key={type.type.name}
                  className="type-badge text-base"
                  style={{ backgroundColor: getTypeColor(type.type.name) }}
                >
                  {type.type.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Image & Basic Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Official Artwork */}
            <div className="pokedex-frame p-6">
              <div className="pokedex-screen">
                <img
                  src={selectedPokemon.sprites.other['official-artwork'].front_default || selectedPokemon.sprites.front_default}
                  alt={selectedPokemon.name}
                  className="w-full h-auto animate-float"
                />
              </div>
            </div>

            {/* Physical Stats */}
            <div className="pokedex-frame p-6">
              <h3 className="text-white font-bold mb-4">Physical Data</h3>
              <div className="pokedex-screen space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Height</span>
                  <span className="text-white font-bold">
                    {(selectedPokemon.height / 10).toFixed(1)} m
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Weight</span>
                  <span className="text-white font-bold">
                    {(selectedPokemon.weight / 10).toFixed(1)} kg
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Base Experience</span>
                  <span className="text-white font-bold">
                    {selectedPokemon.base_experience || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Sprites Gallery */}
            <div className="pokedex-frame p-6">
              <h3 className="text-white font-bold mb-4">Sprites</h3>
              <div className="pokedex-screen">
                <div className="grid grid-cols-2 gap-2">
                  {selectedPokemon.sprites.front_default && (
                    <img src={selectedPokemon.sprites.front_default} alt="Front" className="bg-slate-700 rounded" />
                  )}
                  {selectedPokemon.sprites.back_default && (
                    <img src={selectedPokemon.sprites.back_default} alt="Back" className="bg-slate-700 rounded" />
                  )}
                  {selectedPokemon.sprites.front_shiny && (
                    <img src={selectedPokemon.sprites.front_shiny} alt="Shiny Front" className="bg-slate-700 rounded" />
                  )}
                  {selectedPokemon.sprites.back_shiny && (
                    <img src={selectedPokemon.sprites.back_shiny} alt="Shiny Back" className="bg-slate-700 rounded" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="pokedex-frame p-6">
              <h3 className="text-white font-bold mb-4">Pokédex Entry</h3>
              <div className="pokedex-screen">
                <p className="text-slate-300 leading-relaxed">
                  {getFlavorText()}
                </p>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex gap-2 overflow-x-auto">
              {['stats', 'abilities', 'moves'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-lg font-bold uppercase text-sm transition-all ${
                    activeTab === tab
                      ? 'bg-pokedex-yellow text-gray-900'
                      : 'bg-slate-700 text-white hover:bg-slate-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="pokedex-frame p-6">
              <div className="pokedex-screen">
                {activeTab === 'stats' && (
                  <div className="space-y-4">
                    <h3 className="text-white font-bold text-xl mb-4">Base Stats</h3>
                    {selectedPokemon.stats.map((stat) => (
                      <div key={stat.stat.name}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-slate-300 capitalize text-sm">
                            {stat.stat.name.replace('-', ' ')}
                          </span>
                          <span className="text-white font-bold">
                            {stat.base_stat}
                          </span>
                        </div>
                        <div className="stat-bar">
                          <div
                            className={`stat-bar-fill bg-gradient-to-r ${getStatColor(stat.base_stat)}`}
                            style={{ width: `${getStatPercentage(stat.base_stat)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    <div className="mt-6 pt-4 border-t border-slate-700">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-semibold">Total</span>
                        <span className="text-pokedex-yellow font-bold text-xl">
                          {selectedPokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'abilities' && (
                  <div className="space-y-4">
                    <h3 className="text-white font-bold text-xl mb-4">Abilities</h3>
                    {selectedPokemon.abilities.map((ability, index) => (
                      <div
                        key={index}
                        className="bg-slate-700/50 rounded-lg p-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-white font-semibold capitalize">
                            {ability.ability.name.replace('-', ' ')}
                          </span>
                          {ability.is_hidden && (
                            <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
                              Hidden
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'moves' && (
                  <div>
                    <h3 className="text-white font-bold text-xl mb-4">
                      Learnable Moves ({selectedPokemon.moves.length})
                    </h3>
                    <div className="max-h-96 overflow-y-auto space-y-2">
                      {selectedPokemon.moves.slice(0, 20).map((move, index) => (
                        <div
                          key={index}
                          className="bg-slate-700/50 rounded px-4 py-2 text-slate-300 capitalize"
                        >
                          {move.move.name.replace('-', ' ')}
                        </div>
                      ))}
                      {selectedPokemon.moves.length > 20 && (
                        <p className="text-slate-500 text-sm text-center py-2">
                          + {selectedPokemon.moves.length - 20} more moves
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailsPage
