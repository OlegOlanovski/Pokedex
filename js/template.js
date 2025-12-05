function buildTypesHTML(types) {
  let html = "";
  for (let i = 0; i < types.length; i++) {
    const t = types[i];
    html += `<span class="typeTag type-${t}">${capitalize(t)}</span>`;
  }
  return html;
}

function cardTemplate(poke, typesHTML) {
  const mainType = poke.types[0].type.name;
  return `
        <div class="card type-${mainType}" onclick="openModal(${poke.id})">
          <div class="pokemon_number"><span># ${poke.id}</span></div>
          <img src="${poke.sprites.other["official-artwork"].front_default}">
          <h3>${capitalize(poke.name)}</h3>
          <div class="types">${typesHTML}</div>
        </div>
      `;
}

function modalHTML(data, about, stats, spec, mainType) {
  return `<h2><span>#${data.id}</span> ${capitalize(data.name)}</h2>
      <div class="img_container type-${mainType}"><img src="${
    data.sprites.other["official-artwork"].front_default
  }"class="poke_img"> </div>
      <div class="modal_nav"><button class="btn_prev" onclick="prevPokemon()">←</button>
        <button class="btn_next" onclick="nextPokemon()">→</button></div>
      <div class="tabs"><button onclick="showTab('about')" id="tab_about" class="tab_btn active">About</button>
        <button onclick="showTab('stats')" id="tab_stats" class="tab_btn">Stats</button>
        <button onclick="showTab('species')" id="tab_species" class="tab_btn">Species</button></div>
      <div id="tab_about_content" class="tab_content">${about}</div>
      <div id="tab_stats_content" class="tab_content hidden">${stats}</div>
      <div id="tab_species_content" class="tab_content hidden">${spec}</div>`;
}

function buildSpeciesHTML(species, totalStats, eggGroups) {
  return `
      <p><b>Color:</b> ${species.color.name}</p>
      <p><b>Habitat:</b> ${species.habitat ? species.habitat.name : "-"}</p>
      <p><b>Shape:</b> ${species.shape.name}</p>
      <p><b>Total Base Stats:</b> ${totalStats}</p>
      <p><b>Generation:</b> ${capitalize(species.generation.name)}</p>
      <p><b>Egg Groups:</b> ${eggGroups}</p>
      <p><b>Base Happiness:</b> ${species.base_happiness}</p>
      <p><b>Is Legendary:</b> ${species.is_legendary ? "Yes" : "No"}</p>
    `;
}

function buildStatsHTML(data) {
  let html = "";
  for (let i = 0; i < data.stats.length; i++) {
    const name = capitalize(data.stats[i].stat.name);
    const val = data.stats[i].base_stat;
    html += `
        <div class="stat">
          <div class="stat-name">${name}: ${val}</div>
          <div class="stat-bar"><div class="stat-bar-inner" style="width:${val}%"></div></div>
        </div>
      `;
  }
  return html;
}

function buildAboutHTML(data, species, typesList, genderText) {
  return `
      <p><b>Height:</b> ${data.height}</p>
      <p><b>Weight:</b> ${data.weight}</p>
      <p><b>XP:</b> ${data.base_experience}</p>
      <p><b>Ability:</b> ${capitalize(data.abilities[0].ability.name)}</p>
      <p><b>Types:</b> ${typesList}</p>
      <p><b>Capture Rate:</b> ${species.capture_rate}</p>
      <p><b>Growth Rate:</b> ${capitalize(species.growth_rate.name)}</p>
      <p><b>Gender Ratio:</b> ${genderText}</p>
    `;
}
