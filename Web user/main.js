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