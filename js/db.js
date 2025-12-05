let offset = 0;
const limit = 20;
const loadedPokemons = [];
const pokemonOrder = [];
let currentIndex = 0;
const filteredPokemons = [];
let isSearching = false;

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status} for ${url}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Fetching error:", error);
    return null;
  }
}
