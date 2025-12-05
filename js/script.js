function init() {
  loadMore();
  setupSearch();
}

async function loadMore() {
  setLoadingState(true);
  if (isSearching) {
    setLoadingState(false);
    return;
  }
  const list = await fetchPokemonList(limit, offset);
  if (!list || !list.results) {
    setLoadingState(false);
    return;
  }
  offset += limit;
  const newHtmlContent = await processPokemonList(list);
  appendToContent(newHtmlContent);
  setLoadingState(false);
}

async function processPokemonList(list) {
  let html = "";
  for (let i = 0; i < list.results.length; i++) {
    const pokemonUrl = list.results[i].url;
    const poke = await fetchSinglePokemon(pokemonUrl);
    if (poke) {
      loadedPokemons.push(poke);
      pokemonOrder.push(poke.id);
      html += buildCard(poke);
    }
  }
  return html;
}

function appendToContent(html) {
  document.getElementById("content").insertAdjacentHTML("beforeend", html);
}

function setLoadingState(isLoading) {
  const btn = document.getElementById("loadMoreBtn");
  const spin = document.getElementById("spinner");
  btn.disabled = isLoading;
  spin.classList.toggle("hidden", !isLoading);
  if (isSearching && !isLoading) {
    btn.classList.add("hidden");
  } else if (!isSearching) {
    btn.classList.remove("hidden");
  }
}

function buildCard(poke) {
  const types = extractTypes(poke);
  const typesHTML = buildTypesHTML(types);
  return cardTemplate(poke, typesHTML);
}

function extractTypes(poke) {
  const typesArray = [];
  const typesData = poke.types;
  for (let i = 0; i < typesData.length; i++) {
    const typeObject = typesData[i];
    const typeName = typeObject.type.name;
    typesArray.push(typeName);
  }
  return typesArray;
}

async function fetchSinglePokemon(url) {
  return await fetchJSON(url);
}

async function fetchPokemonList(limit, offset) {
  return await fetchJSON(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
  );
}

async function openModal(id) {
  const currentList = isSearching ? filteredPokemons : loadedPokemons;
  for (let i = 0; i < currentList.length; i++) {
    if (currentList[i].id === id) {
      currentIndex = i;
      break;
    }
  }
  const poke = currentList[currentIndex];
  let species = poke.speciesData;
  if (!species) {
    species = await fetchJSON(
      `https://pokeapi.co/api/v2/pokemon-species/${poke.id}`
    );
    poke.speciesData = species;
  }
  renderModal(poke, species);
  document.getElementById("modal").classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modal").classList.remove("show");
  document.body.style.overflow = "";
}

function renderModal(data, species) {
  const types = getTypes(data);
  const mainType = types[0];
  const typesList = formatTypeList(types);
  const eggGroups = formatEggGroups(species);
  const genderText = getGenderText(species);
  const totalStats = getTotalStats(data);
  const about = buildAboutHTML(data, species, typesList, genderText);
  const stats = buildStatsHTML(data);
  const spec = buildSpeciesHTML(species, totalStats, eggGroups);
  const modalContent = document.getElementById("modalContent");
  modalContent.innerHTML = modalHTML(data, about, stats, spec, mainType);
  modalContent.className = `modal_content type-${mainType}`;
}

function getTotalStats(data) {
  let totalSum = 0;
  const statsList = data.stats;
  for (let i = 0; i < statsList.length; i++) {
    const statObject = statsList[i];
    const baseStatValue = statObject.base_stat;
    totalSum = totalSum + baseStatValue;
  }
  return totalSum;
}

function getGenderText(species) {
  if (species.gender_rate === -1) return "Genderless";
  const female = (species.gender_rate / 8) * 100;
  const male = 100 - female;
  return `♂ ${male.toFixed(1)}% / ♀ ${female.toFixed(1)}%`;
}

function formatEggGroups(species) {
  const eggGroups = species.egg_groups;
  const formattedNames = [];
  for (let i = 0; i < eggGroups.length; i++) {
    const groupName = eggGroups[i].name;
    const capitalizedName = capitalize(groupName);
    formattedNames.push(capitalizedName);
  }
  let resultString = "";
  for (let i = 0; i < formattedNames.length; i++) {
    resultString += formattedNames[i];
    if (i < formattedNames.length - 1) {
      resultString += ", ";
    }
  }
  return resultString;
}

function formatTypeList(types) {
  const formattedNames = [];
  for (let i = 0; i < types.length; i++) {
    const typeName = types[i];
    const capitalizedName = capitalize(typeName);
    formattedNames.push(capitalizedName);
  }
  let resultString = "";
  for (let i = 0; i < formattedNames.length; i++) {
    resultString += formattedNames[i];
    if (i < formattedNames.length - 1) {
      resultString += ", ";
    }
  }
  return resultString;
}

function getTypes(data) {
  const typeNames = [];
  const typesData = data.types;
  for (let i = 0; i < typesData.length; i++) {
    const typeObject = typesData[i];
    const name = typeObject.type.name;
    typeNames.push(name);
  }
  return typeNames;
}

function showTab(name) {
  const tabs = ["about", "stats", "species"];
  for (let i = 0; i < tabs.length; i++) {
    const t = tabs[i];
    const contentElement = document.getElementById(`tab_${t}_content`);
    const buttonElement = document.getElementById(`tab_${t}`);
    if (t !== name) {
      contentElement.classList.add("hidden");
    } else {
      contentElement.classList.remove("hidden");
    }
    if (t === name) {
      buttonElement.classList.add("active");
    } else {
      buttonElement.classList.remove("active");
    }
  }
}

function nextPokemon() {
  const currentList = isSearching ? filteredPokemons : loadedPokemons;
  currentIndex++;
  if (currentIndex >= currentList.length) {
    currentIndex = 0;
  }
  openModal(currentList[currentIndex].id);
}

function prevPokemon() {
  const currentList = isSearching ? filteredPokemons : loadedPokemons;
  currentIndex--;
  if (currentIndex < 0) {
    currentIndex = currentList.length - 1;
  }
  openModal(currentList[currentIndex].id);
}

function filterAndCollectCards(v, cards) {
  filteredPokemons.length = 0;
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const name = card.querySelector("h3").textContent.toLowerCase();
    const shouldHide = isSearching && !name.includes(v);
    card.classList.toggle("hidden-card", shouldHide);
    if (!shouldHide) {
      const idText = card.querySelector(".pokemon_number span").textContent;
      const id = parseInt(idText.replace("# ", "").trim());
      const poke = loadedPokemons.find((p) => p.id === id);
      if (poke) {
        filteredPokemons.push(poke);
      }
    }
  }
}

function handleSearchInput(input, loadMoreBtn) {
  const cards = document.getElementById("content").children;
  const v = input.value.toLowerCase().trim();
  isSearching = v.length >= 3;
  loadMoreBtn.classList.toggle("hidden", isSearching);
  filterAndCollectCards(v, cards);
  checkNotFound();
}

function setupSearch() {
  const input = document.querySelector(".search_input");
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  input.oninput = function () {
    handleSearchInput(input, loadMoreBtn);
  };
}

function checkNotFound() {
  const content = document.getElementById("content");
  const notFoundMessage = document.getElementById("notFoundMessage");
  const cards = content.children;
  let anyVisible = false;
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    if (!card.classList.contains("hidden-card")) {
      anyVisible = true;
      break;
    }
  }
  if (anyVisible === false) {
    notFoundMessage.classList.add("show");
  } else {
    notFoundMessage.classList.remove("show");
  }
}
