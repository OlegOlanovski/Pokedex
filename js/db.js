// ==========
//  COLORS
// ==========
const typeColors = {
  grass: "#78C850",
  fire: "#F08030",
  water: "#6890F0",
  bug: "#A8B820",
  normal: "#A8A878",
  poison: "#A040A0",
  electric: "#F8D030",
  ground: "#E0C068",
  fairy: "#EE99AC",
  fighting: "#C03028",
  psychic: "#F85888",
  rock: "#B8A038",
  ghost: "#705898",
  ice: "#98D8D8",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  flying: "#A890F0",
};

// ========
//  ICONS
// ========
const typeIcons = {
  grass: "🌿",
  fire: "🔥",
  water: "💧",
  electric: "⚡",
  bug: "🐛",
  normal: "⚪",
  poison: "☠️",
  ground: "🌍",
  fairy: "✨",
  fighting: "🥊",
  psychic: "🔮",
  rock: "🪨",
  ghost: "👻",
  ice: "❄️",
  dragon: "🐉",
  dark: "🌑",
  steel: "⚙️",
  flying: "🕊️",
};

// ============
//  GLOBAL
// ============
let offset = 0;
const limit = 20;
const loadedPokemons = [];
const pokemonOrder = [];
let currentIndex = 0;
// ============
//  UTILITIES
// ============
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getColorByType(types) {
  return typeColors[types[0]] || "#fff";
}

async function fetchJSON(url) {
  const res = await fetch(url);
  return await res.json();
}
