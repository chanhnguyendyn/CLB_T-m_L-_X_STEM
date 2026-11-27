const HomePageApp = (() => {
  const config = {
    titleText: "Chạm vào khoa học – Thấu hiểu chính mình",
    buttonText: "Khám phá trạm trải nghiệm",
    buttonDelayMs: 650,
    nextPageUrl: "station.html",
    backgroundUrl: "",
    decorItems: []
  };

  function setBackgroundImage(url) {
    const stage = document.getElementById("homeStage");
    if (!stage) return;
    if (url && url.trim() !== "") {
      stage.style.setProperty("--bg-image", `url("${url}")`);
    }
  }

  function renderDecorItems(items) {
    const layer = document.getElementById("decorLayer");
    if (!layer || !Array.isArray(items)) return;

    layer.innerHTML = "";
    items.forEach((item) => {
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.alt || "";
      img.className = "decor-item";

      if (item.x) img.style.setProperty("--x", item.x);
      if (item.y) img.style.setProperty("--y", item.y);
      if (item.w) img.style.setProperty("--w", item.w);
      if (item.h) img.style.setProperty("--h", item.h);
      if (item.rot) img.style.setProperty("--rot", item.rot);
      if (item.scale) img.style.setProperty("--scale", item.scale);

      layer.appendChild(img);
    });
  }

  function applyContent() {
    const titleEl = document.querySelector(".curved-title-text textPath");
    const svgEl = document.querySelector(".curved-title");
    const btnEl = document.getElementById("exploreBtn");

    if (titleEl && config.titleText) {
      titleEl.textContent = config.titleText;
    }
    if (svgEl && config.titleText) {
      svgEl.setAttribute("aria-label", config.titleText);
    }
    if (btnEl && config.buttonText) {
      btnEl.textContent = config.buttonText;
    }
  }

  function resetHomeButton() {
    const btnEl = document.getElementById("exploreBtn");
    if (btnEl) {
      btnEl.disabled = false;
    }
  }

  function bindEvents() {
    const btnEl = document.getElementById("exploreBtn");
    if (!btnEl) return;
    btnEl.addEventListener("click", () => {
      btnEl.disabled = true;
      WebEffects.playCloudTransition(() => {
        window.location.href = config.nextPageUrl;
      }, 960, 80);
    });

    window.addEventListener("pageshow", (event) => {
      resetHomeButton();
      if (event.persisted && typeof WebEffects !== "undefined" && WebEffects.resetCloudsToOrigin) {
        WebEffects.resetCloudsToOrigin();
      }
    });
  }

  function init() {
    const stage = document.getElementById("homeStage");
    if (!stage) return;

    setBackgroundImage(config.backgroundUrl);
    renderDecorItems(config.decorItems);
    applyContent();
    bindEvents();

    const btnEl = document.getElementById("exploreBtn");
    WebEffects.revealElementAfterDelay(btnEl, config.buttonDelayMs);
  }

  return {
    init,
    setBackgroundImage,
    renderDecorItems
  };
})();

document.addEventListener("DOMContentLoaded", HomePageApp.init);

const StationPageApp = (() => {
  const stationConfig = {
    backgroundUrl: "",
    station1Url: "tram-1.html",
    station2Url: "tram-2.html",
    station1DelayMs: 400,
    station2DelayMs: 550
  };

  function resetStationButtons() {
    const btn1 = document.getElementById("station1Btn");
    const btn2 = document.getElementById("station2Btn");
    if (btn1) btn1.disabled = false;
    if (btn2) btn2.disabled = false;
  }

  function bindStationButton(btnEl, targetUrl) {
    if (!btnEl) return;
    btnEl.addEventListener("click", () => {
      const btn1 = document.getElementById("station1Btn");
      const btn2 = document.getElementById("station2Btn");
      if (btn1) btn1.disabled = true;
      if (btn2) btn2.disabled = true;

      WebEffects.playCloudTransition(() => {
        window.location.href = targetUrl;
      }, 960, 80);
    });
  }

  function init() {
    const stage = document.getElementById("stationStage");
    if (!stage) return;

    if (stationConfig.backgroundUrl && stationConfig.backgroundUrl.trim() !== "") {
      stage.style.setProperty("--bg-image", `url("${stationConfig.backgroundUrl}")`);
    }

    const btn1 = document.getElementById("station1Btn");
    const btn2 = document.getElementById("station2Btn");

    bindStationButton(btn1, stationConfig.station1Url);
    bindStationButton(btn2, stationConfig.station2Url);

    WebEffects.revealElementAfterDelay(btn1, stationConfig.station1DelayMs);
    WebEffects.revealElementAfterDelay(btn2, stationConfig.station2DelayMs);

    window.addEventListener("pageshow", (event) => {
      resetStationButtons();
      if (event.persisted && typeof WebEffects !== "undefined" && WebEffects.resetCloudsToOrigin) {
        WebEffects.resetCloudsToOrigin();
      }
    });
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", StationPageApp.init);

const StationDetailApp = (() => {
  const STORAGE_KEY = "visited_stations_v1";

  const detailConfig = {
    sheetCsvUrl:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQSLGZ0HNO25v40lkQn2Y2WC1yDicz0OEjLOaRODdy0j0V6hAYrxBC_EfsxJEKEUv4-wpLRNb_1MRgw/pub?gid=0&single=true&output=csv",
    fallbackContent: {
      tram1: "Nội dung Trạm 1 lấy từ Google Sheets sẽ hiển thị tại đây. Kích cỡ hình chữ nhật tự động giãn theo độ dài chữ.",
      tram2: "Nội dung Trạm 2 lấy từ Google Sheets sẽ hiển thị tại đây. Kích cỡ hình chữ nhật tự động giãn theo độ dài chữ."
    }
  };

  function getVisitedStations() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function markStationVisited(stationId) {
    if (!stationId) return;
    const current = getVisitedStations();
    if (!current.includes(stationId)) {
      current.push(stationId);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      } catch (err) {}
    }
  }

  function createTickBadgeElement() {
    const badge = document.createElement("div");
    badge.className = "tick-badge";
    badge.innerHTML = `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M14 34L27 47L51 19" stroke="#FFFFFF" stroke-width="8.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `;
    return badge;
  }

  function openResultModal() {
    const modal = document.getElementById("resultModal");
    const tickRow = document.getElementById("tickRow");
    if (!modal || !tickRow) return;

    const visited = getVisitedStations();
    const count = visited.length >= 2 ? 2 : 1;

    tickRow.innerHTML = "";
    for (let i = 0; i < count; i += 1) {
      tickRow.appendChild(createTickBadgeElement());
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeResultModal() {
    const modal = document.getElementById("resultModal");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  }

  function parseCsvAll(csvText) {
    const cleanText = String(csvText || "")
      .replace(/^\uFEFF/, "")
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n");
    const rows = [];
    let row = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < cleanText.length; i += 1) {
      const ch = cleanText[i];
      const next = cleanText[i + 1];

      if (ch === '"') {
        if (inQuotes && next === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        row.push(current.trim());
        current = "";
      } else if (ch === "\n" && !inQuotes) {
        row.push(current.trim());
        if (row.some((cell) => cell !== "")) {
          rows.push(row);
        }
        row = [];
        current = "";
      } else {
        current += ch;
      }
    }

    if (current.length > 0 || row.length > 0) {
      row.push(current.trim());
      if (row.some((cell) => cell !== "")) {
        rows.push(row);
      }
    }

    return rows;
  }

  function loadSheetContent(stationId) {
    const textEl = document.getElementById("sheetContentText");
    if (!textEl) return;

    const fallbackText = detailConfig.fallbackContent[stationId] || "";
    textEl.textContent = fallbackText;

    if (!detailConfig.sheetCsvUrl || detailConfig.sheetCsvUrl.trim() === "") {
      return;
    }

    const sep = detailConfig.sheetCsvUrl.includes("?") ? "&" : "?";
    const fetchUrl = `${detailConfig.sheetCsvUrl}${sep}_t=${Date.now()}`;

    fetch(fetchUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Không tải được Google Sheets");
        return res.arrayBuffer();
      })
      .then((buffer) => {
        const csvText = new TextDecoder("utf-8").decode(buffer);
        const rows = parseCsvAll(csvText);
        if (rows.length < 2) return;

        const headers = rows[0].map((h) => h.toLowerCase());
        const stationIdx = headers.indexOf("station");
        const contentIdx = headers.indexOf("content");

        if (stationIdx === -1 || contentIdx === -1) return;

        for (let i = 1; i < rows.length; i += 1) {
          const cols = rows[i];
          if ((cols[stationIdx] || "").toLowerCase() === stationId.toLowerCase()) {
            const matchedText = cols[contentIdx] || "";
            if (matchedText.trim() !== "") {
              textEl.textContent = matchedText;
            }
            break;
          }
        }
      })
      .catch(() => {
        textEl.textContent = fallbackText;
      });
  }

  function navigateWithClouds(targetUrl) {
    if (!targetUrl) return;
    if (typeof WebEffects !== "undefined" && WebEffects.playCloudTransition) {
      WebEffects.playCloudTransition(() => {
        window.location.href = targetUrl;
      }, 960, 80);
    } else {
      window.location.href = targetUrl;
    }
  }

  function resetDetailButtons() {
    document.querySelectorAll(".complete-btn, .arrow-nav").forEach((b) => {
      b.disabled = false;
    });
  }

  function init() {
    const stationId = document.body ? document.body.dataset.station : "";
    if (!stationId || (stationId !== "tram1" && stationId !== "tram2")) {
      return;
    }

    markStationVisited(stationId);
    loadSheetContent(stationId);

    const completeBtn = document.getElementById("completeGameBtn");
    const nextBtn = document.getElementById("nextStationBtn");
    const prevBtn = document.getElementById("prevStationBtn");
    const closeBtn = document.getElementById("closeResultBtn");
    const backdrop = document.getElementById("resultModalBackdrop");

    // Hiển thị cố định 2 nút dưới ngay từ đầu (không hiệu ứng nhảy trễ)
    [completeBtn, nextBtn, prevBtn].forEach((btn) => {
      if (btn) {
        btn.classList.remove("is-hidden");
        btn.classList.add("is-visible");
      }
    });

    if (completeBtn) {
      completeBtn.addEventListener("click", openResultModal);
    }
    if (closeBtn) {
      closeBtn.addEventListener("click", closeResultModal);
    }
    if (backdrop) {
      backdrop.addEventListener("click", closeResultModal);
    }

    const navBtn = nextBtn || prevBtn;
    if (navBtn) {
      navBtn.addEventListener("click", () => {
        const targetUrl = navBtn.getAttribute("data-target");
        document.querySelectorAll(".complete-btn, .arrow-nav").forEach((b) => {
          b.disabled = true;
        });
        navigateWithClouds(targetUrl);
      });
    }

    window.addEventListener("pageshow", (event) => {
      resetDetailButtons();
      if (event.persisted && typeof WebEffects !== "undefined" && WebEffects.resetCloudsToOrigin) {
        WebEffects.resetCloudsToOrigin();
      }
    });
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", StationDetailApp.init);