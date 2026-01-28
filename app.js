const $ = (sel) => document.querySelector(sel);

const state = {
  data: null,
  activeCat: "全部",
  query: ""
};

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
    item.category,
    item.detail,
    JSON.stringify(item.recipe || {}),
    item.notes
  ];
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
  $("#versionLine").textContent =
    `${mod.version || ""}  ${mod.author ? `｜作者：${mod.author}` : ""}`.trim() || " ";

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
    el.textContent = cat;

    el.addEventListener("click", () => {
      state.activeCat = cat;
      setHashFromState();
      render();
    });

    bar.appendChild(el);
  });
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


function renderRecipeHtml(recipe, q) {
  if (!recipe) return "—";

const station = recipe?.station ? String(recipe.station) : "";
const stToken = parseInlineImageToken(station);

let stationHtml = `<div class="r-station r-muted">制作站：—</div>`;
if (station) {
  stationHtml = stToken
    ? `<div class="r-station"><span class="r-label">制作站：</span><img class="r-img" src="${escapeHtml(stToken.path)}" alt="" loading="lazy" />${stToken.label ? `<span class="r-name">${highlight(stToken.label, q)}</span>` : ""}</div>`
    : `<div class="r-station"><span class="r-label">制作站：</span><span class="r-name">${highlight(station, q)}</span></div>`;
}


  const cost = Array.isArray(recipe.cost) ? recipe.cost : [];
  if (!cost.length) {
    return `<div class="r-wrap">${stationHtml}<div class="r-muted">无 / 未填写</div></div>`;
  }

  const pills = cost.map(x => {
    const rawName = x?.name ?? "";
    const cnt = x?.count ?? "";
    const token = parseInlineImageToken(rawName);

    if (token) {
    return `
        <span class="r-pill" title="${escapeHtml(token.path)}">
        <img class="r-img" src="${escapeHtml(token.path)}" alt="" loading="lazy" />
        ${token.label ? `<span class="r-name">${highlight(token.label, q)}</span>` : ""}
        <span class="r-x">x${escapeHtml(cnt)}</span>
        </span>
    `;
    }

    return `
      <span class="r-pill">
        <span class="r-name">${highlight(rawName, q)}</span>
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
        没有找到匹配的内容。你可以：
        <ul>
          <li>清空搜索词</li>
          <li>切换到“全部”分类</li>
        </ul>
      </div>
    `;
  } else {
    list.innerHTML = items.map(item => {
      const name = highlight(item.name, q);

      const tags = getCats(item).map(c => `<span class="tag">${escapeHtml(c)}</span>`).join("");


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
      <div class="placeholder">未配置图片：在 data.json 的 images 数组里填入 images/xxx.png</div>
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
        <img src="${escapeHtml(imgs[safeCur])}" alt="${escapeHtml(item.name)} 图片 ${safeCur + 2}" loading="lazy" />
        <div class="carNav">
          <button class="carBtn" data-act="prev" data-id="${escapeHtml(item.id)}" aria-label="上一张">‹</button>
          <button class="carBtn" data-act="next" data-id="${escapeHtml(item.id)}" aria-label="下一张">›</button>
        </div>
      </div>
      <div class="dots">${dots}</div>
    </div>
  `;

      }


    const recipeHtml = renderRecipeHtml(item.recipe || null, q);


      const detailText = item.detail || item.notes || "";
      const detailHtml = detailText ? `
        <div class="detail">
          <div class="k">详细介绍</div>
          <div class="v">${highlight(detailText, q)}</div>
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
              <div class="k">配方</div>
              <div class="v">${recipeHtml}</div>
            </div>
          </div>

          ${detailHtml}
        </article>
      `;
    }).join("");
  }

  $("#resultHint").textContent = `当前展示：${items.length} / ${(state.data.items || []).length} 个物品`;
  $("#activeState").textContent = `分类：${state.activeCat || "全部"}｜搜索：${state.query ? state.query : "无"}`;

  const input = $("#searchInput");
  if (input && input.value !== state.query) input.value = state.query;
}


function render() {
  renderCats();
  renderList();
}

async function init() {
  loadStateFromHash();
  state.data = await loadData();


  const set = new Set();
  (state.data.items || []).forEach(it => {
    getCats(it).forEach(c => set.add(c));
  });
  const cats = Array.from(set);

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
