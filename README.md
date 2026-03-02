# Pokédex Web App

A sophisticated mobile-first Pokédex application that brings the classic Pokémon experience to the web. Built with React and powered by the PokéAPI, this app emulates the look and feel of a real Pokédex device with a modern, professional interface.

![Pokédex App](https://img.shields.io/badge/React-18+-blue?style=flat-square&logo=react) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css) ![Vite](https://img.shields.io/badge/Vite-5+-646CFF?style=flat-square&logo=vite)

## Features

- **Classic Pokédex Design** - Red/white color scheme inspired by the original Kanto Pokédex
- **Comprehensive Pokémon Data** - Access all 1,025 Pokémon from Generations 1-9
- **Smart Search** - Find Pokémon by name or ID number
- **Random Pokémon** - Discover new Pokémon with the random button
- **Detailed Stats** - View abilities, moves, types, evolution chains, and sprites
- **Mobile-First Responsive** - Optimized for phones, tablets, and desktops
- **Offline-Ready** - localStorage caching for previously viewed Pokémon
- **Smooth Animations** - Premium feel with custom transitions and loading states

## Tech Stack

- **React 18** - Component-driven UI architecture
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first styling framework
- **React Router** - Seamless page navigation
- **PokéAPI v2** - RESTful Pokémon data source
- **Context API** - Global state management

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/PokeDex.git

# Navigate to project directory
cd PokeDex

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
PokeDex/
├── src/
│   ├── components/        # React components
│   │   ├── LandingPage.jsx
│   │   ├── SearchPage.jsx
│   │   ├── DetailsPage.jsx
│   │   └── ...
│   ├── services/          # API integration
│   │   └── pokeapi.js
│   ├── context/           # State management
│   │   └── PokemonContext.jsx
│   ├── styles/            # CSS modules
│   │   ├── globals.css
│   │   └── animations.css
│   ├── App.jsx            # Main app component
│   └── main.jsx           # React entry point
├── public/                # Static assets
├── index.html             # HTML entry point
└── package.json
```

## Usage

1. **Landing Page** - Click "ENTER" to open the Pokédex
2. **Search Page** - Type a Pokémon name/ID or use the "Random" button
3. **Details Page** - View comprehensive stats, abilities, and evolution chains
4. **Navigate Back** - Use the back button to return to search

## API Reference

This app uses the [PokéAPI](https://pokeapi.co/):
- `/pokemon/{name-or-id}` - Core Pokémon data
- `/pokemon-species/{id}` - Evolution chain and flavor text
- `/evolution-chain/{id}` - Evolution tree data

## Roadmap

### Current Version (v1.0)
- ✅ Search functionality
- ✅ Random Pokémon discovery
- ✅ Detailed stats display
- ✅ Responsive design
- ✅ localStorage caching

### Future Features (v2.0)
- 🔜 User authentication (Supabase)
- 🔜 Collection tracking ("Owned" Pokémon)
- 🔜 Completion percentage tracker
- 🔜 Favorites and custom lists
- 🔜 Advanced filtering and sorting

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Pokémon data provided by [PokéAPI](https://pokeapi.co/)
- Pokémon and Pokédex are trademarks of Nintendo, Game Freak, and Creatures Inc.
- This is a fan project and is not affiliated with or endorsed by The Pokémon Company

## Contact

Created by [Svvntos](https://github.com/Svvntos)

---

**Note**: This app is for educational and entertainment purposes only. All Pokémon names, images, and data are property of their respective owners.
