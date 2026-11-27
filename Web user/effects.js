const WebEffects = (() => {
  const ARRIVAL_KEY = "cloud_arriving_v1";
  let isTransitioning = false;

  function getCloudContainer() {
    return document.getElementById("cloudTransition");
  }

  function clearCloudStates(container) {
    if (!container) return;
    container.classList.remove("is-closing", "is-covered", "is-opening");
  }

  function playCloudTransition(onCoveredCallback, coverDurationMs = 950, holdMs = 80) {
    if (isTransitioning) return;
    isTransitioning = true;

    const container = getCloudContainer();
    if (!container) {
      if (typeof onCoveredCallback === "function") onCoveredCallback();
      return;
    }

    clearCloudStates(container);
    void container.offsetWidth;
    container.classList.add("is-closing");

    setTimeout(() => {
      try {
        sessionStorage.setItem(ARRIVAL_KEY, "1");
      } catch (e) {}

      if (typeof onCoveredCallback === "function") {
        onCoveredCallback();
      }
    }, coverDurationMs + holdMs);
  }

  function openCloudsOnCurrentPage(delayMs = 80) {
    const container = getCloudContainer();
    if (!container) return;

    // Giữ trạng thái che kín ngay khi vừa sang trang mới
    clearCloudStates(container);
    container.classList.add("is-covered");
    void container.offsetWidth;

    setTimeout(() => {
      container.classList.remove("is-covered");
      void container.offsetWidth;
      container.classList.add("is-opening");
      isTransitioning = false;
    }, delayMs);
  }

  function resetCloudsToOrigin() {
    isTransitioning = false;
    const container = getCloudContainer();
    clearCloudStates(container);
    void container.offsetWidth;
  }

  function revealElementAfterDelay(el, delayMs = 300) {
    if (!el) return;
    el.classList.add("is-hidden");
    el.classList.remove("is-visible");
    setTimeout(() => {
      el.classList.remove("is-hidden");
      el.classList.add("is-visible");
    }, delayMs);
  }

  function initPageArrival() {
    let shouldOpen = false;
    try {
      if (sessionStorage.getItem(ARRIVAL_KEY) === "1") {
        shouldOpen = true;
        sessionStorage.removeItem(ARRIVAL_KEY);
      }
    } catch (e) {}

    if (shouldOpen) {
      openCloudsOnCurrentPage(80);
    } else {
      resetCloudsToOrigin();
    }
  }

  document.addEventListener("DOMContentLoaded", initPageArrival);
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      initPageArrival();
    }
  });

  return {
    playCloudTransition,
    openCloudsOnCurrentPage,
    resetCloudsToOrigin,
    revealElementAfterDelay
  };
})();