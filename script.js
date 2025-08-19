document.getElementById("searchBtn").addEventListener("click", fetchPokemon);

async function fetchPokemon() {
  const pokemonName = document
    .getElementById("pokemonInput")
    .value.toLowerCase();
  const resultDiv = document.getElementById("pokemonResult");

  if (!resultDiv) {
    alert('Error: Element with id "pokemonResult" not found in the DOM.');
    return;
  }

  if (!pokemonName) {
    resultDiv.innerHTML = "<p>Please enter a Pokémon name.</p>";
    return;
  }
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    if (!response.ok) {
      throw new Error("Pokémon not found");
    }
    const data = await response.json();
    resultDiv.innerHTML = `
        <div class="pokemon-card">
        <h2>${data.name.toUpperCase()}</h2>
        <img src="${data.sprites.front_default}" alt="${data.name}">
        <p><strong>Type:</strong> ${data.types
          .map((t) => t.type.name)
          .join(", ")}</p>
         <p><strong>Abilities:</strong> ${data.abilities
           .map((a) => a.ability.name)
           .join(", ")}</p>
            <p><strong>Base Stats:</strong></p>
             <ul>
                ${data.stats
                  .map((s) => `<li>${s.stat.name}: ${s.base_stat}</li>`)
                  .join("")}
            </ul>
        </div>
        `;
  } catch (error) {
    resultDiv.innerHTML = `<p>${error.message}</p>`;
  }
}
