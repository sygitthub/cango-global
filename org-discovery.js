(function () {
  const state = { orgs: [], filtered: [] };
  const filterIds = [
    "orgDiscoverySearch",
    "orgDiscoveryRegion",
    "orgDiscoverySubRegion",
    "orgDiscoveryCountry",
    "orgDiscoveryTopic",
    "orgDiscoveryNature",
    "orgDiscoveryFunction",
    "orgDiscoveryStatus",
    "orgDiscoveryChina",
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
    return {
      keyword: normalizeForSearch(getSearch("orgDiscoverySearch")),
      region: getSelect("orgDiscoveryRegion"),
      subRegion: getSelect("orgDiscoverySubRegion"),
      country: getSelect("orgDiscoveryCountry"),
      topic: getSelect("orgDiscoveryTopic"),
      nature: getSelect("orgDiscoveryNature"),
      functionType: getSelect("orgDiscoveryFunction"),
      status: getSelect("orgDiscoveryStatus"),
      china: getSelect("orgDiscoveryChina"),
    };
  }

  function matchesFilters(org, filters) {
    if (filters.keyword && !discoveryOrgBlob(org).includes(filters.keyword)) return false;
    if (filters.region !== "all" && orgContinent(org) !== filters.region) return false;
    if (filters.subRegion !== "all" && org.subRegionStd !== filters.subRegion) return false;
    if (filters.country !== "all" && org.country !== filters.country) return false;
    if (filters.topic !== "all" && !(org.topics || []).includes(filters.topic)) return false;
    if (filters.nature !== "all" && org.natureStd !== filters.nature) return false;
    if (filters.functionType !== "all" && org.functionStd !== filters.functionType) return false;
    if (filters.status !== "all" && org.statusStd !== filters.status) return false;
    if (filters.china === "yes" && !hasChinaSignal(org)) return false;
    if (filters.china === "no" && hasChinaSignal(org)) return false;
    return true;
  }

  function shortenText(value, max = 180) {
    const text = compactText(value);
    return text.length > max ? text.slice(0, max).trim() + "..." : text;
  }

  function renderActiveFilters(filters) {
    const container = document.getElementById("orgDiscoveryActiveFilters");
    if (!container) return;
    const chips = [];
    if (filters.keyword) chips.push(`关键词：${document.getElementById("orgDiscoverySearch").value.trim()}`);
    if (filters.region !== "all") chips.push(`大洲：${filters.region}`);
    if (filters.subRegion !== "all") chips.push(`亚洲子区域：${filters.subRegion}`);
    if (filters.country !== "all") chips.push(`国家：${filters.country}`);
    if (filters.topic !== "all") chips.push(`议题：${filters.topic}`);
    if (filters.nature !== "all") chips.push(`性质：${filters.nature}`);
    if (filters.functionType !== "all") chips.push(`职能：${filters.functionType}`);
    if (filters.status !== "all") chips.push(`状态：${statusLabel(filters.status)}`);
    if (filters.china !== "all") chips.push(filters.china === "yes" ? "有中国线索" : "暂无线索");
    container.innerHTML = chips
      .map(
        (chip) =>
          `<span class="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/70 px-2.5 py-1 text-[11px] text-slate-300">${escapeHtml(chip)}</span>`
      )
      .join("");
  }

  function renderResults() {
    const filters = getFilters();
    const filtered = state.orgs.filter((org) => matchesFilters(org, filters));
    state.filtered = filtered;
    const countEl = document.getElementById("orgDiscoveryCount");
    const totalEl = document.getElementById("orgDiscoveryTotal");
    const resultsEl = document.getElementById("orgDiscoveryResults");
    const emptyEl = document.getElementById("orgDiscoveryEmpty");
    if (countEl) countEl.textContent = filtered.length;
    if (totalEl) totalEl.textContent = state.orgs.length;
    renderActiveFilters(filters);
    if (!resultsEl || !emptyEl) return;
    if (!filtered.length) {
      resultsEl.innerHTML = "";
      emptyEl.classList.remove("hidden");
      return;
    }
    emptyEl.classList.add("hidden");
    resultsEl.innerHTML = filtered
      .map((org) => {
        const nameLine = [org.nameCn, org.alias].filter(isMeaningfulText).join(" · ");
        const location = [orgContinent(org), org.subRegionStd, org.country, org.city]
          .filter(isMeaningfulText)
          .join(" / ");
        const statusSymbol = org.statusStd === "Warning" ? "!" : "•";
        const statusClass =
          org.statusStd === "Warning"
            ? "border-rose-400/50 bg-rose-500/15 text-rose-200"
            : "border-emerald-400/40 bg-emerald-500/12 text-emerald-200";
        const topics = (org.topics || [])
          .slice(0, 3)
          .map(
            (topic) =>
              `<span class="inline-flex items-center rounded-full bg-brand-500/10 border border-brand-400/25 px-2 py-0.5 text-[10px] text-brand-100">${escapeHtml(topic)}</span>`
          )
          .join("");
        const china = hasChinaSignal(org)
          ? `<p class="mt-3 rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-[11px] leading-relaxed text-cyan-100">中国线索：${escapeHtml(shortenText(org.chinaConnection, 120))}</p>`
          : "";
        return `
          <article class="rounded-2xl border border-slate-800 bg-slate-950/45 px-4 py-4 hover:border-brand-400/50 hover:bg-slate-900/80 transition-colors">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <h3 class="text-base font-semibold text-slate-50 leading-snug">${escapeHtml(org.title || "机构名称待补充")}</h3>
                ${nameLine ? `<p class="mt-1 text-[12px] text-slate-400">${escapeHtml(nameLine)}</p>` : ""}
                <p class="mt-1 text-[11px] text-slate-500">${escapeHtml(location || "地点待补充")}</p>
              </div>
              <span class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[13px] font-semibold leading-none ${statusClass}" title="${escapeHtml(statusLabel(org.statusStd))}" aria-label="${escapeHtml(statusLabel(org.statusStd))}">${escapeHtml(statusSymbol)}</span>
            </div>
            <div class="mt-3 flex flex-wrap gap-2">
              ${org.natureStd ? `<span class="inline-flex items-center rounded-full bg-slate-800/90 border border-slate-700 px-2 py-0.5 text-[10px] text-slate-200">${escapeHtml(org.natureStd)}</span>` : ""}
              ${org.functionStd ? `<span class="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-400/20 px-2 py-0.5 text-[10px] text-emerald-100">${escapeHtml(org.functionStd)}</span>` : ""}
              ${topics}
            </div>
            <p class="mt-3 text-[13px] leading-relaxed text-slate-300">${escapeHtml(shortenText(org.body, 180) || "暂无简介。")}</p>
            ${china}
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
    updateSubRegionVisibility();
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
    setSelectOptions("orgDiscoveryNature", uniqueSorted(state.orgs.map((org) => org.natureStd)), "全部性质");
    setSelectOptions("orgDiscoveryFunction", uniqueSorted(state.orgs.map((org) => org.functionStd)), "全部职能");
    setSelectOptions("orgDiscoveryTopic", uniqueSorted(state.orgs.flatMap((org) => org.topics || [])), "全部议题");

    filterIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (id === "orgDiscoveryRegion") {
        el.addEventListener("change", () => {
          updateSubRegionVisibility();
          renderResults();
        });
        return;
      }
      el.addEventListener(el.tagName === "SELECT" ? "change" : "input", renderResults);
    });

    const resetBtn = document.getElementById("orgDiscoveryReset");
    if (resetBtn) resetBtn.addEventListener("click", resetFilters);
    updateSubRegionVisibility();
    renderResults();
  }

  window.addEventListener("DOMContentLoaded", init);
})();
