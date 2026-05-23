(function () {
  const state = { orgs: [], filtered: [], activeOrgId: null, showAllResults: false };
  const filterIds = [
    "orgDiscoverySearch",
    "orgDiscoveryRegion",
    "orgDiscoverySubRegion",
    "orgDiscoveryCountry",
    "orgDiscoveryTopic",
  ];
  const continentOrder = ["欧洲", "亚洲", "北美", "南美/拉美", "非洲", "大洋洲"];
  const asiaSubRegionOrder = ["东亚", "东南亚", "南亚", "中亚", "中东", "亚洲其他"];

  function textValue(value) {
    return (value || "").toString().trim();
  }

  function compactText(value) {
    return textValue(value).replace(/\s+/g, " ").trim();
  }

  function normalizeForSearch(value) {
    return compactText(value).toLowerCase();
  }

  function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value == null ? "" : value.toString();
    return div.innerHTML;
  }

  function uniqueSorted(values) {
    return Array.from(new Set(values.map(compactText).filter(Boolean))).sort((a, b) =>
      a.localeCompare(b, "zh-CN", { sensitivity: "base" })
    );
  }

  function setSelectOptions(id, values, allLabel) {
    const select = document.getElementById(id);
    if (!select) return;
    select.innerHTML =
      `<option value="all">${escapeHtml(allLabel)}</option>` +
      values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("");
  }

  function orgContinent(org) {
    return compactText(org.continentStd || org.regionStd);
  }

  function isMeaningfulText(value) {
    const text = compactText(value);
    return Boolean(text && text.toLowerCase() !== "nan" && text !== "无");
  }

  function hasChinaSignal(org) {
    return isMeaningfulText(org.chinaConnection);
  }

  function statusLabel(status) {
    if (status === "Active") return "正常运营";
    if (status === "Warning") return "需核查";
    return "待补充";
  }

  function updateSubRegionVisibility() {
    const regionSelect = document.getElementById("orgDiscoveryRegion");
    const subRegionWrap = document.getElementById("orgDiscoverySubRegionWrap");
    const subRegionSelect = document.getElementById("orgDiscoverySubRegion");
    if (!regionSelect || !subRegionWrap || !subRegionSelect) return;
    if (regionSelect.value === "亚洲") {
      subRegionWrap.classList.remove("hidden");
    } else {
      subRegionWrap.classList.add("hidden");
      subRegionSelect.value = "all";
    }
  }

  function discoveryOrgBlob(org) {
    return normalizeForSearch(
      [
        org.title,
        org.alias,
        org.nameCn,
        org.regionStd,
        org.continentStd,
        org.subRegionStd,
        org.country,
        org.city,
        org.natureStd,
        org.functionStd,
        org.secondaryFunction,
        ...(Array.isArray(org.topics) ? org.topics : []),
        org.body,
        org.workRegions,
        org.extraWorkRegions,
        org.networks,
        org.orgNotes,
        org.chinaConnection,
        org.cooperationStatus,
        org.cooperationNotes,
      ].join(" ")
    );
  }

  function getFilters() {
    const getSelect = (id) => document.getElementById(id)?.value || "all";
    const getSearch = (id) => document.getElementById(id)?.value || "";
    const region = getSelect("orgDiscoveryRegion");
    return {
      keyword: normalizeForSearch(getSearch("orgDiscoverySearch").trim()),
      region,
      subRegion: region === "亚洲" ? getSelect("orgDiscoverySubRegion") : "all",
      country: getSelect("orgDiscoveryCountry"),
      topic: getSelect("orgDiscoveryTopic"),
    };
  }

  function hasActiveFilters(filters) {
    return Boolean(
      filters.keyword ||
        filters.region !== "all" ||
        filters.country !== "all" ||
        filters.topic !== "all" ||
        (filters.region === "亚洲" && filters.subRegion !== "all")
    );
  }

  function matchesFilters(org, filters) {
    if (filters.keyword && !discoveryOrgBlob(org).includes(filters.keyword)) return false;
    if (filters.region !== "all" && orgContinent(org) !== filters.region) return false;
    if (filters.subRegion !== "all" && org.subRegionStd !== filters.subRegion) return false;
    if (filters.country !== "all" && org.country !== filters.country) return false;
    if (filters.topic !== "all" && !(org.topics || []).includes(filters.topic)) return false;
    return true;
  }

  function shortenText(value, max = 180) {
    const text = compactText(value);
    return text.length > max ? text.slice(0, max).trim() + "..." : text;
  }

  function fieldValue(value, fallback = "暂无") {
    return isMeaningfulText(value) ? escapeHtml(compactText(value)) : fallback;
  }

  function renderInfoItem(label, value) {
    return `
      <div class="rounded-2xl border border-slate-800 bg-slate-950/45 px-3 py-3">
        <p class="text-[11px] text-slate-500">${escapeHtml(label)}</p>
        <p class="mt-1 text-[13px] leading-relaxed text-slate-200 whitespace-pre-line">${fieldValue(value)}</p>
      </div>
    `;
  }

  function renderDetailSection(title, value) {
    if (!isMeaningfulText(value)) return "";
    return `
      <section class="rounded-2xl border border-slate-800 bg-slate-950/35 px-4 py-3">
        <h4 class="text-[12px] font-semibold text-slate-100">${escapeHtml(title)}</h4>
        <p class="mt-2 text-[13px] leading-relaxed text-slate-300 whitespace-pre-line">${escapeHtml(compactText(value))}</p>
      </section>
    `;
  }

  function renderTopicTags(topics) {
    const values = Array.isArray(topics) ? topics.filter(isMeaningfulText) : [];
    if (!values.length) return "";
    return `
      <section class="rounded-2xl border border-slate-800 bg-slate-950/35 px-4 py-3">
        <h4 class="text-[12px] font-semibold text-slate-100">议题标签</h4>
        <div class="mt-2 flex flex-wrap gap-2">
          ${values
            .map(
              (topic) =>
                `<span class="inline-flex items-center rounded-full bg-brand-500/10 border border-brand-400/25 px-2.5 py-1 text-[11px] text-brand-100">${escapeHtml(topic)}</span>`
            )
            .join("")}
        </div>
      </section>
    `;
  }

  function websiteHref(value) {
    const url = compactText(value);
    if (!url || url === "未检索到独立官网") return "";
    if (/^https?:\/\//i.test(url)) return url;
    if (/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(url)) return `https://${url}`;
    return "";
  }

  function renderWebsite(org) {
    const href = websiteHref(org.website);
    if (!href) return renderInfoItem("官网链接", org.website);
    return `
      <div class="rounded-2xl border border-slate-800 bg-slate-950/45 px-3 py-3">
        <p class="text-[11px] text-slate-500">官网链接</p>
        <a class="mt-1 inline-flex max-w-full items-center text-[13px] text-brand-200 hover:text-brand-100 underline decoration-brand-400/40 underline-offset-4 break-all" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(compactText(org.website))}</a>
      </div>
    `;
  }

  function ensureDetailPanel() {
    if (document.getElementById("orgDiscoveryDetailPanel")) return;
    document.body.insertAdjacentHTML(
      "beforeend",
      `
        <div id="orgDiscoveryDetailPanel" class="hidden fixed inset-0 z-[80]" aria-hidden="true">
          <div id="orgDiscoveryDetailBackdrop" class="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"></div>
          <aside class="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col border-l border-slate-800 bg-slate-950 shadow-2xl">
            <header class="flex items-start justify-between gap-4 border-b border-slate-800 px-5 py-4">
              <div class="min-w-0">
                <p class="text-[11px] tracking-[0.24em] uppercase text-brand-300 font-semibold">Organization Detail</p>
                <h3 id="orgDiscoveryDetailTitle" class="mt-1 text-lg font-semibold leading-snug text-slate-50"></h3>
                <p id="orgDiscoveryDetailSubtitle" class="mt-1 text-[12px] leading-relaxed text-slate-400"></p>
              </div>
              <button id="orgDiscoveryDetailCloseTop" type="button" class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-200 hover:border-brand-400/60 hover:text-white" aria-label="关闭详情">×</button>
            </header>
            <div id="orgDiscoveryDetailBody" class="flex-1 overflow-y-auto px-5 py-5"></div>
            <footer class="border-t border-slate-800 px-5 py-4">
              <button id="orgDiscoveryDetailCloseBottom" type="button" class="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-100 hover:border-brand-400/60">关闭</button>
            </footer>
          </aside>
        </div>
      `
    );
    document.getElementById("orgDiscoveryDetailBackdrop")?.addEventListener("click", closeDetailPanel);
    document.getElementById("orgDiscoveryDetailCloseTop")?.addEventListener("click", closeDetailPanel);
    document.getElementById("orgDiscoveryDetailCloseBottom")?.addEventListener("click", closeDetailPanel);
  }

  function renderContactDetails(org) {
    return `
      <details class="rounded-2xl border border-slate-800 bg-slate-950/35 px-4 py-3">
        <summary class="cursor-pointer text-[12px] font-semibold text-slate-100">联系方式</summary>
        <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          ${renderInfoItem("联系人", org.contactName)}
          ${renderInfoItem("职位", org.contactTitle)}
          ${renderInfoItem("邮箱", org.email)}
          ${renderInfoItem("电话", org.phone)}
        </div>
      </details>
    `;
  }

  function openDetailPanel(orgId) {
    ensureDetailPanel();
    const org = state.orgs.find((item) => String(item._discoveryId) === String(orgId));
    if (!org) return;
    state.activeOrgId = org._discoveryId;
    const panel = document.getElementById("orgDiscoveryDetailPanel");
    const titleEl = document.getElementById("orgDiscoveryDetailTitle");
    const subtitleEl = document.getElementById("orgDiscoveryDetailSubtitle");
    const bodyEl = document.getElementById("orgDiscoveryDetailBody");
    const location = [orgContinent(org), org.subRegionStd, org.country, org.city].filter(isMeaningfulText).join(" / ");
    const subtitle = [org.nameCn, org.alias, location].filter(isMeaningfulText).join(" · ");
    if (titleEl) titleEl.textContent = org.title || "机构名称待补充";
    if (subtitleEl) subtitleEl.textContent = subtitle || "基础信息待补充";
    if (bodyEl) {
      bodyEl.innerHTML = `
        <div class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${renderInfoItem("性质", org.natureStd)}
            ${renderInfoItem("职能", org.functionStd)}
            ${renderInfoItem("成立年份", org.foundedYear || org.subtitle)}
            ${renderInfoItem("存续状态", statusLabel(org.statusStd))}
            ${renderWebsite(org)}
            ${renderInfoItem("是否有分支机构", org.hasBranches ? "是" : "否")}
          </div>
          ${renderDetailSection("基本信息", org.body)}
          ${renderDetailSection("业务与开展区域", [org.workRegions, org.extraWorkRegions].filter(isMeaningfulText).join("\\n"))}
          ${renderTopicTags(org.topics)}
          ${renderDetailSection("网络 / 联盟 / 备注", [org.networks, org.orgNotes].filter(isMeaningfulText).join("\\n\\n"))}
          ${renderDetailSection("中国相关互动", org.chinaConnection)}
          ${renderDetailSection("合作状态与合作说明", [org.cooperationStatus, org.cooperationNotes].filter(isMeaningfulText).join("\\n"))}
          ${renderContactDetails(org)}
          ${renderDetailSection("运营状态说明", org.statusNote || org.warningReason)}
        </div>
      `;
    }
    panel?.classList.remove("hidden");
    panel?.setAttribute("aria-hidden", "false");
    document.body.classList.add("overflow-hidden");
    document.getElementById("orgDiscoveryDetailCloseTop")?.focus();
  }

  function closeDetailPanel() {
    const panel = document.getElementById("orgDiscoveryDetailPanel");
    if (!panel) return;
    panel.classList.add("hidden");
    panel.setAttribute("aria-hidden", "true");
    document.body.classList.remove("overflow-hidden");
    state.activeOrgId = null;
  }

  function renderActiveFilters(filters) {
    const container = document.getElementById("orgDiscoveryActiveFilters");
    if (!container) return;

    if (!hasActiveFilters(filters)) {
      const activeClass = state.showAllResults
        ? "border-brand-300 bg-brand-500/25 text-white shadow-[0_0_0_1px_rgba(96,165,250,0.25)]"
        : "border-brand-400/50 bg-brand-500/15 text-brand-100";
      container.innerHTML = `
        <button
          type="button"
          data-org-discovery-toggle-all
          class="inline-flex items-center rounded-full border px-3 py-1.5 text-[12px] font-medium hover:border-brand-300 hover:bg-brand-500/25 transition-colors ${activeClass}"
          aria-pressed="${state.showAllResults ? "true" : "false"}"
        >
          全部机构 (${state.orgs.length})
        </button>
      `;
      return;
    }

    const chips = [];
    const searchText = document.getElementById("orgDiscoverySearch")?.value.trim() || "";
    if (filters.keyword) chips.push(`关键词：${searchText}`);
    if (filters.region !== "all") chips.push(`大洲：${filters.region}`);
    if (filters.region === "亚洲" && filters.subRegion !== "all") chips.push(`亚洲子区域：${filters.subRegion}`);
    if (filters.country !== "all") chips.push(`国家：${filters.country}`);
    if (filters.topic !== "all") chips.push(`议题：${filters.topic}`);
    container.innerHTML = chips
      .map(
        (chip) =>
          `<span class="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/70 px-2.5 py-1 text-[11px] text-slate-300">${escapeHtml(chip)}</span>`
      )
      .join("");
  }

  function updateResetButtonVisibility(filters) {
    const resetBtn = document.getElementById("orgDiscoveryReset");
    if (!resetBtn) return;
    resetBtn.classList.toggle("hidden", !hasActiveFilters(filters));
  }

  function containsCjk(value) {
    return /[\u3400-\u9fff]/.test(compactText(value));
  }

  function containsLatin(value) {
    return /[A-Za-z]/.test(compactText(value));
  }

  function normalizeNameText(value) {
    return compactText(value).replace(/[（]/g, "(").replace(/[）]/g, ")");
  }

  function stripTrailingParenthetical(value) {
    return normalizeNameText(value).replace(/\s*\([^)]{1,40}\)\s*$/g, "").trim();
  }

  function isSameName(a, b) {
    return normalizeNameText(a).toLowerCase() === normalizeNameText(b).toLowerCase();
  }

  function isShortAlias(value) {
    const text = stripTrailingParenthetical(value);
    if (!text || containsCjk(text)) return false;
    if (/^[A-Z0-9&./ -]{2,18}$/.test(text)) return true;
    return text.split(/\s+/).length <= 3 && text.length <= 28 && /^[A-Za-z0-9&./ -]+$/.test(text);
  }

  function extractAbbr(value) {
    const text = normalizeNameText(value);
    if (!text) return "";
    const parenMatches = Array.from(text.matchAll(/\(([^)]{2,40})\)/g));
    for (const match of parenMatches) {
      const candidate = compactText(match[1]).replace(/^原\s+/i, "").trim();
      if (isShortAlias(candidate)) return candidate;
    }
    return isShortAlias(text) ? stripTrailingParenthetical(text) : "";
  }

  function cleanChineseName(value) {
    const text = compactText(value);
    if (!text) return "";
    return text
      .replace(/[（(]\s*(?:现|原)?\s*[A-Z0-9&./ -]{2,28}\s*[）)]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function cleanPrimaryName(value) {
    const text = normalizeNameText(value);
    if (!text) return "";
    const withoutTrailingNote = stripTrailingParenthetical(text);
    if (containsLatin(withoutTrailingNote) && !containsCjk(withoutTrailingNote)) return withoutTrailingNote;
    const latinParts = text
      .split(/[·|｜/／;；,，、]+/)
      .map(stripTrailingParenthetical)
      .filter((part) => containsLatin(part) && !containsCjk(part));
    return latinParts[0] || withoutTrailingNote || text;
  }

  function normalizeOrgNameParts(org) {
    const title = normalizeNameText(org.title);
    const alias = normalizeNameText(org.alias);
    const nameCn = cleanChineseName(org.nameCn);
    const primaryName =
      cleanPrimaryName(title) ||
      (containsLatin(alias) ? cleanPrimaryName(alias) : "") ||
      nameCn ||
      alias ||
      "机构名称待补充";

    const aliasAbbr = extractAbbr(alias);
    const titleAbbr = extractAbbr(title);
    const nameCnAbbr = extractAbbr(org.nameCn);
    const aliasText = alias && !isSameName(alias, primaryName) ? stripTrailingParenthetical(alias) : "";
    const secondaryAlias = aliasAbbr || nameCnAbbr || titleAbbr || (isShortAlias(aliasText) ? aliasText : "");
    const secondaryParts = [];

    if (nameCn && !isSameName(nameCn, primaryName)) secondaryParts.push(nameCn);
    if (secondaryAlias && !secondaryParts.some((part) => isSameName(part, secondaryAlias)) && !isSameName(secondaryAlias, primaryName)) {
      secondaryParts.push(secondaryAlias);
    }

    return {
      primaryName,
      secondaryName: secondaryParts.join(" · "),
    };
  }

  function cleanGeoChinese(value) {
    return compactText(value)
      .replace(/[（(]\s*[A-Za-z][A-Za-z\s&.,'’/-]*\s*[）)]/g, "")
      .replace(/[A-Za-z][A-Za-z\s&.,'’/-]*/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizeCityName(value) {
    const text = textValue(value);
    if (!text) return "";
    return text
      .split(/\n+/)
      .map((item) =>
        item
          .trim()
          .replace(/（\s*/g, " (")
          .replace(/\s*）/g, ")")
          .replace(/\(\s+/g, "(")
          .replace(/\s+\)/g, ")")
          .replace(/\s*\(\s*([^()]*?)\s*\)\s*\(\s*\1\s*\)/g, " ($1)")
          .replace(/\s+/g, " ")
          .trim()
      )
      .filter(Boolean)
      .join(" / ");
  }

  function renderLocation(org) {
    return [
      cleanGeoChinese(orgContinent(org)),
      cleanGeoChinese(org.subRegionStd),
      cleanGeoChinese(org.country),
      normalizeCityName(org.city),
    ]
      .filter(isMeaningfulText)
      .join(" / ");
  }

  function cleanAttributeTag(value) {
    return compactText(value)
      .replace(/[\uFF08(]\s*[A-Za-z][^\uFF09)]*[\uFF09)]/g, "")
      .replace(/\s*\/\s*/g, " / ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function renderAttributeTags(org) {
    const nature = cleanAttributeTag(org.natureStd);
    const functionType = cleanAttributeTag(org.functionStd);
    const tags = [];

    if (nature) {
      tags.push(`<span class="inline-flex items-center rounded-full bg-slate-800/90 border border-slate-700 px-2 py-0.5 text-[10px] text-slate-200">${escapeHtml(nature)}</span>`);
    }
    if (functionType) {
      tags.push(`<span class="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-400/20 px-2 py-0.5 text-[10px] text-emerald-100">${escapeHtml(functionType)}</span>`);
    }

    return tags.length ? `<div class="flex flex-wrap gap-2">${tags.join("")}</div>` : "";
  }

  function renderTopicChips(org) {
    const topics = (org.topics || [])
      .filter(isMeaningfulText)
      .slice(0, 3)
      .map(
        (topic) =>
          `<span class="inline-flex items-center rounded-full bg-brand-500/10 border border-brand-400/25 px-2 py-0.5 text-[10px] text-brand-100">${escapeHtml(topic)}</span>`
      )
      .join("");

    return topics ? `<div class="flex flex-wrap gap-2">${topics}</div>` : "";
  }

  function renderResults() {
    const filters = getFilters();
    const hasFilters = hasActiveFilters(filters);
    const filtered = state.orgs.filter((org) => matchesFilters(org, filters));
    const shouldShowList = hasFilters || state.showAllResults;
    state.filtered = filtered;
    const countEl = document.getElementById("orgDiscoveryCount");
    const totalEl = document.getElementById("orgDiscoveryTotal");
    const resultsEl = document.getElementById("orgDiscoveryResults");
    const emptyEl = document.getElementById("orgDiscoveryEmpty");
    if (countEl) countEl.textContent = filtered.length;
    if (totalEl) totalEl.textContent = state.orgs.length;
    renderActiveFilters(filters);
    updateResetButtonVisibility(filters);
    if (!resultsEl || !emptyEl) return;
    if (!shouldShowList) {
      resultsEl.innerHTML = "";
      resultsEl.classList.add("hidden");
      emptyEl.classList.add("hidden");
      return;
    }
    resultsEl.classList.remove("hidden");
    if (!filtered.length) {
      resultsEl.innerHTML = "";
      emptyEl.classList.remove("hidden");
      return;
    }
    emptyEl.classList.add("hidden");
    resultsEl.innerHTML = filtered
      .map((org) => {
        const { primaryName, secondaryName } = normalizeOrgNameParts(org);
        const location = renderLocation(org);
        const statusSymbol = org.statusStd === "Warning" ? "!" : "•";
        const statusClass =
          org.statusStd === "Warning"
            ? "border-rose-400/50 bg-rose-500/15 text-rose-200"
            : "border-emerald-400/40 bg-emerald-500/12 text-emerald-200";
        const attributeTags = renderAttributeTags(org);
        const topicTags = renderTopicChips(org);
        const china = hasChinaSignal(org)
          ? `<p class="mt-3 rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-[11px] leading-relaxed text-cyan-100">中国线索：${escapeHtml(shortenText(org.chinaConnection, 120))}</p>`
          : "";
        return `
          <article class="rounded-2xl border border-slate-800 bg-slate-950/45 px-4 py-4 hover:border-brand-400/50 hover:bg-slate-900/80 transition-colors">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <h3 class="text-base font-semibold text-slate-50 leading-snug">${escapeHtml(primaryName)}</h3>
                ${secondaryName ? `<p class="mt-1 text-xs text-slate-400">${escapeHtml(secondaryName)}</p>` : ""}
                <p class="mt-1 text-[11px] text-slate-500">${escapeHtml(location || "地点待补充")}</p>
              </div>
              <span class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[13px] font-semibold leading-none ${statusClass}" title="${escapeHtml(statusLabel(org.statusStd))}" aria-label="${escapeHtml(statusLabel(org.statusStd))}">${escapeHtml(statusSymbol)}</span>
            </div>
            <div class="mt-3 space-y-2">
              ${attributeTags}
              ${topicTags}
            </div>
            <p class="mt-3 text-[13px] leading-relaxed text-slate-300">${escapeHtml(shortenText(org.body, 180) || "暂无简介。")}</p>
            ${china}
            <div class="mt-4 flex justify-end">
              <button type="button" data-org-detail-id="${escapeHtml(org._discoveryId)}" class="rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs font-medium text-slate-100 hover:border-brand-400/60 hover:text-white transition-colors">查看详情</button>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function resetFilters() {
    filterIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (el.tagName === "SELECT") el.value = "all";
      else el.value = "";
    });
    state.showAllResults = false;
    updateSubRegionVisibility();
    renderResults();
  }

  function handleFilterChange() {
    const filters = getFilters();
    if (hasActiveFilters(filters)) {
      state.showAllResults = true;
    }
    renderResults();
  }

  function init() {
    const root = document.getElementById("orgDiscovery");
    if (!root) return;
    const source =
      (window.CANGO_DATA && Array.isArray(window.CANGO_DATA.orgs) ? window.CANGO_DATA.orgs : []) || [];
    state.orgs = source
      .map((org, index) => ({ ...org, _discoveryId: index }))
      .sort((a, b) => (a.title || "").localeCompare(b.title || "", "zh-CN", { sensitivity: "base" }));

    const availableContinents = new Set(state.orgs.map(orgContinent).filter(Boolean));
    const availableAsiaSubRegions = new Set(
      state.orgs
        .filter((org) => orgContinent(org) === "亚洲")
        .map((org) => compactText(org.subRegionStd))
        .filter(Boolean)
    );
    setSelectOptions("orgDiscoveryRegion", continentOrder.filter((continent) => availableContinents.has(continent)), "全部大洲");
    setSelectOptions("orgDiscoverySubRegion", asiaSubRegionOrder.filter((subRegion) => availableAsiaSubRegions.has(subRegion)), "全部亚洲子区域");
    setSelectOptions("orgDiscoveryCountry", uniqueSorted(state.orgs.map((org) => org.country)), "全部国家");
    setSelectOptions("orgDiscoveryTopic", uniqueSorted(state.orgs.flatMap((org) => org.topics || [])), "全部议题");

    filterIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (id === "orgDiscoveryRegion") {
        el.addEventListener("change", () => {
          updateSubRegionVisibility();
          handleFilterChange();
        });
        return;
      }
      el.addEventListener(el.tagName === "SELECT" ? "change" : "input", handleFilterChange);
    });

    const resetBtn = document.getElementById("orgDiscoveryReset");
    if (resetBtn) resetBtn.addEventListener("click", resetFilters);
    const activeFiltersEl = document.getElementById("orgDiscoveryActiveFilters");
    if (activeFiltersEl) {
      activeFiltersEl.addEventListener("click", (event) => {
        const toggleAllTarget = event.target.closest("[data-org-discovery-toggle-all]");
        if (!toggleAllTarget) return;
        const filters = getFilters();
        if (hasActiveFilters(filters)) return;
        state.showAllResults = !state.showAllResults;
        renderResults();
      });
    }
    const resultsEl = document.getElementById("orgDiscoveryResults");
    if (resultsEl) {
      resultsEl.addEventListener("click", (event) => {
        const button = event.target.closest("[data-org-detail-id]");
        if (!button) return;
        openDetailPanel(button.getAttribute("data-org-detail-id"));
      });
    }
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && state.activeOrgId !== null) closeDetailPanel();
    });
    updateSubRegionVisibility();
    renderResults();
  }

  window.addEventListener("DOMContentLoaded", init);
})();
