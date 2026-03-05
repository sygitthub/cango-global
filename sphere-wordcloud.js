(function() {
  // 词云数据（可替换为自有词汇）
  const WORDS = [
    { text: "环境与气候变化",    value: 68, tier: 1 },
    { text: "教育与能力建设",    value: 63, tier: 1 },
    { text: "社区发展与减贫",    value: 58, tier: 1 },
    { text: "可持续发展目标",    value: 51, tier: 1 },
    { text: "人权与社会正义",    value: 47, tier: 1 },
    { text: "健康与公共卫生",    value: 44, tier: 1 },
    { text: "发展合作与援助",    value: 41, tier: 1 },
    { text: "灾害风险与人道援助", value: 38, tier: 1 },
    { text: "性别平等与多样性",  value: 35, tier: 1 },
    { text: "食品安全与农业",    value: 33, tier: 1 },
    { text: "国际交流与合作",    value: 30, tier: 1 },
    { text: "公民社会与治理",    value: 28, tier: 1 },
    { text: "气候正义",          value: 55, tier: 2 },
    { text: "妇女赋权",          value: 49, tier: 2 },
    { text: "SDG推进",           value: 45, tier: 2 },
    { text: "社会包容",          value: 40, tier: 2 },
    { text: "生态保护",          value: 37, tier: 2 },
    { text: "儿童权利",          value: 34, tier: 2 },
    { text: "移民与难民",        value: 31, tier: 2 },
    { text: "水资源",            value: 25, tier: 2 },
    { text: "公平贸易",          value: 22, tier: 2 },
    { text: "能源转型",          value: 36, tier: 2 },
    { text: "粮食主权",          value: 27, tier: 2 },
    { text: "数字技术与创新",    value: 43, tier: 3 },
    { text: "青年发展",          value: 38, tier: 3 },
    { text: "城市化",            value: 32, tier: 3 },
    { text: "民主参与",          value: 29, tier: 3 },
    { text: "企业社会责任",      value: 26, tier: 3 },
    { text: "医疗可及性",        value: 24, tier: 3 },
    { text: "碳中和",            value: 30, tier: 1 },
  ];

  const COLORS = { 1: "#38BDF8", 2: "#2DD4BF", 3: "#A78BFA" };
  const TIER_NAME = { 1: "I类关注", 2: "II类关注", 3: "延伸议题" };
  const RADIUS = 250;
  const FOV    = 480;
  const SPEED  = 0.28;
  const TOP_N  = 5;

  let maxWords  = 28;
  let rx = 0.3, ry = 0;
  let paused    = false;
  let dragging  = false;
  let dragX0, dragY0, dragRx0, dragRy0;
  let hoveredWord = null;
  let lastTime  = null;

  function fibSphere(n) {
    const pts = [], phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = phi * i;
      pts.push([r * Math.cos(t), y, r * Math.sin(t)]);
    }
    return pts;
  }

  function rotate([x, y, z], rx, ry) {
    const x1 = x * Math.cos(ry) + z * Math.sin(ry);
    const z1 = -x * Math.sin(ry) + z * Math.cos(ry);
    const y2 = y * Math.cos(rx) - z1 * Math.sin(rx);
    const z2 = y * Math.sin(rx) + z1 * Math.cos(rx);
    return [x1, y2, z2];
  }

  const root = document.getElementById("sphere-wordcloud-root");
  if (!root) return;
  root.innerHTML = "";
  root.style.cssText = "width:100%;max-width:100%;font-family:'Noto Sans SC','PingFang SC','Microsoft YaHei',sans-serif;background:#080F1E;border-radius:16px;padding:28px 24px 32px;box-sizing:border-box;color:#F1F5F9;user-select:none;border:1px solid rgba(30,41,59,0.8);";

  const mainRow = document.createElement("div");
  mainRow.style.cssText = "display:flex;gap:24px;align-items:flex-start;width:100%;";
  root.appendChild(mainRow);

  const leftCol = document.createElement("div");
  leftCol.style.cssText = "flex:1;min-width:0;";
  mainRow.appendChild(leftCol);

  const titleWrap = document.createElement("div");
  titleWrap.style.cssText = "text-align:center;margin-bottom:18px;";
  titleWrap.innerHTML = `
    <h2 style="margin:0;font-size:22px;font-weight:900;background:linear-gradient(135deg,#38BDF8,#2DD4BF,#A78BFA);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">议题关注词云</h2>
    <div style="font-size:12px;color:#475569;margin-top:4px;">球面旋转 · 近大远小 · 悬停暂停 · 拖拽转动</div>
  `;
  leftCol.appendChild(titleWrap);

  const sliderWrap = document.createElement("div");
  sliderWrap.style.cssText = "display:flex;align-items:center;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:18px;background:rgba(255,255,255,0.03);border:1px solid #1E293B;border-radius:10px;padding:10px 18px;";
  sliderWrap.innerHTML = `
    <span style="font-size:12px;color:#64748B;white-space:nowrap;">最大词数</span>
    <input id="swc-slider" type="range" min="8" max="${WORDS.length}" value="${maxWords}"
      style="width:140px;accent-color:#38BDF8;cursor:pointer;">
    <span id="swc-slider-val" style="font-size:16px;font-weight:800;color:#38BDF8;min-width:24px;text-align:center;">${maxWords}</span>
    <div style="display:flex;gap:10px;margin-left:4px;">
      ${[1,2,3].map(t=>`<div style="display:flex;align-items:center;gap:4px;"><div style="width:7px;height:7px;border-radius:2px;background:${COLORS[t]};"></div><span style="font-size:10px;color:#475569;">${t===1?"I类关注":t===2?"II类关注":TIER_NAME[t]}</span></div>`).join("")}
    </div>
  `;
  leftCol.appendChild(sliderWrap);

  const svgWrap = document.createElement("div");
  svgWrap.style.cssText = "position:relative;margin:0 auto;cursor:grab;";
  leftCol.appendChild(svgWrap);

  const NS = "http://www.w3.org/2000/svg";
  let W = Math.min((leftCol && leftCol.offsetWidth ? leftCol.offsetWidth : root.offsetWidth) - 40, 920);
  let H = Math.round(W * 0.65);
  const svg = document.createElementNS(NS, "svg");
  svg.style.cssText = "display:block;overflow:visible;touch-action:none;";
  svgWrap.appendChild(svg);

  const tip = document.createElement("div");
  tip.style.cssText = "position:absolute;display:none;pointer-events:none;background:rgba(8,15,30,0.97);border-radius:10px;padding:10px 14px;z-index:20;min-width:150px;box-shadow:0 4px 20px rgba(0,0,0,0.5);";
  svgWrap.appendChild(tip);

  const pauseTag = document.createElement("div");
  pauseTag.textContent = "⏸ 已暂停";
  pauseTag.style.cssText = "position:absolute;top:10px;right:10px;display:none;background:rgba(56,189,248,0.1);border:1px solid rgba(56,189,248,0.25);border-radius:6px;padding:3px 9px;font-size:10px;color:rgba(56,189,248,0.7);pointer-events:none;";
  svgWrap.appendChild(pauseTag);

  const rightCol = document.createElement("div");
  rightCol.style.cssText = "flex-shrink:0;width:160px;";
  mainRow.appendChild(rightCol);

  const cardsSection = document.createElement("div");
  cardsSection.style.cssText = "display:flex;flex-direction:column;gap:0;";
  cardsSection.innerHTML = `<div style="font-size:11px;color:#475569;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;font-weight:600;">热度 Top ${TOP_N} 议题</div>`;
  const cardsRow = document.createElement("div");
  cardsRow.style.cssText = "display:flex;flex-direction:column;gap:10px;";
  cardsSection.appendChild(cardsRow);
  rightCol.appendChild(cardsSection);

  const topWords = [...WORDS].sort((a,b) => b.value - a.value).slice(0, TOP_N);
  topWords.forEach((w, i) => {
    const col = COLORS[w.tier];
    const pct = Math.round((w.value / topWords[0].value) * 100);
    const card = document.createElement("div");
    card.style.cssText = `background:rgba(255,255,255,0.03);border:1px solid #1E293B;border-radius:12px;padding:12px 14px;width:100%;position:relative;overflow:hidden;box-sizing:border-box;transition:all 0.2s;cursor:default;`;
    card.innerHTML = `
      <div style="position:absolute;top:8px;right:10px;font-size:10px;font-weight:800;color:${col};opacity:0.5;">#${i+1}</div>
      <div style="font-size:26px;font-weight:900;color:${col};line-height:1;margin-bottom:4px;">${w.value}</div>
      <div style="font-size:11px;font-weight:600;color:#CBD5E1;margin-bottom:10px;line-height:1.4;min-height:30px;">${w.text}</div>
      <div style="height:3px;background:#1E293B;border-radius:2px;">
        <div class="swc-bar" style="height:100%;border-radius:2px;background:linear-gradient(90deg,${col}99,${col});width:${pct*0.88}%;transition:width 0.35s;"></div>
      </div>
      <div style="margin-top:7px;font-size:9px;color:${col};opacity:0.6;font-weight:600;">${TIER_NAME[w.tier]}</div>
    `;
    card.addEventListener("mouseenter", () => {
      card.style.background = `${col}14`;
      card.style.border = `1px solid ${col}`;
      card.style.boxShadow = `0 4px 20px ${col}33`;
      card.querySelector(".swc-bar").style.width = pct + "%";
    });
    card.addEventListener("mouseleave", () => {
      card.style.background = "rgba(255,255,255,0.03)";
      card.style.border = "1px solid #1E293B";
      card.style.boxShadow = "none";
      card.querySelector(".swc-bar").style.width = (pct*0.88) + "%";
    });
    cardsRow.appendChild(card);
  });

  function getWords() {
    return [...WORDS].sort((a,b) => b.value - a.value).slice(0, maxWords);
  }

  function render() {
    const colW = (leftCol && leftCol.offsetWidth) ? leftCol.offsetWidth : (root.offsetWidth - 200);
    W = Math.min(colW - 40, 920);
    H = Math.round(W * 0.65);
    const r = Math.min(RADIUS, W * 0.30);

    svg.setAttribute("width", W);
    svg.setAttribute("height", H);
    svgWrap.style.width = W + "px";
    svgWrap.style.height = H + "px";

    const words = getWords();
    const pts   = fibSphere(words.length);
    const vMin  = Math.min(...words.map(w => w.value));
    const vMax  = Math.max(...words.map(w => w.value));
    const fMin  = 10, fMax = Math.min(28, W * 0.042);

    const projected = words.map((word, i) => {
      const [x3, y3, z3] = rotate(pts[i], rx, ry);
      const scale   = FOV / (FOV + z3 * r);
      const px      = W / 2 + x3 * r * scale;
      const py      = H / 2 + y3 * r * scale;
      const depth   = (z3 + 1) / 2;
      const norm    = (word.value - vMin) / (vMax - vMin || 1);
      const fontSize = (fMin + norm * (fMax - fMin)) * scale * 1.1;
      const opacity = 0.12 + depth * 0.88;
      return { ...word, px, py, z3, depth, fontSize, opacity, scale, color: COLORS[word.tier] };
    }).sort((a, b) => a.z3 - b.z3);

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const eq = document.createElementNS(NS, "ellipse");
    eq.setAttribute("cx", W/2); eq.setAttribute("cy", H/2);
    eq.setAttribute("rx", r * 0.98); eq.setAttribute("ry", r * 0.11);
    eq.setAttribute("fill", "none");
    eq.setAttribute("stroke", "rgba(56,189,248,0.05)");
    eq.setAttribute("stroke-width", "1");
    svg.appendChild(eq);

    projected.forEach(w => {
      const isHov = hoveredWord === w.text;
      const g = document.createElementNS(NS, "g");

      if (isHov) {
        const tw = w.text.length * w.fontSize * 0.57;
        const th = w.fontSize * 1.35;
        const rect = document.createElementNS(NS, "rect");
        rect.setAttribute("x", w.px - tw/2 - 6);
        rect.setAttribute("y", w.py - th/2 - 3);
        rect.setAttribute("width", tw + 12);
        rect.setAttribute("height", th + 6);
        rect.setAttribute("rx", 5);
        rect.setAttribute("fill", w.color + "18");
        rect.setAttribute("stroke", w.color);
        rect.setAttribute("stroke-width", "0.8");
        rect.setAttribute("opacity", w.opacity);
        g.appendChild(rect);
      }

      const t = document.createElementNS(NS, "text");
      t.textContent = w.text;
      t.setAttribute("x", w.px);
      t.setAttribute("y", w.py);
      t.setAttribute("text-anchor", "middle");
      t.setAttribute("dominant-baseline", "middle");
      t.setAttribute("font-size", isHov ? w.fontSize * 1.1 : w.fontSize);
      t.setAttribute("font-weight", w.value > 50 ? 800 : w.value > 35 ? 700 : 500);
      t.setAttribute("fill", w.color);
      t.setAttribute("opacity", isHov ? 1 : w.opacity);
      t.style.cssText = `cursor:pointer;pointer-events:all;${isHov ? `filter:drop-shadow(0 0 6px ${w.color}cc);` : ""}`;

      t.addEventListener("mouseenter", (e) => {
        hoveredWord = w.text;
        const maxV = Math.max(...words.map(x => x.value));
        tip.style.display = "block";
        tip.style.borderColor = w.color;
        tip.style.boxShadow = `0 4px 20px ${w.color}44`;
        tip.innerHTML = `
          <div style="font-size:14px;font-weight:800;color:${w.color};margin-bottom:5px;">${w.text}</div>
          <div style="display:flex;gap:16px;">
            <div><div style="font-size:10px;color:#475569;">关注热度</div><div style="font-size:22px;font-weight:900;color:#F1F5F9;">${w.value}</div></div>
            <div><div style="font-size:10px;color:#475569;">议题层级</div><div style="font-size:12px;font-weight:700;color:${w.color};">${TIER_NAME[w.tier]}</div></div>
          </div>
          <div style="margin-top:8px;height:3px;border-radius:2px;background:#1E293B;">
            <div style="height:100%;border-radius:2px;background:linear-gradient(90deg,${w.color}88,${w.color});width:${Math.round((w.value/maxV)*100)}%;"></div>
          </div>
          <div style="font-size:10px;color:#475569;margin-top:3px;">热度指数 ${Math.round((w.value/maxV)*100)}%</div>
        `;
        const tipW = 160;
        tip.style.left = Math.min(w.px + 14, W - tipW - 4) + "px";
        tip.style.top  = Math.max(w.py - 70, 4) + "px";
      });

      t.addEventListener("mouseleave", () => {
        hoveredWord = null;
        tip.style.display = "none";
      });

      g.appendChild(t);
      svg.appendChild(g);
    });
  }

  function loop(ts) {
    if (lastTime === null) lastTime = ts;
    const dt = (ts - lastTime) / 1000;
    lastTime = ts;
    if (!paused && !dragging) {
      ry += dt * SPEED;
      rx += dt * SPEED * 0.25;
    }
    render();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  svgWrap.addEventListener("mouseenter", () => { paused = true;  pauseTag.style.display = "block"; });
  svgWrap.addEventListener("mouseleave", () => { paused = false; pauseTag.style.display = "none"; hoveredWord = null; tip.style.display = "none"; });

  svgWrap.addEventListener("mousedown", (e) => {
    dragging = true; svgWrap.style.cursor = "grabbing";
    dragX0 = e.clientX; dragY0 = e.clientY;
    dragRx0 = rx; dragRy0 = ry;
  });
  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    ry = dragRy0 + (e.clientX - dragX0) * 0.008;
    rx = dragRx0 + (e.clientY - dragY0) * 0.008;
  });
  window.addEventListener("mouseup", () => { dragging = false; svgWrap.style.cursor = "grab"; });

  let tStart = null;
  svgWrap.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    tStart = { x: t.clientX, y: t.clientY, rx, ry };
  }, { passive: true });
  svgWrap.addEventListener("touchmove", (e) => {
    if (!tStart) return;
    e.preventDefault();
    const t = e.touches[0];
    ry = tStart.ry + (t.clientX - tStart.x) * 0.008;
    rx = tStart.rx + (t.clientY - tStart.y) * 0.008;
  }, { passive: false });
  svgWrap.addEventListener("touchend", () => { tStart = null; });

  document.getElementById("swc-slider").addEventListener("input", function() {
    maxWords = parseInt(this.value);
    document.getElementById("swc-slider-val").textContent = maxWords;
  });

  window.addEventListener("resize", render);
})();
