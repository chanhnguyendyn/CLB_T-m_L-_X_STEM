const HomePageApp = (() => {
  const config = {
    titleText: "Chạm vào khoa học – Thấu hiểu chính mình",
    buttonText: "Khám phá trạm trải nghiệm",
    buttonDelayMs: 650,
    nextPageUrl: "station.html",
    // Để trống "" nếu chưa có ảnh nền riêng -> sẽ tự dùng nền gradient bầu trời mặc định
    // Khi có ảnh nền, điền ví dụ: "assets/decor/bg-home.jpg"
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

  function resetTransitionState() {
    const btnEl = document.getElementById("exploreBtn");
    if (btnEl) {
      btnEl.disabled = false;
    }
    WebEffects.resetCloudsToOrigin();
  }

  function bindEvents() {
    const btnEl = document.getElementById("exploreBtn");
    if (!btnEl) return;
    btnEl.addEventListener("click", () => {
      btnEl.disabled = true;
      WebEffects.playCloudTransition(() => {
        window.location.href = config.nextPageUrl;
      }, 920, 920);
    });

    window.addEventListener("pageshow", () => {
      resetButtonState();
    });
  }

  function init() {
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

function resetButtonState() {
    const btnEl = document.getElementById("exploreBtn");
    const overlay = document.getElementById("cloudTransition");
    if (btnEl) {
      btnEl.disabled = false;
    }
    if (overlay) {
      overlay.classList.remove("is-running", "is-active");
    }
  }

  const StationPageApp = (() => {
  const stationConfig = {
    backgroundUrl: "", // Điền đường dẫn ảnh nền nếu có, để trống sẽ dùng nền gradient mặc định
    station1Url: "tram-1.html",
    station2Url: "tram-2.html",
    station1DelayMs: 400,
    station2DelayMs: 550
  };

  function resetStationState() {
    const btn1 = document.getElementById("station1Btn");
    const btn2 = document.getElementById("station2Btn");
    if (btn1) btn1.disabled = false;
    if (btn2) btn2.disabled = false;
    if (typeof WebEffects !== "undefined" && WebEffects.resetCloudsToOrigin) {
      WebEffects.resetCloudsToOrigin();
    }
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
      }, 920, 920);
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

    window.addEventListener("pageshow", resetStationState);
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", StationPageApp.init);

const StationDetailApp = (() => {
  const STORAGE_KEY = "visited_stations_v1";

  const detailConfig = {
    // Dán link CSV (File -> Share -> Publish to web -> chọn Sheet -> Comma-separated values (.csv))
    sheetCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQSLGZ0HNO25v40lkQn2Y2WC1yDicz0OEjLOaRODdy0j0V6hAYrxBC_EfsxJEKEUv4-wpLRNb_1MRgw/pub?gid=0&single=true&output=csv",
    fallbackContent: {
      tram1: "Nội dung Trạm 1 lấy từ Google Sheets sẽ hiển thị tại đây. Kích cỡ hình chữ nhật tự động giãn theo độ dài chữ.",
      tram2: "Nội dung Trạm 2 lấy từ Google Sheets sẽ hiển thị tại đây. Kích cỡ hình chữ nhật tự động giãn theo độ dài chữ."
    },
    buttonDelayMs: 450
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
      } catch (err) {
        // Bỏ qua nếu trình duyệt chặn storage
      }
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

  function parseCsvLine(line) {
    const result = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  }

  function loadSheetContent(stationId) {
    const textEl = document.getElementById("sheetContentText");
    if (!textEl) return;

    const fallbackText = detailConfig.fallbackContent[stationId] || "";
    textEl.textContent = fallbackText;

    if (!detailConfig.sheetCsvUrl || detailConfig.sheetCsvUrl.trim() === "") {
      return;
    }

    fetch(detailConfig.sheetCsvUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Không tải được Google Sheets");
        return res.text();
      })
      .then((csvText) => {
        const lines = csvText.split(/\r?\n/).filter((l) => l.trim() !== "");
        if (lines.length < 2) return;

        const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
        const stationIdx = headers.indexOf("station");
        const contentIdx = headers.indexOf("content");

        if (stationIdx === -1 || contentIdx === -1) return;

        for (let i = 1; i < lines.length; i += 1) {
          const cols = parseCsvLine(lines[i]);
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
      }, 920, 920);
    } else {
      window.location.href = targetUrl;
    }
  }

  function resetDetailButtons() {
    const btns = document.querySelectorAll(".complete-btn, .arrow-nav");
    btns.forEach((b) => {
      b.disabled = false;
    });
    if (typeof WebEffects !== "undefined" && WebEffects.resetCloudsToOrigin) {
      WebEffects.resetCloudsToOrigin();
    }
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

    if (typeof WebEffects !== "undefined" && WebEffects.revealElementAfterDelay) {
      WebEffects.revealElementAfterDelay(completeBtn, detailConfig.buttonDelayMs);
      WebEffects.revealElementAfterDelay(nextBtn, detailConfig.buttonDelayMs + 120);
      WebEffects.revealElementAfterDelay(prevBtn, detailConfig.buttonDelayMs + 120);
    }

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

    window.addEventListener("pageshow", resetDetailButtons);
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", StationDetailApp.init);