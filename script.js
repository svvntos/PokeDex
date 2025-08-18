document.getElementById('searchBtn').addEventListener('click', fetchPokemon);

async function fetchPokemon() {
    const pokemonName = document.getElementById('pokemonInput').value.toLowerCase();
    const resultDiv = document.getElementById("pokemonResult");

    if (!pokemonName) {
        resultDiv.innerHTML = "<p>Please enter a Pokémon name.</p>";
        return;
    }
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        if (!response.ok) {
            throw new Error('Pokémon not found');
        }
        const data = await response.json();
        resultDiv.innerHTML = `
        <div class="pokemon-card">
        <h2>${data.name.toUpperCase()}</h2>
        <img src="${data.sprites.front_default}" alt="${data.name}">
        <p><strong>Type:</strong> ${data.types.map(t => t.type.name).join(', ')}</p>
        </div>
        `;
    } catch (error) {
        resultDiv.innerHTML = `<p>${error.message}</p>`;
    }
}