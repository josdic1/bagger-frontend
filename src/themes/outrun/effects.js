export function mount() {
  const style = document.createElement("style");
  style.setAttribute("data-theme-effect", "outrun-keyframes");
  style.textContent = `
    @keyframes outrunScan { 0% { transform: translateY(0);} 100% { transform: translateY(6px);} }
    @keyframes outrunGridMove { 0% { background-position: 0 0;} 100% { background-position: 0 300px;} }
    @keyframes outrunPulse { 0%,100% { opacity:.72;} 50% { opacity:.95;} }
  `;

  const bloom = document.createElement("div");
  bloom.setAttribute("data-theme-effect", "outrun-bloom");
  bloom.style.position = "fixed";
  bloom.style.inset = "0";
  bloom.style.pointerEvents = "none";
  bloom.style.zIndex = "0";
  bloom.style.background =
    "radial-gradient(800px 420px at 50% 12%, rgba(255,73,210,0.22), transparent 60%)," +
    "radial-gradient(900px 520px at 50% 18%, rgba(0,240,255,0.14), transparent 65%)";
  bloom.style.animation = "outrunPulse 6s ease-in-out infinite";

  const scan = document.createElement("div");
  scan.setAttribute("data-theme-effect", "outrun-scanlines");
  scan.style.position = "fixed";
  scan.style.inset = "0";
  scan.style.pointerEvents = "none";
  scan.style.zIndex = "0";
  scan.style.opacity = "0.22";
  scan.style.background =
    "repeating-linear-gradient(to bottom, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 6px)";
  scan.style.animation = "outrunScan 0.18s linear infinite";

  const sun = document.createElement("div");
  sun.setAttribute("data-theme-effect", "outrun-sun");
  sun.style.position = "fixed";
  sun.style.left = "50%";
  sun.style.top = "110px";
  sun.style.width = "560px";
  sun.style.height = "560px";
  sun.style.transform = "translateX(-50%)";
  sun.style.borderRadius = "999px";
  sun.style.pointerEvents = "none";
  sun.style.zIndex = "0";
  sun.style.opacity = "0.95";
  sun.style.background =
    "radial-gradient(circle at 50% 45%, rgba(255,176,0,0.60), rgba(255,73,210,0.26) 44%, rgba(0,240,255,0.12) 68%, transparent 72%)";
  sun.style.filter = "drop-shadow(0 0 40px rgba(255,73,210,0.12))";

  const grid = document.createElement("div");
  grid.setAttribute("data-theme-effect", "outrun-grid");
  grid.style.position = "fixed";
  grid.style.left = "0";
  grid.style.right = "0";
  grid.style.bottom = "-22vh";
  grid.style.height = "60vh";
  grid.style.pointerEvents = "none";
  grid.style.zIndex = "0";
  grid.style.opacity = "0.32";
  grid.style.transform = "perspective(700px) rotateX(62deg)";
  grid.style.transformOrigin = "center bottom";
  grid.style.backgroundImage =
    "linear-gradient(to right, rgba(0,240,255,0.40) 1px, transparent 1px)," +
    "linear-gradient(to bottom, rgba(255,73,210,0.30) 1px, transparent 1px)";
  grid.style.backgroundSize = "70px 70px";
  grid.style.animation = "outrunGridMove 2.1s linear infinite";
  grid.style.filter = "drop-shadow(0 0 22px rgba(0,240,255,0.22))";

  document.body.appendChild(style);
  document.body.appendChild(bloom);
  document.body.appendChild(sun);
  document.body.appendChild(grid);
  document.body.appendChild(scan);

  return () => {
    document
      .querySelectorAll('[data-theme-effect^="outrun-"]')
      .forEach((el) => el.remove());
  };
}
