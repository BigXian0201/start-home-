const $ = (sel) => document.querySelector(sel);

const state = {
  data: null,
  view: "home",
  mainline: "",
  activeCats: [],
  query: "",
  lang: "zh",
  theme: "light"
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
    themeBtn: "切换深色/浅色主题",
    viewAll: "查看全部物件",
    backHome: "返回首页",
    homeSecCats: "🏮 模组三大类目",
    homeSecThanks: "🤍 制作致谢与支持通道",
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
    diaryResult: (n, total) => `更新日记：${n} / ${total} 条记录`,
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
    themeBtn: "Toggle dark/light theme",
    viewAll: "View All Items",
    backHome: "Back to Home",
    homeSecCats: "🏮 Three Main Lines",
    homeSecThanks: "🤍 Credits & Support",
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
    diaryResult: (n, total) => `Update Diary: ${n} / ${total} entries`,
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
  "更新日记": "Update Diary"
};

const EN_MAINLINES = {
  "市井天工": {
    name: "Worldly Crafts",
    tagline: "Divine craftsmanship within mortal life",
    desc: "Daily-life oriental wares: Chinese tables and chairs, display cabinets and flower racks, tea ware and ceramics, plants, and fresh-keeping storage furniture. A kiln system lets you fire clay building materials and decorations by hand or in batches."
  },
  "仙尘旧物": {
    name: "Fairy Relics",
    tagline: "Dust and old relics shaken from an immortal's sleeve",
    desc: "Mythical relics: the Kunlun Jade Hairpin and the World-Vessel Pot. Reshape land and ocean freely, pack whole buildings in one click, with built-in turf storage and a movement-speed bonus."
  },
  "浮世偶遇": {
    name: "Miscellaneous",
    tagline: "Wandering curiosities met by chance in the mortal world",
    desc: "Small scenery pieces such as driftwood, stone chips, crystal shards, and fish bones. Place them in aquariums or snowman slots to decorate freely."
  }
};

const EN_HOME = {
  lead: "Made for base-building players who love scenery, collections and oriental soft furnishing. Focused on Chinese-style decor, landscape props and building utilities to create your own oriental courtyard.",
  credits: "Art & Animation: BigXian喵大仙\nCode thanks: San, mooncake, Huahua\nDST art commissions open — furniture, items, character textures",
  links: "📺 Bilibili: 喵大仙BigXian\n📕 Xiaohongshu: 喵大仙BigXian\n💬 Feedback QQ group: 199540863"
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
    detail: "1. A <b>9-slot</b> container.\n2. Food inside <b>never spoils</b>.\n3. Items can stack, and any item can be placed inside.\n4. Has a dedicated UI."
  },
  "花几": {
    name: "Flower Display Table",
    desc: "A place for your favorite decorations.",
    detail: "1. A <b>single-slot</b> container.\n2. Food inside <b>never spoils</b>.\n3. Items can stack, and any item can be placed inside.\n4. Has skins: <b>Ironwork and Country</b>."
  },
  "老木匠的传家宝": {
    name: "Old Carpenter's Heirloom",
    desc: "Build a cabinet frame, then fit the shelves and drawers.",
    detail: "1. A <b>20-slot</b> container. Food does not stay fresh; items can stack and any item can be placed inside.\n2. Has a dedicated UI.\n3. An <b>enormous display cabinet</b> — show off every treasure you have gathered!\n4. Keeps the item's original drop animation.\nNote: In-game these are two separate recipes — Old Carpenter's Heirloom and Old Carpenter's Second Heirloom. Both work the same and look different; each can rotate in four directions."
  },
  "老渔翁的家藏珍": {
    name: "Old Fisherman's Treasured Aquarium",
    desc: "Chinese patterns and glass make a fine home for beautiful fish.",
    detail: "1. An <b>aquarium with unlimited slots</b> that keeps food fresh.\n2. Can be decorated; its decoration slots are <b>shared with the snowman</b>.\n3. No more excuses for coming back empty-handed!\n4. Hit it with a hammer to pick it up."
  },
  "王母娘娘的昆仑玉簪": {
    name: "Queen Mother's Kunlun Jade Hairpin",
    desc: "It is said the Queen Mother once used it to divide the Heavenly River...",
    detail: "1. Right-click to toggle <b>land and ocean conversion</b>.\n2. Has an <b>unlimited turf container</b>; turfs are used automatically when converting ocean back to land.\n3. Insert gems of different colors to unlock <b>different-colored lights</b>; the radius grows with more gems.\n4. <b>+25% movement speed</b>.\n5. Server admins can set <b>crafting permission</b>: All Players (default) or Admins Only."
  },
  "小木匠出师作": {
    name: "Young Carpenter's Masterpiece",
    desc: "Master, look! I finally made something all by myself!",
    detail: "1. An upgradeable display flower rack: <b>Level 1: 4 slots → Level 2: 11 slots → Level 3: 18 slots</b>.\n2. Right-click with boards to upgrade; <b>each level costs 5 boards</b>, up to Level 3.\n3. Items can stack and any item can be placed; placed items are <b>shown directly on the rack</b>.\nA few steps gather blossoms; a whole rack holds a garden."
  },
  "一块有味道且很粘的土": {
    name: "A Smelly Lump of Sticky Clay",
    desc: "That is certainly sticky!",
    detail: "1. <b>Clay material</b>; can be refined into Clay Bricks.\n2. Firing in batches at Master Huo's Kiln is <b>more efficient</b>.\nThat is certainly sticky!"
  },
  "火师傅的贴身宝窑": {
    name: "Master Huo's Cherished Kiln",
    desc: "Master Huo tended this gentle palace kiln for half his life. Who would not envy it?",
    detail: "1. A <b>dedicated crafting station</b>; approach it to unlock kiln-only recipes.\n2. Fire Clay Bricks: <b>5 clay → 2 bricks</b>; large firing: <b>50 clay → 20 bricks</b>.\n3. Fire A Pot of Mountains and Seas: <b>2 or 20 pots</b> per firing.\n4. Also fires <b>Lotus, Pear Blossom, Snow-White Three-Piece Gaiwan, and White Rush Conical Cup</b>.\n5. <b>Batch firing saves materials and time</b>.\nMaster Huo tended this gentle palace kiln for half his life. Who would not envy it?"
  },
  "粘土砖": {
    name: "Clay Brick",
    desc: "Firing it seems to have removed most of the smell.",
    detail: "1. Fired clay bricks — the <b>core material</b> for flowers, tea ware, pots, and more.\n2. Master Huo's Kiln can fire them in batches: <b>5 clay → 2 bricks, 50 clay → 20 bricks</b> (saving materials and time).\nFiring it seems to have removed most of the smell."
  },
  "素雪三才盏": {
    name: "Snow-White Three-Piece Gaiwan",
    desc: "Snow-White Three-Piece Gaiwan",
    detail: "1. <b>Tea ware</b>; can be collected or placed in display containers.\n2. <b>Can only be crafted at Master Huo's Kiln</b>.\n3. Has skins: <b>Vermilion Square Gaiwan, Celadon Dew Pitcher, Jade Lotus Gaiwan, Silver-Scale Moon Cup</b>."
  },
  "白箬斗笠杯": {
    name: "White Rush Conical Cup",
    desc: "White Rush Conical Cup",
    detail: "1. <b>Tea ware</b>; can be collected or placed in display containers.\n2. <b>Can only be crafted at Master Huo's Kiln</b>.\n3. Has skins: <b>Vermilion Open Cup, Icy Lotus Cup, Green Lotus Tasting Cup, Pale-Celadon Round Pitcher</b>."
  },
  "一壶盛世间山海": {
    name: "A Pot of Mountains and Seas",
    desc: "A single vessel holds the rise and fall of every season.",
    detail: "1. Use Pack on buildings or items in the world to <b>store them in the pot and carry them with you</b>.\n2. Place the pot to unpack items; the pot becomes empty again.\n3. The pot is not randomly colored: after packing, the pot takes the shape of a tea cup — the packed item appears as a tea cup.\n4. Put a filled pot into a display cabinet, and the packed item is <b>shown inside the cabinet</b>.\n5. Can also be fired in batches at Master Huo's Kiln (<b>2 or 20 pots</b>, saving materials and time).\nA single vessel holds the rise and fall of every season."
  },
  "王母娘娘的照容仙镜": {
    name: "Queen Mother's Celestial Mirror",
    desc: "A celestial dressing mirror that can reveal and reshape worldly forms.",
    detail: "1. Activate the mirror to <b>scan objects within range</b>.\n2. Select a target to create a <b>Mirror Image</b> that can be carried or placed on display.\n3. A Mirror Image is only a reflection — no real function — and its <b>size, height, facing, rotation, and animation speed</b> can all be adjusted.\n4. It can also <b>reflect the appearance of characters and creatures</b>.\n5. A Mirror Image can be <b>reskinned, flipped, reset, or undone</b>.\n6. <b>A Mirror Image cannot be copied again</b>.\nA celestial dressing mirror that can reveal and reshape worldly forms."
  },
  "红墙": {
    name: "Red Wall",
    desc: "A sturdy red stone wall.",
    detail: "1. A sturdy red stone wall that blocks the path.\n2. Like the vanilla stone wall, it shows <b>damage stages</b> as its durability drops.\n3. <b>2 Cut Stone → 6 walls</b> (Alchemy Engine).\nA red stone wall."
  },
  "芍药": {
    name: "Peony",
    desc: "Arrange freshly cut peonies in a vase.",
    detail: "1. Purely decorative; it <b>does not attract butterflies</b>.\n2. Can be planted on the ground, picked up with right-click, and placed in containers.\n3. More flowers are coming soon — <b>nine in total</b>!"
  },
  "梨花": {
    name: "Pear Blossom",
    desc: "Pure as snow and pale as carved jade.",
    detail: "1. A decorative pear blossom; can be planted on the ground or picked up and carried.\n2. <b>Can only be crafted at Master Huo's Kiln</b>.\n3. Can be placed in <b>display containers</b> like the Flower Display Table and Flower Rack.\nPure as snow and pale as carved jade."
  },
  "荷花": {
    name: "Lotus",
    desc: "Lotus leaves and blossoms share the summer light.",
    detail: "1. A decorative lotus; can be planted on the ground or picked up and carried.\n2. <b>Can only be crafted at Master Huo's Kiln</b>.\n3. Can be placed in <b>display containers</b> like the Flower Display Table and Flower Rack.\nLotus leaves and blossoms share the summer light."
  },
  "树干": {
    name: "Driftwood",
    desc: "For decoration.",
    detail: "1. Decorative driftwood trunks, <b>5 variants</b>.\n2. Can be placed in <b>decoration slots</b> such as snowmen and aquariums.\nDriftwood? More like sunk wood!"
  },
  "石头堆": {
    name: "Rock Pile",
    desc: "For decoration.",
    detail: "1. Decorative rock piles, <b>3 variants</b>.\n2. Can be placed in <b>decoration slots</b> such as snowmen and aquariums.\nA few scattered stones."
  },
  "玻璃石头": {
    name: "Moonglass Rock",
    desc: "For decoration.",
    detail: "1. Decorative moonglass rocks, <b>3 variants</b>.\n2. Can be placed in <b>decoration slots</b> such as snowmen and aquariums.\nIt sparkles."
  },
  "鱼骨头": {
    name: "Fish Bones",
    desc: "For decoration.",
    detail: "1. Decorative fish bones, <b>3 variants</b>.\n2. Can be placed in <b>decoration slots</b> such as snowmen and aquariums.\nIs that a fish skeleton?"
  }
};

const EN_UPDATES = {
  "2026-08-28": {
    title: "Celestial Mirror & English Language",
    changes: [
      "Added the Queen Mother's Celestial Mirror",
      "Added English language support"
    ]
  },
  "2026-07-20": {
    title: "Queen Mother Settings & Bug Fixes",
    changes: [
      "Fixed some bugs",
      "Added settings for the Queen Mother's hairpin"
    ]
  },
  "2026-07-14": {
    title: "Tea Cups Now Fired in the Kiln",
    changes: [
      "Fixed some bugs",
      "Decorative tea cups must now be fired in the kiln"
    ]
  },
  "2026-07-12": {
    title: "Crafting Filter, Flower Rack & Kiln",
    changes: [
      "Added the Start Building Home crafting filter — no more hunting for recipes",
      "Added a new upgradeable display rack",
      "Added a new kiln building",
      "Added new craftables: clay and clay bricks",
      "Added two new flower/plant decorations",
      "The packing pot is now crafted at the kiln",
      "Packing pots can now stack",
      "Packing pots can no longer pack materials — only items that cannot fit in the inventory"
    ]
  },
  "2026-06-24-1": {
    title: "Bug Fix",
    changes: [
      "Fixed some bugs"
    ]
  },
  "2026-06-24-2": {
    title: "Tea Cup Names & Descriptions",
    changes: [
      "Updated the names and descriptions of decorative tea cups"
    ]
  },
  "2026-06-24-3": {
    title: "Tea Cup Decor & Size Reduction",
    changes: [
      "Cleaned up legacy files to reduce the mod's size",
      "Added a set of tea cup decorations to make up for the cabinet's inability to display cups"
    ]
  },
  "2026-06-23": {
    title: "Bug Fixes & Skin Name Fix",
    changes: [
      "Fixed decorations not showing their recipes",
      "Fixed a packing pot bug",
      "Fixed garbled flower rack skin names"
    ]
  },
  "2026-06-22": {
    title: "Aquarium Decor, Packing Pot & Display Improvements",
    changes: [
      "Added 14 aquarium decorations",
      "Added a very cheap one-time packing pot",
      "Improved the display logic of cabinets, tables, and flower tables so they can show items inside packing pots",
      "Improved the aquarium fish rendering logic"
    ]
  },
  "2026-03-31": {
    title: "Minor Bug Fix",
    changes: [
      "Fixed a few small bugs"
    ]
  },
  "2026-03-21": {
    title: "Aquarium Decor Limit Adjust",
    changes: [
      "Adjusted the aquarium decoration limit",
      "Too many decorations may put some load on the server"
    ]
  },
  "2026-03-16-1": {
    title: "Cabinet Build Animation",
    changes: [
      "Optimized the cabinet creation animation"
    ]
  },
  "2026-03-16-2": {
    title: "Heirloom Texture Polish",
    changes: [
      "Optimized the heirloom textures"
    ]
  },
  "2026-03-14-1": {
    title: "Heirloom Rotation",
    changes: [
      "The heirloom can now be rotated by hitting it"
    ]
  },
  "2026-03-14-2": {
    title: "Aquarium, Wiki Entry & Preservation Config",
    changes: [
      "Added an aquarium — keep fish and decorate it",
      "Added a mod wiki link below the self-inspect screen",
      "Added a config for the solid wood table to freely choose food preservation"
    ]
  },
  "2026-01-29": {
    title: "Bug Fix",
    changes: [
      "Fixed bugs"
    ]
  },
  "2026-01-26": {
    title: "Kunlun Jade Hairpin",
    changes: [
      "Added the functional item: Queen Mother's Kunlun Jade Hairpin"
    ]
  },
  "2026-01-04": {
    title: "Table Crash Fix",
    changes: [
      "Fixed the crash when hitting the table"
    ]
  },
  "2025-12-31": {
    title: "Bug Fix",
    changes: [
      "Fixed some bugs"
    ]
  },
  "2025-11-15": {
    title: "Old Carpenter's Heirloom",
    changes: [
      "Added new items: Old Carpenter's Heirloom x2"
    ]
  },
  "2025-10-29": {
    title: "UI Stutter Fix",
    changes: [
      "Fixed the UI stutter when closing containers"
    ]
  },
  "2025-10-26": {
    title: "Peony Position",
    changes: [
      "Adjusted the peony position"
    ]
  },
  "2025-10-25": {
    title: "New Cover",
    changes: [
      "Updated the mod cover image"
    ]
  },
  "2025-10-24": {
    title: "Workshop Launch",
    changes: [
      "First published on the Steam Workshop"
    ]
  }
};

function isEn() { return state.lang === "en"; }
function uiText(key) { return UI_TEXT[state.lang][key]; }
function enCat(c) { return isEn() && EN_CATS[c] ? EN_CATS[c] : c; }
function enStation(label) { return isEn() && EN_STATIONS[label] ? EN_STATIONS[label] : label; }
function enMat(label) { return isEn() && EN_MATS[label] ? EN_MATS[label] : label; }
function enItem(item) { return isEn() && EN_ITEMS[item.id] ? EN_ITEMS[item.id] : null; }
function enUpdate(u) { return isEn() && EN_UPDATES[u.id] ? EN_UPDATES[u.id] : null; }
function enMainline(name) { return isEn() && EN_MAINLINES[name] ? EN_MAINLINES[name].name : name; }
function enMainlineObj(m) { return isEn() && EN_MAINLINES[m.name] ? EN_MAINLINES[m.name] : null; }

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
    stripHtml(item.detail),
    JSON.stringify(item.recipe || {}),
    item.notes
  ];
  const en = EN_ITEMS[item.id];
  if (en) parts.push(en.name, en.desc, stripHtml(en.detail));
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

const DETAIL_BOLD_RE = /(<\/?b>)/g;

function stripHtml(str) {
  return String(str ?? "").replace(/<[^>]+>/g, "");
}

function highlightDetail(text, q) {
  const raw = String(text ?? "");
  return raw
    .split(DETAIL_BOLD_RE)
    .map(seg => (seg === "<b>" || seg === "</b>" ? seg : highlight(seg, q)))
    .join("");
}

function autoBold(text) {
  const parts = String(text ?? "").split(/(<\/?b>)/);
  let inBold = false;
  return parts.map(seg => {
    if (seg === "<b>") { inBold = true; return seg; }
    if (seg === "</b>") { inBold = false; return seg; }
    if (inBold) return seg;
    return seg
      .replace(/(\d+(?:\.\d+)?\s*(?:格|个|种|块|只|级|件|条|张|天|层|slot|slots|level|levels|piece|pieces|block|blocks|day|days))/gi, "<b>$1</b>")
      .replace(/([+\-]?\s?\d+(?:\.\d+)?\s*%)/g, "<b>$1</b>")
      .replace(/([\u4e00-\u9fa5]{1,4}×\d+)/g, "<b>$1</b>")
      .replace(/(永久保鲜|保鲜|可以堆叠|无上限|无限格|专属|批量|制作权限|管理员|只能在火师傅宝窑制作|无法再次复制|镜中幻形|打包|皮肤|升级|旋转|镜像翻转|还原|撤销|装饰位|装饰品跟雪人通用)/g, "<b>$1</b>");
  }).join("");
}

function setHashFromState() {
  const params = new URLSearchParams();
  if (state.view === "list") params.set("view", "list");
  if (state.mainline) params.set("main", state.mainline);
  if (state.activeCats.length) params.set("cat", state.activeCats.join(","));
  if (state.query) params.set("q", state.query);
  const hash = params.toString();
  location.hash = hash ? `#${hash}` : "";
}

function loadStateFromHash() {
  const hash = (location.hash || "").replace(/^#/, "");
  const params = new URLSearchParams(hash);
  state.view = params.get("view") === "list" ? "list" : "home";
  state.mainline = params.get("main") || "";
  state.activeCats = (params.get("cat") || "").split(",").filter(Boolean);
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

function renderHome() {
  const home = $("#home");
  if (!home) return;
  const intro = state.data.intro || {};
  const mains = state.data.mainlines || [];
  const enHome = isEn() ? EN_HOME : null;
  home.innerHTML = `
    <article class="homeIntro card">
      <h2 class="homeTitle">${escapeHtml(intro.title || uiText("title"))}</h2>
      ${intro.lead ? `<div class="homeLead">${escapeHtml((enHome && enHome.lead) || intro.lead)}</div>` : ""}
    </article>
    <div class="homeSec">${escapeHtml(uiText("homeSecCats"))}</div>
    <div class="homeCats">
      ${mains.map(m => {
        const en = enMainlineObj(m);
        return `
          <div class="homeCat card" data-main="${escapeHtml(m.name)}">
            <h3>${escapeHtml(enMainline(m.name))}</h3>
            ${(en && en.tagline) || m.tagline ? `<div class="tagline">${escapeHtml((en && en.tagline) || m.tagline)}</div>` : ""}
            <div class="desc">${escapeHtml((en && en.desc) || m.desc || "")}</div>
          </div>
        `;
      }).join("")}
    </div>
    <article class="homeIntro card homeThanks">
      <h3 class="homeSecTitle">${escapeHtml(uiText("homeSecThanks"))}</h3>
      ${intro.credits ? `<div class="homeCredits">${escapeHtml((enHome && enHome.credits) || intro.credits)}</div>` : ""}
      ${intro.links ? `<div class="homeLinks">${escapeHtml((enHome && enHome.links) || intro.links)}</div>` : ""}
    </article>
    <button class="homeAllBtn" id="homeAllBtn">${escapeHtml(uiText("viewAll"))}</button>
  `;
}

function enterList(main) {
  state.view = "list";
  state.mainline = main || "";
  setHashFromState();
  render();
}

function renderMainlines() {
  const bar = $("#mainlineBar");
  if (!bar) return;
  const mains = state.data.mainlines || [];
  bar.innerHTML = "";

  const all = document.createElement("div");
  all.className = "chip chip-main" + (state.mainline ? "" : " active");
  all.textContent = enCat("全部");
  all.addEventListener("click", () => {
    state.mainline = "";
    setHashFromState();
    render();
  });
  bar.appendChild(all);

  mains.forEach(m => {
    const el = document.createElement("div");
    el.className = "chip chip-main" + (state.mainline === m.name ? " active" : "");
    el.textContent = enMainline(m.name);
    el.addEventListener("click", () => {
      state.mainline = m.name;
      setHashFromState();
      render();
    });
    bar.appendChild(el);
  });
}

function setViewUI() {
  const home = state.view === "home";
  $("#home").hidden = !home;
  $("#list").hidden = home;
  $("#searchBox").hidden = home;
  $("#catRow").hidden = home;
  $("#mainlineRow").hidden = home;
  $("#barRow").hidden = home;
  $("#clearBtn").hidden = home;
  $("#resetBtn").hidden = home;
  $("#homeBtn").hidden = home;
}

function renderCats() {
  const cats = state.data.categories || ["全部"];
  const bar = $("#catBar");
  bar.innerHTML = "";

  const counts = {};
  (state.data.items || []).forEach(it => {
    getCats(it).forEach(c => { counts[c] = (counts[c] || 0) + 1; });
  });

  cats.forEach(cat => {
    const el = document.createElement("div");
    const isAll = cat === "全部";
    const active = isAll ? state.activeCats.length === 0 : state.activeCats.includes(cat);
    el.className = "chip" + (active ? " active" : "");

    const count = cat === "更新日记"
      ? (state.data.updates || []).length
      : (counts[cat] || 0);
    el.textContent = count ? `${enCat(cat)} ${count}` : enCat(cat);

    el.addEventListener("click", () => {
      if (isAll) {
        state.activeCats = [];
      } else if (cat === "更新日记") {
        state.activeCats = [cat];
      } else {
        state.activeCats = state.activeCats.filter(c => c !== "更新日记");
        const i = state.activeCats.indexOf(cat);
        if (i >= 0) state.activeCats.splice(i, 1);
        else state.activeCats.push(cat);
      }
      setHashFromState();
      render();
    });

    bar.appendChild(el);
  });
}

function activeCatLabel() {
  if (!state.activeCats.length) return enCat("全部");
  return state.activeCats.map(enCat).join(" + ");
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

  const themeBtn = $("#themeBtn");
  if (themeBtn) themeBtn.title = uiText("themeBtn");

  const homeBtn = $("#homeBtn");
  if (homeBtn) {
    homeBtn.textContent = uiText("backHome");
    homeBtn.title = uiText("backHome");
  }

  const catBar = $("#catBar");
  if (catBar) catBar.setAttribute("aria-label", uiText("catAria"));
}

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  const btn = $("#themeBtn");
  if (btn) btn.textContent = state.theme === "dark" ? "☀️" : "🌙";
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
  if (state.mainline && item.mainline !== state.mainline) return false;
  const cs = getCats(item);
  const catOk = state.activeCats.length === 0 || cs.some(c => state.activeCats.includes(c));
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

function matchUpdate(u) {
  const en = enUpdate(u);
  const title = (en && en.title) || u.title || "";
  const changes = (en && en.changes) || u.changes || [];
  const q = normalize(state.query);
  if (!q) return true;
  return normalize([u.date, title, ...changes].join(" ")).includes(q);
}

function renderDiary() {
  const updates = (state.data.updates || []).filter(matchUpdate);
  const list = $("#list");
  const q = state.query;

  if (!list) throw new Error("找不到容器 #list（请确认 index.html 中有 <section id='list'>）");
  list.classList.add("diary-mode");

  if (!updates.length) {
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
            ${changes.map(c => `<li>${highlight(c, q)}</li>`).join("")}
          </ul>
        </article>
      `;
    }).join("");
  }

  $("#resultHint").textContent = uiText("diaryResult")(updates.length, (state.data.updates || []).length);
  $("#activeState").textContent = uiText("activeState")(activeCatLabel(), state.query);

  const input = $("#searchInput");
  if (input && input.value !== state.query) input.value = state.query;
}

function renderList() {
  if (state.activeCats.includes("更新日记")) {
    renderDiary();
    return;
  }

  const items = (state.data.items || []).filter(matchItem);
  const list = $("#list");
  const q = state.query;

  if (!list) throw new Error("找不到容器 #list（请确认 index.html 中有 <section id='list'>）");
  list.classList.remove("diary-mode");

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
          <div class="v">${highlightDetail(autoBold(introLines.join("\n")), q)}</div>
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
  $("#activeState").textContent = uiText("activeState")(activeCatLabel(), state.query);

  const input = $("#searchInput");
  if (input && input.value !== state.query) input.value = state.query;
}


function render() {
  renderHome();
  renderMainlines();
  renderCats();
  renderList();
  setViewUI();
}

async function init() {
  try {
    if (localStorage.getItem("starthome_lang") === "en") state.lang = "en";
    const savedTheme = localStorage.getItem("starthome_theme");
    state.theme = (savedTheme === "dark" || savedTheme === "light")
      ? savedTheme
      : (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  } catch (e) {}

  loadStateFromHash();
  state.data = await loadData();


  const set = new Set();
  (state.data.items || []).forEach(it => {
    getCats(it).forEach(c => set.add(c));
  });
  const cats = Array.from(set);

  applyLang();
  applyTheme();
  renderHeader();
  render();

  $("#home")?.addEventListener("click", (e) => {
    const allBtn = e.target.closest("#homeAllBtn");
    if (allBtn) {
      enterList("");
      return;
    }
    const catEl = e.target.closest(".homeCat");
    if (catEl && catEl.dataset.main) enterList(catEl.dataset.main);
  });

  $("#homeBtn")?.addEventListener("click", () => {
    state.view = "home";
    state.mainline = "";
    setHashFromState();
    render();
  });


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
    state.activeCats = [];
    setHashFromState();
    render();
  });

  $("#themeBtn")?.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("starthome_theme", state.theme); } catch (e) {}
    applyTheme();
  });

  $("#langBtn")?.addEventListener("click", () => {
    state.lang = state.lang === "zh" ? "en" : "zh";
    try { localStorage.setItem("starthome_lang", state.lang); } catch (e) {}
    applyLang();
    render();
  });

  window.addEventListener("hashchange", () => {
    const before = [state.view, state.mainline, state.activeCats.join(","), state.query].join("|");
    loadStateFromHash();
    const after = [state.view, state.mainline, state.activeCats.join(","), state.query].join("|");
    if (before !== after) render();
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
