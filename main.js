// background images for the main site
const BACKGROUNDS = [
    "slides/02.jpg",
    "slides/03.jpg"
  ];
  
  const $ = s => document.querySelector(s);
  const bgEl   = $("#bg");
  const enter  = $("#enter");
  const site   = $("#site");
  const btn    = $("#enterBtn");
  const video  = $("#introVideo");
  
  // helper
  function setBG(i){
    const url = BACKGROUNDS[i % BACKGROUNDS.length];
    bgEl.style.backgroundImage = `url("${url}")`;
  }
  
  // ENTER click: fade out, stop/unload video, reveal site
  btn.addEventListener("click", () => {
    // set first background immediately
    setBG(0);
  
    // animate out the enter layer
    enter.classList.add("fade-out");
  
    // after animation ends, hide and free video resources
    enter.addEventListener("animationend", () => {
      // stop & unload video (saves battery on mobile)
      try {
        video.pause();
        video.removeAttribute("src");
        while (video.firstChild) video.removeChild(video.firstChild);
        video.load();
      } catch {}
  
      enter.hidden = true;
      site.hidden  = false;
  
      // optional: scroll to top in case the Enter screen was taller
      window.scrollTo({ top: 0, behavior: "instant" });
    }, { once: true });
  });
  
  // swap background based on the visible section
  const panels = [...document.querySelectorAll(".panel")];
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = Number(entry.target.getAttribute("data-bg-index") || 0) || 0;
        setBG(idx);
      }
    });
  }, { root: null, rootMargin: "0px 0px -40% 0px", threshold: 0.5 });
  panels.forEach(p => io.observe(p));

  // ---- DISABLE SCROLL WHILE ENTER SCREEN IS OPEN ----
document.body.style.overflow = "hidden";

// when the Enter button is clicked
btn.addEventListener("click", () => {
  // allow scrolling again
  document.body.style.overflow = "auto";

  // set first background
  setBG(0);


  // animate away
  enter.classList.add("fade-out");
  enter.addEventListener("animationend", () => {
    enter.hidden = true;
    site.hidden  = false;
    // optional: ensure page starts at top
    window.scrollTo({ top: 0 });
  }, { once: true });

});
  
// Configure your folder + files
const GALLERY = {
    mount: "#gallery1",
    basePath: "Gallery",      // the folder in your repo
    files: [
      "/image00002 (1).jpg",
      "/image00025 (1).jpg",
      "/The Seagull--Luv Island Website Img 1.jpg",
      "/The Seagull-Luv Island Website Image 2.jpg",
      "/TV IN the Sky (1).jpg",
      "/TV in the Sky 2 (1).jpg",
      "/TV in the SKY 3 (1).jpg",
      "/TV in the Sky 4 (1).jpg"
    ]
  };
  
  function renderGallery(cfg){
    const root = document.querySelector(cfg.mount);
    if (!root) return;
    root.innerHTML = ""; // clear
  
    cfg.files.forEach(name => {
      const url = cfg.basePath + name;
      const tile = document.createElement("figure");
      tile.className = "gallery-item";
      tile.innerHTML = `
        <img src="${url}" alt="" loading="lazy" decoding="async">
        <a href="${url}" aria-label="Open image"></a>
      `;
      root.appendChild(tile);
    });
  }
  
  // Call after your DOM is ready (e.g., after Enter reveals the site)
  renderGallery(GALLERY);
  

  // Try autoplay inline; if it fails (mobile/low power/etc), use poster instead
async function ensureIntroAutoplayOrPoster() {
  // Respect prefers-reduced-motion as "no autoplay"
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    enter.classList.add("no-autoplay");
    return;
  }

  if (!video) return;
  try {
    // some browsers require a direct play() call even with autoplay attr
    await video.play();
    // success: keep video visible
  } catch (e) {
    // blocked: hide video, let CSS show the poster background
    enter.classList.add("no-autoplay");
    // also stop/unload to save battery
    try {
      video.pause();
      video.removeAttribute("src");
      while (video.firstChild) video.removeChild(video.firstChild);
      video.load();
    } catch {}
  }
}

// run as soon as DOM is ready
document.addEventListener("DOMContentLoaded", ensureIntroAutoplayOrPoster);
