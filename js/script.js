// =======
//  INIT
// =======
function init() {
  loadMore();
  setupSearch();
}

// ===========
//  LOAD MORE
// ===========
async function loadMore() {
  setLoadingState(true);

  const list = await fetchPokemonList(limit, offset);
  offset += limit;

  let html = "";
  for (let i = 0; i < list.results.length; i++) {
    const poke = await fetchSinglePokemon(list.results[i].url);
    loadedPokemons.push(poke);
    pokemonOrder.push(poke.id);
    html += buildCard(poke);
  }

  setTimeout(() => {
    appendToContent(html);
    setLoadingState(false);
  }, 800);
}

// =================
//  HTML CONTENT ADD
// =================
function appendToContent(html) {
  document.getElementById("content").innerHTML += html;
}

// =============
//  SPIN ON/OFF
// =============
function setLoadingState(isLoading) {
  const btn = document.getElementById("loadMoreBtn");
  const spin = document.getElementById("spinner");

  btn.disabled = isLoading;

  if (isLoading) spin.classList.remove("hidden");
  else spin.classList.add("hidden");
}

// ============
//  CARD HTML
// ============
function buildCard(poke) {
  const types = extractTypes(poke);
  const typesHTML = buildTypesHTML(types);
  const bg = getColorByType(types);
  return cardTemplate(poke, bg, typesHTML);
}

// =======
//  TYPES
// =======
function extractTypes(poke) {
  const types = [];
  for (let i = 0; i < poke.types.length; i++) {
    types.push(poke.types[i].type.name);
  }
  return types;
}

// ==============
//  POKEMON DATA
// ==============
async function fetchSinglePokemon(url) {
  return await fetchJSON(url);
}

// ==============
//  POKEMON LIST
// ==============
async function fetchPokemonList(limit, offset) {
  return await fetchJSON(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
  );
}

// ======================
//  MODAL OPEN / CLOSE
// ======================
async function openModal(id) {
  for (let i = 0; i < pokemonOrder.length; i++)
    if (pokemonOrder[i] === id) currentIndex = i;

  const poke = loadedPokemons[currentIndex];
  const species = await fetchJSON(
    `https://pokeapi.co/api/v2/pokemon-species/${poke.id}`
  );

  renderModal(poke, species);
  document.getElementById("modal").classList.add("show");
  document.body.style.overflow = "hidden"; // scroll off
}

function closeModal() {
  document.getElementById("modal").classList.remove("show");
  document.body.style.overflow = ""; //scroll on
}
//=============
// RENDER MODAL
//=============
function renderModal(data, species) {
  const types = getTypes(data);
  const bg = getColorByType(types);
  const typesList = formatTypeList(types);
  const eggGroups = formatEggGroups(species);
  const genderText = getGenderText(species);
  const totalStats = getTotalStats(data);

  const about = buildAboutHTML(data, species, typesList, genderText);
  const stats = buildStatsHTML(data);
  const spec = buildSpeciesHTML(species, totalStats, eggGroups);

  const modalContent = document.getElementById("modalContent");
  modalContent.innerHTML = modalHTML(data, about, stats, spec, bg);

  const imgContainer = modalContent.querySelector(".img_container");
  if (imgContainer) imgContainer.style.backgroundColor = bg;
}

//============
// TOTAL STATS
//============
function getTotalStats(data) {
  let total = 0;
  for (let i = 0; i < data.stats.length; i++) {
    total += data.stats[i].base_stat;
  }
  return total;
}

//=======
// GENDER
//=======
function getGenderText(species) {
  if (species.gender_rate === -1) return "Genderless";
  const female = (species.gender_rate / 8) * 100;
  const male = 100 - female;
  return `♂ ${male.toFixed(1)}% / ♀ ${female.toFixed(1)}%`;
}

//============
// FORMAT EGG
//============
function formatEggGroups(species) {
  let str = "";
  for (let i = 0; i < species.egg_groups.length; i++) {
    str += capitalize(species.egg_groups[i].name);
    if (i < species.egg_groups.length - 1) str += ", ";
  }
  return str;
}

//===================
//  FORMAT TYPEN LIST
//===================
function formatTypeList(types) {
  let str = "";
  for (let i = 0; i < types.length; i++) {
    str += capitalize(types[i]);
    if (i < types.length - 1) str += ", ";
  }
  return str;
}
//=======
//  Typen
//=======
function getTypes(data) {
  const arr = [];
  for (let i = 0; i < data.types.length; i++) {
    arr.push(data.types[i].type.name);
  }
  return arr;
}

//=======
//  TABS
//=======
function showTab(name) {
  const tabs = ["about", "stats", "species"];
  for (let i = 0; i < tabs.length; i++) {
    document.getElementById(`tab_${tabs[i]}_content`).classList.add("hidden");
    document.getElementById(`tab_${tabs[i]}`).classList.remove("active");
  }
  document.getElementById(`tab_${name}_content`).classList.remove("hidden");
  document.getElementById(`tab_${name}`).classList.add("active");
}
//=============
//  NEXT / PREV
//=============
function nextPokemon() {
  currentIndex++;
  if (currentIndex >= loadedPokemons.length) currentIndex = 0;
  openModal(loadedPokemons[currentIndex].id);
}

function prevPokemon() {
  currentIndex--;
  if (currentIndex < 0) currentIndex = loadedPokemons.length - 1;
  openModal(loadedPokemons[currentIndex].id);
}
//================
//  SEARCH ONINPUT
//================
function setupSearch() {
  const input = document.querySelector(".search_input");
  input.oninput = function () {
    const v = input.value.toLowerCase();
    const cards = document.getElementById("content").children;

    if (v.length < 3) {
      for (let i = 0; i < cards.length; i++) cards[i].style.display = "";
      return;
    }

    for (let i = 0; i < cards.length; i++) {
      const name = cards[i]
        .getElementsByTagName("h3")[0]
        .textContent.toLowerCase();
      cards[i].style.display = name.includes(v) ? "" : "none";
    }
    checkNotFound();
  };
}
//=================
//  CHECK NOTFOUND
//=================
function checkNotFound() {
  const content = document.getElementById("content");
  const notFoundMessage = document.getElementById("notFoundMessage");
  const cards = content.children;

  let anyVisible = false;
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].style.display !== "none") {
      anyVisible = true;
      break;
    }
  }

  if (anyVisible) {
    notFoundMessage.classList.remove("show");
  } else {
    notFoundMessage.classList.add("show");
  }
}
