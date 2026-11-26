const WebEffects = (() => {
  function revealElementAfterDelay(element, delayMs = 650) {
    if (!element) return;

    setTimeout(() => {
      element.classList.remove("is-hidden");
      element.classList.add("is-visible");
    }, delayMs);
  }

  function playCloudTransition(onNavigate, coverMs = 920, openMs = 920) {
    const overlay = document.getElementById("cloudTransition");
    if (!overlay) {
      if (typeof onNavigate === "function") onNavigate();
      return;
    }

    overlay.classList.remove("is-running", "is-opening", "is-entering");
    overlay.classList.add("is-active");

    void overlay.offsetWidth;
    // Bước 1: 4 đám mây trượt vào phủ kín màn hình
    overlay.classList.add("is-running");

    // Bước 2: Sau khi phủ kín, mở ngược mây về chỗ cũ
    setTimeout(() => {
      overlay.classList.remove("is-running");
      void overlay.offsetWidth;
      overlay.classList.add("is-opening");
    }, coverMs);

    // Bước 3: Chuyển sang trang mới khi mây đang mở về chỗ cũ
    setTimeout(() => {
      if (typeof onNavigate === "function") {
        onNavigate();
      }
    }, coverMs + Math.floor(openMs * 0.65));
  }

  function openCloudsOnPageEnter(openMs = 950) {
    const overlay = document.getElementById("cloudTransition");
    if (!overlay) return;

    overlay.classList.remove("is-running", "is-opening");
    overlay.classList.add("is-active", "is-entering");

    setTimeout(() => {
      overlay.classList.remove("is-entering", "is-active");
    }, openMs);
  }

  function resetCloudsToOrigin() {
    const overlay = document.getElementById("cloudTransition");
    if (!overlay) return;

    overlay.classList.remove("is-running", "is-opening", "is-entering", "is-active");
  }

  return {
    revealElementAfterDelay,
    playCloudTransition,
    openCloudsOnPageEnter,
    resetCloudsToOrigin
  };
})();