document.getElementById("searchBtn").addEventListener("click", () => fetchPokemon());

document.getElementById("randomBtn").addEventListener("click", () => {
  fetchPokemon(getRandomPokemonId());
});

function showLoading(resultDiv) {
  resultDiv.innerHTML = `
    <div class="d-flex justify-content-center align-items-center" style="height:100px;">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `;
}

function renderPokemonCard(data) {
  return `
    <div class="pokemon-card shadow-lg rounded-4 p-4 bg-warning-subtle border border-2 border-warning">
      <h2 class="mb-3 text-uppercase text-primary-emphasis fw-bold">${data.name}</h2>
      <img src="${data.sprites.front_default}" alt="${data.name}" class="mb-3 rounded bg-white border" />
      <p class="mb-2"><span class="fw-semibold text-secondary">Type:</span> ${data.types
        .map((t) => `<span class="badge bg-primary-subtle text-primary-emphasis me-1">${t.type.name}</span>`)
        .join(" ")}</p>
      <div class="row mb-2">
        <div class="col"><span class="fw-semibold">Height:</span> ${data.height / 10} m</div>
        <div class="col"><span class="fw-semibold">Weight:</span> ${data.weight / 10} kg</div>
      </div>
      <p class="mb-2"><span class="fw-semibold text-secondary">Abilities:</span> ${data.abilities
        .map((a) => `<span class="badge bg-success-subtle text-success-emphasis me-1">${a.ability.name}</span>`)
        .join(" ")}</p>
      <p class="fw-semibold mt-3 mb-1 text-danger-emphasis">Base Stats:</p>
      <ul class="list-group mb-3">
        ${data.stats
          .map((s) => `<li class="list-group-item d-flex justify-content-between align-items-center">${s.stat.name}<span class="badge bg-danger-subtle text-danger-emphasis">${s.base_stat}</span></li>`)
          .join("")}
      </ul>
      <p class="fw-semibold mt-3 mb-1 text-info-emphasis">Moves:</p>
      <ul class="list-group">
        ${data.moves.slice(0, 5)
          .map((m) => `<li class="list-group-item">${m.move.name}</li>`)
          .join("")}
      </ul>
    </div>
  `;
}

function showError(resultDiv, message) {
  resultDiv.innerHTML = `<p>${message}</p>`;
}

function getRandomPokemonId() {
  // There are 1025 Pokémon in the Pokédex as of Gen 9
  return Math.floor(Math.random() * 1025) + 1;
}

async function fetchPokemon(pokemonNameOrId) {
  const input = document.getElementById("pokemonInput");
  const resultDiv = document.getElementById("pokemonResult");

  if (!resultDiv) {
    alert('Error: Element with id "pokemonResult" not found in the DOM.');
    return;
  }

  // Use argument if provided, otherwise get from input
  const query = pokemonNameOrId || input.value.toLowerCase();

  if (!query) {
    showError(resultDiv, "Please enter a Pokémon name.");
    return;
  }

  showLoading(resultDiv);

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
    if (!response.ok) {
      throw new Error("Pokémon not found");
    }
    const data = await response.json();
    resultDiv.innerHTML = renderPokemonCard(data);
    resultDiv.classList.remove('d-none');
  } catch (error) {
    showError(resultDiv, error.message);
  }
}
