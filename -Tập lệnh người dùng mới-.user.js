// ==UserScript==
// @name          Bypass Yeumoney
// @namespace    http://127.0.0.1:8080/
// @version      0.1
// @description  Template userscript created by Muno
// @author       Ngo Xuan Hoang 
// @match        *://*/*
// @grant        none
// ==/UserScript==
    (() => {
  let speed = 10;
  let fakeTime = Date.now();
  let intervalId = null;

  // SVG icons
  const svgPlus = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#004d80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
  const svgMinus = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#004d80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>`;

  // ====== Tạo giao diện ======
  const box = document.createElement("div");
  box.innerHTML = `
    <div id="clock" style="font-size:12px; margin-bottom:4px;">🕒 --:--:--</div>
    <div style="display:flex; align-items:center; justify-content:center; gap:4px;">
      <button id="decreaseBtn" style="background:none; border:none; cursor:pointer;" title="Giảm tốc độ">${svgMinus}</button>
      <span id="speed" style="font-size:11px; min-width:36px;">x${speed}</span>
      <button id="increaseBtn" style="background:none; border:none; cursor:pointer;" title="Tăng tốc độ">${svgPlus}</button>
    </div>
    <div style="font-size:8px; color:#777; margin-top:3px;">© muno-tool</div>
  `;
  Object.assign(box.style, {
    position: "fixed",
    top: "12px",
    right: "12px",
    background: "rgba(255, 255, 255, 0.95)",
    color: "#004d80",
    padding: "8px 10px",
    fontFamily: "monospace",
    zIndex: 999999,
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    fontSize: "13px",
    lineHeight: "1.5",
    textAlign: "center",
    userSelect: "none",
    cursor: "move",
    transition: "top 0.2s ease, left 0.2s ease"
  });
  document.body.appendChild(box);

  const clockEl = box.querySelector("#clock");
  const speedEl = box.querySelector("#speed");
  const btnPlus = box.querySelector("#increaseBtn");
  const btnMinus = box.querySelector("#decreaseBtn");

  // ====== Tăng giảm tốc độ ======
  function updateSpeedDisplay() {
    speedEl.textContent = `x${speed}`;
  }

  function increaseSpeed() {
    if (speed < 10000) speed++;
    updateSpeedDisplay();
  }

  function decreaseSpeed() {
    if (speed > 1) speed--;
    updateSpeedDisplay();
  }

  btnPlus.onclick = increaseSpeed;
  btnMinus.onclick = decreaseSpeed;

  // ====== Đồng hồ giả lập ======
  function updateClock() {
    fakeTime += 1000 * speed;
    const now = new Date(fakeTime);
    clockEl.textContent = "🕒 " + now.toLocaleTimeString();
  }

  fakeTime = Date.now();
  intervalId = setInterval(updateClock, 1000);

  // ====== Ghi đè timeout / interval ======
  const _setTimeout = window.setTimeout;
  const _setInterval = window.setInterval;

  window.setTimeout = function (fn, delay, ...args) {
    return _setTimeout(fn, delay / speed, ...args);
  };
  window.setInterval = function (fn, delay, ...args) {
    return _setInterval(fn, delay / speed, ...args);
  };

  // ====== Kéo di chuyển (PC + Mobile) ======
  let isDragging = false, offsetX = 0, offsetY = 0;

  const onMove = (x, y) => {
    box.style.left = `${x - offsetX}px`;
    box.style.top = `${y - offsetY}px`;
    box.style.right = "auto";
  };

  const onMouseDown = e => {
    isDragging = true;
    offsetX = e.clientX - box.getBoundingClientRect().left;
    offsetY = e.clientY - box.getBoundingClientRect().top;
    e.preventDefault();
  };

  const onTouchStart = e => {
    isDragging = true;
    const touch = e.touches[0];
    offsetX = touch.clientX - box.getBoundingClientRect().left;
    offsetY = touch.clientY - box.getBoundingClientRect().top;
  };

  document.addEventListener("mousemove", e => {
    if (isDragging) onMove(e.clientX, e.clientY);
  });
  document.addEventListener("mouseup", () => isDragging = false);
  document.addEventListener("touchmove", e => {
    if (isDragging) onMove(e.touches[0].clientX, e.touches[0].clientY);
  });
  document.addEventListener("touchend", () => isDragging = false);

  box.addEventListener("mousedown", onMouseDown);
  box.addEventListener("touchstart", onTouchStart);

  console.log("✅ Đã kích hoạt thành công ✅.");
})();