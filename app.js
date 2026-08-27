const $ = (sel) => document.querySelector(sel);

const state = {
  data: null,
  lang: "zh"
};

const UI_TEXT = {
  zh: {
    title: "STARTHOME！开始建家！",
    diaryTitle: "更新日记",
    langBtn: "EN",
    langTitle: "切换到英文 / Switch to English",
    authorLabel: "作者",
    empty: "暂无更新记录"
  },
  en: {
    title: "STARTHOME! Start Building Home!",
    diaryTitle: "Update Diary",
    langBtn: "中文",
    langTitle: "切换到中文 / Switch to Chinese",
    authorLabel: "Author",
    empty: "No updates yet"
  }
};

const EN_UPDATES = {
  "2026-08-28": {
    title: "v1.2.4 Display Polish",
    changes: [
      "Added two mirror display animations (idle & activated)",
      "Old Carpenter's Heirloom got an idle animation, set as the first display image",
      "Added mirror & red wall icons and flower table skin icons",
      "Key attributes in item details (slot counts, special effects, etc.) are now bold-highlighted",
      "Documented hairpin crafting permission and mirror features",
      "Fixed flower table images: removed the blurry duplicate skin icons"
    ]
  },
  "2026-08-12": {
    title: "Kunlun Jade Hairpin Cursor",
    changes: [
      "Replaced the mouse cursor with the Queen Mother's Kunlun Jade Hairpin icon",
      "Mirrored the hairpin cursor and set the hotspot to the top-left",
      "Added a sparkling star cursor trail effect"
    ]
  },
  "2026-08-11": {
    title: "Celestial Mirror & Red Wall",
    changes: [
      "Added the Queen Mother's Celestial Mirror and Red Wall (bilingual)",
      "Added a Chinese/English toggle for UI text, item names, descriptions, details, categories, materials, and crafting stations"
    ]
  },
  "2026-08-10": {
    title: "Intro Page Copy & Display Polish",
    changes: [
      "Item descriptions now use crafting recipe descriptions; details keep feature notes",
      "Items are sorted by in-code creation time: flower decorations last, stone/wood/fish/moonglass at the end",
      "Fixed multi-station parsing: the Pot shows both Start Building Home and Master Huo's Kiln",
      "Tea ware skins grouped by height: Gaiwan uses odd-numbered skins, the conical cup uses even-numbered skins",
      "Split Rock Pile and Moonglass Rock into separate entries; the flower rack shows all three stages",
      "Added kiln, clay, tea ware, and decoration display images"
    ]
  },
  "2026-08-09": {
    title: "Kiln & Material System",
    changes: [
      "Added kiln, material, and decoration items to the intro page",
      "Merged Heirloom 1 and 2"
    ]
  },
  "2026-08-07": {
    title: "Data Cleanup",
    changes: [
      "Fixed data.json formatting and removed duplicate items"
    ]
  },
  "2026-03-13": {
    title: "Aquarium Added",
    changes: [
      "Added the Old Fisherman's Treasured Aquarium"
    ]
  },
  "2026-01-28": {
    title: "Initial Release",
    changes: [
      "Launched the Start Building Home mod intro page"
    ]
  }
};

function isEn() { return state.lang === "en"; }
function uiText(key) { return UI_TEXT[state.lang][key]; }
function enUpdate(u) { return isEn() && EN_UPDATES[u.date] ? EN_UPDATES[u.date] : null; }

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderHeader() {
  const mod = state.data.mod || {};
  const authorLabel = uiText("authorLabel");
  $("#versionLine").textContent =
    `${mod.version || ""} ｜${authorLabel}：${mod.author || ""}`.trim() || " ";

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

function renderUpdates() {
  const updates = state.data.updates || [];
  const list = $("#list");
  if (!list) return;

  if (!updates.length) {
    list.innerHTML = `<div class="empty">${escapeHtml(uiText("empty"))}</div>`;
    return;
  }

  list.innerHTML = updates.map(u => {
    const en = enUpdate(u);
    const title = (en && en.title) || u.title || "";
    const changes = (en && en.changes) || u.changes || [];
    const versionHtml = u.version
      ? `<span class="u-version">${escapeHtml(u.version)}</span>`
      : "";

    return `
      <article class="card">
        <div class="u-head">
          <span class="u-date">${escapeHtml(u.date)}</span>
          ${versionHtml}
        </div>
        <h3 class="u-title">${escapeHtml(title)}</h3>
        <ul class="u-changes">
          ${changes.map(c => `<li>${escapeHtml(c)}</li>`).join("")}
        </ul>
      </article>
    `;
  }).join("");
}

function applyLang() {
  const titleEl = $("#titleLine");
  if (titleEl) titleEl.textContent = uiText("title");

  const diaryTitle = $("#diaryTitle");
  if (diaryTitle) diaryTitle.textContent = uiText("diaryTitle");

  const langBtn = $("#langBtn");
  if (langBtn) {
    langBtn.textContent = uiText("langBtn");
    langBtn.title = uiText("langTitle");
  }
}

function render() {
  renderHeader();
  renderUpdates();
}

async function loadData() {
  const res = await fetch("./data.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`data.json 加载失败：${res.status} ${res.statusText}`);
  return await res.json();
}

async function init() {
  try {
    if (localStorage.getItem("starthome_lang") === "en") state.lang = "en";
  } catch (e) {}

  state.data = await loadData();
  applyLang();
  render();

  $("#langBtn")?.addEventListener("click", () => {
    state.lang = state.lang === "zh" ? "en" : "zh";
    try { localStorage.setItem("starthome_lang", state.lang); } catch (e) {}
    applyLang();
    render();
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
