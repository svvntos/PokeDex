import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PokemonProvider } from './context/PokemonContext'
import LandingPage from './components/LandingPage'
import SearchPage from './components/SearchPage'
import DetailsPage from './components/DetailsPage'

/**
 * Main App component with routing configuration
 * Provides Pokemon context to all child components
 */
function App() {
  return (
    <PokemonProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/details" element={<DetailsPage />} />
        </Routes>
      </Router>
    </PokemonProvider>
  )
}

export default App
