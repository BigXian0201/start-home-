const $ = (sel) => document.querySelector(sel);

const state = {
  data: null,
  activeCat: "全部",
  query: "",
  lang: "zh"
};

const UI_TEXT = {
  zh: {
    title: "STARTHOME！开始建家！",
    searchPlaceholder: "搜索：物品名 / 配方 / 关键词…",
    searchTitle: "全局搜索（名称/配方/详细介绍等）",
    clear: "清空",
    reset: "重置分类",
    langBtn: "EN",
    langTitle: "切换到英文 / Switch to English",
    catAria: "分类栏",
    noImage: "未配置图片：在 data.json 的 images 数组里填入 images/xxx.png",
    recipe: "配方",
    desc: "物品描述",
    detail: "详细介绍",
    stationLabel: "制作站：",
    stationNone: "无 / 未填写",
    altImage: "图片",
    prev: "上一张",
    next: "下一张",
    emptyTitle: "没有找到匹配的内容。你可以：",
    emptyClear: "清空搜索词",
    emptyAll: "切换到“全部”分类",
    resultHint: (n, total) => `当前展示：${n} / ${total} 个物品`,
    activeState: (cat, q) => `分类：${cat}｜搜索：${q ? q : "无"}`
  },
  en: {
    title: "STARTHOME! Start Building Home!",
    searchPlaceholder: "Search: item / recipe / keyword…",
    searchTitle: "Search item names, recipes and details",
    clear: "Clear",
    reset: "Reset Category",
    langBtn: "中文",
    langTitle: "切换到中文 / Switch to Chinese",
    catAria: "Category bar",
    noImage: "No image: add images/xxx.png to the images array in data.json",
    recipe: "Recipe",
    desc: "Description",
    detail: "Details",
    stationLabel: "Crafting at: ",
    stationNone: "None / not filled",
    altImage: "image",
    prev: "Previous",
    next: "Next",
    emptyTitle: "No matches found. You can:",
    emptyClear: "Clear the search",
    emptyAll: "Switch to the “All” category",
    resultHint: (n, total) => `Showing ${n} / ${total} items`,
    activeState: (cat, q) => `Category: ${cat}｜Search: ${q ? q : "none"}`
  }
};

const EN_CATS = {
  "全部": "All",
  "建筑": "Building",
  "工具": "Tools",
  "魔法": "Magic",
  "材料": "Materials",
  "装饰": "Decoration",
  "储物方案": "Storage",
  "其他": "Other"
};

const EN_STATIONS = {
  "不需要": "None",
  "炼金引擎": "Alchemy Engine",
  "暗影操控器": "Shadow Manipulator",
  "火师傅宝窑": "Master Huo's Kiln",
  "开始建家": "Start Building Home"
};

const EN_MATS = {
  "石砖": "Cut Stone",
  "木炭": "Charcoal",
  "金块": "Gold Nugget",
  "花瓣": "Petals",
  "鸟粪": "Guano",
  "树枝": "Twigs",
  "紫宝石": "Purple Gem",
  "玻璃碎片": "Moon Glass",
  "噩梦燃料": "Nightmare Fuel",
  "冰块": "Ice",
  "木板": "Boards",
  "浮木": "Driftwood Log",
  "石头": "Rocks",
  "烂鱼": "Spoiled Fish",
  "粘土": "Clay",
  "粘土砖": "Clay Brick"
};

const EN_ITEMS = {
  "实木长条桌": {
    name: "Solid Wood Banquet Table",
    desc: "Now that is a large table!",
    detail: "1. A 9-slot container.\n2. Food inside never spoils.\n3. Items can stack, and any item can be placed inside.\n4. Has a dedicated UI."
  },
  "花几": {
    name: "Flower Display Table",
    desc: "A place for your favorite decorations.",
    detail: "1. A single-slot container.\n2. Food inside never spoils.\n3. Items can stack, and any item can be placed inside.\n4. Has skins: Ironwork and Country."
  },
  "老木匠的传家宝": {
    name: "Old Carpenter's Heirloom",
    desc: "Build a cabinet frame, then fit the shelves and drawers.",
    detail: "1. A 20-slot container. Food does not stay fresh; items can stack and any item can be placed inside.\n2. Has a dedicated UI.\n3. An enormous display cabinet — show off every treasure you have gathered!\n4. Keeps the item's original drop animation.\nNote: Heirloom 1 and 2 are two looks of the same item; both can rotate in four directions."
  },
  "老渔翁的家藏珍": {
    name: "Old Fisherman's Treasured Aquarium",
    desc: "Chinese patterns and glass make a fine home for beautiful fish.",
    detail: "1. An aquarium with unlimited slots that keeps food fresh.\n2. Can be decorated; its decoration slots are shared with the snowman.\n3. No more excuses for coming back empty-handed!\n4. Hit it with a hammer to pick it up."
  },
  "王母娘娘的昆仑玉簪": {
    name: "Queen Mother's Kunlun Jade Hairpin",
    desc: "It is said the Queen Mother once used it to divide the Heavenly River...",
    detail: "1. Right-click to toggle conversion between land and ocean.\n2. Has an unlimited turf container; turfs are used automatically when converting ocean back to land.\n3. Insert gems of different colors to unlock different-colored lights; the radius grows with more gems.\n4. +25% movement speed."
  },
  "小木匠出师作": {
    name: "Young Carpenter's Masterpiece",
    desc: "Master, look! I finally made something all by myself!",
    detail: "1. An upgradeable display flower rack: Level 1 has 4 slots, Level 2 has 11, Level 3 has 18.\n2. Right-click with boards to upgrade; each level costs 5 boards, up to Level 3.\n3. Items can stack and any item can be placed; placed items are shown directly on the rack.\nA few steps gather blossoms; a whole rack holds a garden."
  },
  "一块有味道且很粘的土": {
    name: "A Smelly Lump of Sticky Clay",
    desc: "That is certainly sticky!",
    detail: "1. Clay material; can be refined into Clay Bricks.\n2. Firing in batches at Master Huo's Kiln is more efficient.\nThat is certainly sticky!"
  },
  "火师傅的贴身宝窑": {
    name: "Master Huo's Cherished Kiln",
    desc: "Master Huo tended this gentle palace kiln for half his life. Who would not envy it?",
    detail: "1. A dedicated crafting station; approach it to unlock kiln-only recipes.\n2. Fire Clay Bricks: 5 clay → 2 bricks; large firing: 50 clay → 20 bricks.\n3. Fire A Pot of Mountains and Seas: 2 or 20 pots per firing.\n4. Also fires Lotus, Pear Blossom, Snow-White Three-Piece Gaiwan, and White Rush Conical Cup.\n5. Batch firing saves materials and time.\nMaster Huo tended this gentle palace kiln for half his life. Who would not envy it?"
  },
  "粘土砖": {
    name: "Clay Brick",
    desc: "Firing it seems to have removed most of the smell.",
    detail: "1. Fired clay bricks — the core material for flowers, tea ware, pots, and more.\n2. Master Huo's Kiln can fire them in batches: 5 clay → 2 bricks, 50 clay → 20 bricks (saving materials and time).\nFiring it seems to have removed most of the smell."
  },
  "素雪三才盏": {
    name: "Snow-White Three-Piece Gaiwan",
    desc: "Snow-White Three-Piece Gaiwan",
    detail: "1. Tea ware; can be collected or placed in display containers.\n2. Can only be crafted at Master Huo's Kiln.\n3. Has skins: Vermilion Square Gaiwan, Celadon Dew Pitcher, Jade Lotus Gaiwan, Silver-Scale Moon Cup."
  },
  "白箬斗笠杯": {
    name: "White Rush Conical Cup",
    desc: "White Rush Conical Cup",
    detail: "1. Tea ware; can be collected or placed in display containers.\n2. Can only be crafted at Master Huo's Kiln.\n3. Has skins: Vermilion Open Cup, Icy Lotus Cup, Green Lotus Tasting Cup, Pale-Celadon Round Pitcher."
  },
  "一壶盛世间山海": {
    name: "A Pot of Mountains and Seas",
    desc: "A single vessel holds the rise and fall of every season.",
    detail: "1. Use Pack on buildings or items in the world to store them in the pot and carry them with you.\n2. Place the pot to unpack items; the pot becomes empty again.\n3. The pot is not randomly colored: after packing, the pot takes the shape of a tea cup — the packed item appears as a tea cup.\n4. Put a filled pot into a display cabinet, and the packed item is shown inside the cabinet.\n5. Can also be fired in batches at Master Huo's Kiln (2 or 20 pots, saving materials and time).\nA single vessel holds the rise and fall of every season."
  },
  "王母娘娘的照容仙镜": {
    name: "Queen Mother's Reflection Mirror",
    desc: "Kept at the Jade Pool vanity, this mirror can also reveal the illusions of the world.",
    detail: "1. Activate the mirror to scan objects within range.\n2. Select a target to create a Mirror Image that can be carried or placed on display.\n3. A Mirror Image is only a reflection — no real function — and its size, height, facing, rotation, and animation speed can all be adjusted.\n4. It can also reflect the appearance of characters and creatures.\nKept at the Jade Pool vanity, this mirror can also reveal the illusions of the world."
  },
  "红墙": {
    name: "Red Wall",
    desc: "A sturdy red stone wall.",
    detail: "1. A sturdy red stone wall that blocks the path.\n2. Like the vanilla stone wall, it shows damage stages as its durability drops.\n3. Crafted from 2 Cut Stone into 6 walls (Alchemy Engine).\nA red stone wall."
  },
  "芍药": {
    name: "Peony",
    desc: "Arrange freshly cut peonies in a vase.",
    detail: "1. Purely decorative; it does not attract butterflies.\n2. Can be planted on the ground, picked up with right-click, and placed in containers.\n3. More flowers are coming soon — nine in total!"
  },
  "梨花": {
    name: "Pear Blossom",
    desc: "Pure as snow and pale as carved jade.",
    detail: "1. A decorative pear blossom; can be planted on the ground or picked up and carried.\n2. Can only be crafted at Master Huo's Kiln.\n3. Can be placed in display containers like the Flower Display Table and Flower Rack.\nPure as snow and pale as carved jade."
  },
  "荷花": {
    name: "Lotus",
    desc: "Lotus leaves and blossoms share the summer light.",
    detail: "1. A decorative lotus; can be planted on the ground or picked up and carried.\n2. Can only be crafted at Master Huo's Kiln.\n3. Can be placed in display containers like the Flower Display Table and Flower Rack.\nLotus leaves and blossoms share the summer light."
  },
  "树干": {
    name: "Driftwood",
    desc: "For decoration.",
    detail: "1. Decorative driftwood trunks, 5 variants.\n2. Can be placed in decoration slots such as snowmen and aquariums.\nDriftwood? More like sunk wood!"
  },
  "石头堆": {
    name: "Rock Pile",
    desc: "For decoration.",
    detail: "1. Decorative rock piles, 3 variants.\n2. Can be placed in decoration slots such as snowmen and aquariums.\nA few scattered stones."
  },
  "玻璃石头": {
    name: "Moonglass Rock",
    desc: "For decoration.",
    detail: "1. Decorative moonglass rocks, 3 variants.\n2. Can be placed in decoration slots such as snowmen and aquariums.\nIt sparkles."
  },
  "鱼骨头": {
    name: "Fish Bones",
    desc: "For decoration.",
    detail: "1. Decorative fish bones, 3 variants.\n2. Can be placed in decoration slots such as snowmen and aquariums.\nIs that a fish skeleton?"
  }
};

function isEn() { return state.lang === "en"; }
function uiText(key) { return UI_TEXT[state.lang][key]; }
function enCat(c) { return isEn() && EN_CATS[c] ? EN_CATS[c] : c; }
function enStation(label) { return isEn() && EN_STATIONS[label] ? EN_STATIONS[label] : label; }
function enMat(label) { return isEn() && EN_MATS[label] ? EN_MATS[label] : label; }
function enItem(item) { return isEn() && EN_ITEMS[item.id] ? EN_ITEMS[item.id] : null; }

const carouselState = new Map();
function getCats(item) {
  const c = item?.category;
  if (Array.isArray(c)) return c.map(x => String(x).trim()).filter(Boolean);
  if (typeof c === "string") return c.split(/[\/|,，]/).map(s => s.trim()).filter(Boolean);
  return [];
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalize(s) {
  return String(s ?? "").trim().toLowerCase();
}

function itemSearchText(item) {
  const parts = [
    item.id,
    item.name,
    item.desc,
    item.category,
    item.detail,
    JSON.stringify(item.recipe || {}),
    item.notes
  ];
  const en = EN_ITEMS[item.id];
  if (en) parts.push(en.name, en.desc, en.detail);
  return normalize(parts.join(" "));
}


function highlight(text, q) {
  const raw = String(text ?? "");
  const query = String(q ?? "").trim();
  if (!query) return escapeHtml(raw);

  const reg = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "ig");
  const matches = raw.match(reg);
  if (!matches) return escapeHtml(raw);

  const parts = raw.split(reg);
  const out = [];
  for (let i = 0; i < parts.length; i++) {
    out.push(escapeHtml(parts[i]));
    if (i < parts.length - 1) out.push(`<span class="hl">${escapeHtml(matches[i] ?? query)}</span>`);
  }
  return out.join("");
}

function setHashFromState() {
  const params = new URLSearchParams();
  if (state.activeCat && state.activeCat !== "全部") params.set("cat", state.activeCat);
  if (state.query) params.set("q", state.query);
  const hash = params.toString();
  location.hash = hash ? `#${hash}` : "";
}

function loadStateFromHash() {
  const hash = (location.hash || "").replace(/^#/, "");
  const params = new URLSearchParams(hash);
  state.activeCat = params.get("cat") || "全部";
  state.query = params.get("q") || "";
}


function loadEmbeddedData() {
  const el = document.getElementById("DATA_JSON");
  if (!el) return null;
  try {
    return JSON.parse(el.textContent.trim());
  } catch (e) {
    console.error("DATA_JSON 解析失败：", e);
    return null;
  }
}

async function loadData() {
  const embedded = loadEmbeddedData();
  if (embedded) return embedded;

  const res = await fetch("./data.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`data.json 加载失败：${res.status} ${res.statusText}`);
  return await res.json();
}

function renderHeader() {
  const mod = state.data.mod || {};
  const authorLabel = isEn() ? "Author" : "作者";
  $("#versionLine").textContent =
    `${mod.version || ""}  ${mod.author ? `｜${authorLabel}：${mod.author}` : ""}`.trim() || " ";

  const links = mod.links || [];
  const linkHtml = links
    .filter(l => l && l.label)
    .map(l => {
      const url = l.url ? String(l.url) : "";
      if (!url) return `<span class="chip">${escapeHtml(l.label)}</span>`;
      return `<a class="chip" href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(l.label)}</a>`;
    })
    .join(" ");

  $("#footer").innerHTML = `
    <div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:10px;align-items:center;">
      ${linkHtml}
    </div>
    ${mod.desc ? `<div style="margin-top:10px">${escapeHtml(mod.desc)}</div>` : ""}
    ${mod.note ? `<div style="opacity:.85;font-size:12px;">${escapeHtml(mod.note)}</div>` : ""}
  `;
}

function renderCats() {
  const cats = state.data.categories || ["全部"];
  const bar = $("#catBar");
  bar.innerHTML = "";

  cats.forEach(cat => {
    const el = document.createElement("div");
    el.className = "chip" + (cat === state.activeCat ? " active" : "");
    el.textContent = enCat(cat);

    el.addEventListener("click", () => {
      state.activeCat = cat;
      setHashFromState();
      render();
    });

    bar.appendChild(el);
  });
}

function applyLang() {
  const titleEl = $("#titleLine");
  if (titleEl) titleEl.textContent = uiText("title");

  const input = $("#searchInput");
  if (input) {
    input.placeholder = uiText("searchPlaceholder");
    input.title = uiText("searchTitle");
  }
  const searchBox = document.querySelector(".search");
  if (searchBox) searchBox.title = uiText("searchTitle");

  const clearBtn = $("#clearBtn");
  if (clearBtn) clearBtn.textContent = uiText("clear");
  const resetBtn = $("#resetBtn");
  if (resetBtn) resetBtn.textContent = uiText("reset");

  const langBtn = $("#langBtn");
  if (langBtn) {
    langBtn.textContent = uiText("langBtn");
    langBtn.title = uiText("langTitle");
  }

  const catBar = $("#catBar");
  if (catBar) catBar.setAttribute("aria-label", uiText("catAria"));
}

function parseInlineImageToken(text) {
  const s = String(text || "").trim();

  const m = s.match(/\[([^\]]+)\]/);
  if (!m) return null;

  const path = m[1].trim();
  if (!/\.(png|jpg|jpeg|webp|gif|svg)$/i.test(path)) return null;

  const before = s.slice(0, m.index).trim();
  const after = s.slice(m.index + m[0].length).trim();
  const label = [before, after].filter(Boolean).join(" ").trim();

  return { path, label };
}

function parseInlineImageTokens(text) {
  const s = String(text || "").trim();
  const tokens = [];
  const re = /([^[\]]*)\[([^\]]+)\]/g;
  let m;
  while ((m = re.exec(s)) !== null) {
    const path = m[2].trim();
    if (!/\.(png|jpg|jpeg|webp|gif|svg)$/i.test(path)) continue;
    const label = m[1].trim().replace(/^\/\s*/, "").trim();
    tokens.push({ path, label });
  }
  return tokens;
}


function renderRecipeHtml(recipe, q) {
  if (!recipe) return "—";

const station = recipe?.station ? String(recipe.station) : "";
const stTokens = parseInlineImageTokens(station);
const stationLabel = uiText("stationLabel");

let stationHtml = `<div class="r-station r-muted">${stationLabel}—</div>`;
if (station) {
  stationHtml = stTokens.length
    ? `<div class="r-station"><span class="r-label">${stationLabel}</span>${stTokens.map(t =>
        `<img class="r-img" src="${escapeHtml(t.path)}" alt="" loading="lazy" />` +
        (t.label ? `<span class="r-name">${highlight(enStation(t.label), q)}</span>` : "")
      ).join('<span class="r-muted"> / </span>')}</div>`
    : `<div class="r-station"><span class="r-label">${stationLabel}</span><span class="r-name">${highlight(station, q)}</span></div>`;
}


  const cost = Array.isArray(recipe.cost) ? recipe.cost : [];
  if (!cost.length) {
    return `<div class="r-wrap">${stationHtml}<div class="r-muted">${escapeHtml(uiText("stationNone"))}</div></div>`;
  }

  const pills = cost.map(x => {
    const rawName = x?.name ?? "";
    const cnt = x?.count ?? "";
    const token = parseInlineImageToken(rawName);

    if (token) {
    return `
        <span class="r-pill" title="${escapeHtml(token.path)}">
        <img class="r-img" src="${escapeHtml(token.path)}" alt="" loading="lazy" />
        ${token.label ? `<span class="r-name">${highlight(enMat(token.label), q)}</span>` : ""}
        <span class="r-x">x${escapeHtml(cnt)}</span>
        </span>
    `;
    }

    return `
      <span class="r-pill">
        <span class="r-name">${highlight(enMat(rawName), q)}</span>
        <span class="r-x">x${escapeHtml(cnt)}</span>
      </span>
    `;
  }).join("");

  return `<div class="r-wrap">${stationHtml}<div class="r-cost">${pills}</div></div>`;
}


function matchItem(item) {
  const cs = getCats(item);
  const catOk = (state.activeCat === "全部") || cs.includes(state.activeCat);
  if (!catOk) return false;

  const q = normalize(state.query);
  if (!q) return true;

  return itemSearchText(item).includes(q);
}

function iconHtml(item) {
  const imgs = Array.isArray(item.images) ? item.images.filter(Boolean) : [];
  const thumb = imgs.length ? String(imgs[0]).trim() : "";

  if (thumb) {
    return `<div class="icon has-img"><img src="${escapeHtml(thumb)}" alt="" loading="lazy"></div>`;
  }

  const name = String(item.name || "").trim();
  const ch = name ? name[0] : "★";
  return `<div class="icon">${escapeHtml(ch)}</div>`;
}

function renderList() {
  const items = (state.data.items || []).filter(matchItem);
  const list = $("#list");
  const q = state.query;

  if (!list) throw new Error("找不到容器 #list（请确认 index.html 中有 <section id='list'>）");

  if (!items.length) {
    list.innerHTML = `
      <div class="empty">
        ${escapeHtml(uiText("emptyTitle"))}
        <ul>
          <li>${escapeHtml(uiText("emptyClear"))}</li>
          <li>${escapeHtml(uiText("emptyAll"))}</li>
        </ul>
      </div>
    `;
  } else {
    list.innerHTML = items.map(item => {
      const en = enItem(item);
      const displayName = en ? en.name : item.name;
      const name = highlight(displayName, q);

      const tags = getCats(item).map(c => `<span class="tag">${escapeHtml(enCat(c))}</span>`).join("");


const allImgs = Array.isArray(item.images) ? item.images.filter(Boolean) : [];


const iconImg = allImgs.length ? allImgs[0] : "";


const imgs = allImgs.length > 1 ? allImgs.slice(1) : [];


const cur = carouselState.has(item.id) ? carouselState.get(item.id) : 0;
const safeCur = imgs.length ? Math.max(0, Math.min(cur, imgs.length - 1)) : 0;
carouselState.set(item.id, safeCur);

let mediaHtml = "";


if (!allImgs.length) {
  mediaHtml = `
    <div class="media">
      <div class="placeholder">${escapeHtml(uiText("noImage"))}</div>
    </div>
  `;
}

else if (!imgs.length) {
  mediaHtml = "";
}

else {
  const dots = imgs.map((_, i) =>
    `<span class="dot ${i === safeCur ? "active" : ""}" data-act="dot" data-id="${escapeHtml(item.id)}" data-i="${i}"></span>`
  ).join("");

  mediaHtml = `
    <div class="media">
      <div class="carousel">
        <img src="${escapeHtml(imgs[safeCur])}" alt="${escapeHtml(displayName)} ${uiText("altImage")} ${safeCur + 2}" loading="lazy" />
        <div class="carNav">
          <button class="carBtn" data-act="prev" data-id="${escapeHtml(item.id)}" aria-label="${escapeHtml(uiText("prev"))}">‹</button>
          <button class="carBtn" data-act="next" data-id="${escapeHtml(item.id)}" aria-label="${escapeHtml(uiText("next"))}">›</button>
        </div>
      </div>
      <div class="dots">${dots}</div>
    </div>
  `;

      }


    const recipeHtml = renderRecipeHtml(item.recipe || null, q);


      const descText = ((en && en.desc) || item.desc || "").trim();
      const detailText = (en && en.detail) || item.detail || item.notes || "";
      const detailLines = detailText.split("\n").map(s => s.trim()).filter(Boolean);
      const featureLines = [];
      const extraLines = [];
      for (const line of detailLines) {
        if (/^\d+[).、]/.test(line)) {
          featureLines.push(line.replace(/^(\d+)[).、]/, isEn() ? "$1. " : "$1、"));
        } else if (line !== descText) {
          extraLines.push(line);
        }
      }
      const descHtml = descText ? `
        <div class="detail">
          <div class="k">${escapeHtml(uiText("desc"))}</div>
          <div class="v">${highlight(descText, q)}</div>
        </div>
      ` : "";
      const introLines = [...featureLines, ...extraLines];
      const detailHtml = introLines.length ? `
        <div class="detail">
          <div class="k">${escapeHtml(uiText("detail"))}</div>
          <div class="v">${highlight(introLines.join("\n"), q)}</div>
        </div>
      ` : "";

      return `
        <article class="card">
          ${mediaHtml}

          <div class="toprow" style="margin-top:12px;">
            ${iconHtml(item)}
            <div style="min-width:0">
              <h3 class="name">${name}</h3>
              <div class="meta">${tags}</div>
            </div>
          </div>

          <div class="kv" style="grid-template-columns: 1fr;">
            <div class="box">
              <div class="k">${escapeHtml(uiText("recipe"))}</div>
              <div class="v">${recipeHtml}</div>
            </div>
          </div>

          ${descHtml}
          ${detailHtml}
        </article>
      `;
    }).join("");
  }

  $("#resultHint").textContent = uiText("resultHint")(items.length, (state.data.items || []).length);
  $("#activeState").textContent = uiText("activeState")(enCat(state.activeCat || "全部"), state.query);

  const input = $("#searchInput");
  if (input && input.value !== state.query) input.value = state.query;
}


function render() {
  renderCats();
  renderList();
}

async function init() {
  try {
    if (localStorage.getItem("starthome_lang") === "en") state.lang = "en";
  } catch (e) {}

  loadStateFromHash();
  state.data = await loadData();


  const set = new Set();
  (state.data.items || []).forEach(it => {
    getCats(it).forEach(c => set.add(c));
  });
  const cats = Array.from(set);

  applyLang();
  renderHeader();
  render();


    $("#list")?.addEventListener("click", (e) => {
    const t = e.target;
    if (!t || !t.dataset) return;

    const act = t.dataset.act;
    const id = t.dataset.id;
    if (!act || !id) return;

    const item = (state.data.items || []).find(x => x.id === id);
    if (!item) return;


    const allImgs = Array.isArray(item.images) ? item.images.filter(Boolean) : [];
    const imgs = allImgs.length > 1 ? allImgs.slice(1) : [];
    if (!imgs.length) return;

    let cur = carouselState.get(id) || 0;

    if (act === "prev") cur = (cur - 1 + imgs.length) % imgs.length;
    else if (act === "next") cur = (cur + 1) % imgs.length;
    else if (act === "dot") {
    cur = Number(t.dataset.i || 0);
    cur = Math.max(0, Math.min(cur, imgs.length - 1));
    }

    carouselState.set(id, cur);
    render();
    });

  const input = $("#searchInput");
  let t = null;
  if (input) {
    input.addEventListener("input", (e) => {
      clearTimeout(t);
      t = setTimeout(() => {
        state.query = e.target.value.trim();
        setHashFromState();
        render();
      }, 120);
    });
  }

  $("#clearBtn")?.addEventListener("click", () => {
    state.query = "";
    setHashFromState();
    render();
    input?.focus();
  });

  $("#resetBtn")?.addEventListener("click", () => {
    state.activeCat = "全部";
    setHashFromState();
    render();
  });

  $("#langBtn")?.addEventListener("click", () => {
    state.lang = state.lang === "zh" ? "en" : "zh";
    try { localStorage.setItem("starthome_lang", state.lang); } catch (e) {}
    applyLang();
    render();
  });

  window.addEventListener("hashchange", () => {
    const beforeCat = state.activeCat;
    const beforeQ = state.query;
    loadStateFromHash();
    if (beforeCat !== state.activeCat || beforeQ !== state.query) render();
  });
}

init().catch(err => {
  console.error(err);
  const list = $("#list");
  if (list) {
    list.innerHTML = `<div class="empty">初始化失败：${escapeHtml(err.message || String(err))}</div>`;
  } else {
    document.body.insertAdjacentHTML("beforeend",
      `<div style="padding:16px;color:#fff">初始化失败：${escapeHtml(err.message || String(err))}</div>`);
  }
});
