/* RED FOX — BLOOD NIGHT THEME
   Standalone visual layer for the game cabinet page.
   Does not modify game timing, answer input, answer validation, links or server logic.
*/
(function (window, document) {
  'use strict';

  // Absolute first-line gate: this script is allowed only on the player's Safari cabinet.
  // On every other URL, remove any remnants and stop before defining or running the theme.
  var currentPath = window.location && window.location.pathname ? window.location.pathname : '';
  if (!/^\/play\/safari\/?$/i.test(currentPath)) {
    document.documentElement.classList.remove('rf-blood-night');
    if (document.body) document.body.classList.remove('rf-blood-night');
    var staleStyle = document.getElementById('rf-blood-night-style');
    if (staleStyle) staleStyle.parentNode.removeChild(staleStyle);
    var staleParticles = document.querySelector('.rf-blood-particles');
    if (staleParticles) staleParticles.parentNode.removeChild(staleParticles);
    return;
  }

  var STYLE_ID = 'rf-blood-night-style';
  var ROOT_CLASS = 'rf-blood-night';
  var PARTICLE_COUNT = 22;

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;

    var css = `
      :root {
        --rf-blood-bg: #090608;
        --rf-blood-panel: rgba(24, 13, 17, .94);
        --rf-blood-red: #b5122b;
        --rf-blood-bright: #f02b43;
        --rf-blood-muted: #b99da3;
        --rf-blood-text: #f6e9eb;
        --rf-blood-line: rgba(211, 34, 58, .38);
      }
      html.rf-blood-night { background: var(--rf-blood-bg) !important; }
      body.rf-blood-night {
        position: relative; min-height: 100vh; overflow-x: hidden;
        color: var(--rf-blood-text) !important;
        background: radial-gradient(ellipse at 50% -15%, rgba(125,9,29,.36), transparent 48%),
          radial-gradient(ellipse at 5% 45%, rgba(80,8,21,.18), transparent 35%),
          linear-gradient(180deg,#10090d 0%,#080608 65%,#050405 100%) !important;
        font-family: "Arial Narrow","Roboto Condensed",Arial,sans-serif !important;
      }
      body.rf-blood-night::before {
        content:""; position:fixed; inset:0; z-index:0; pointer-events:none; opacity:.13;
        background-image: repeating-linear-gradient(0deg,transparent 0 3px,rgba(255,255,255,.035) 4px),
          radial-gradient(circle at 20% 20%,rgba(255,255,255,.12) 0 1px,transparent 1.5px);
        background-size:auto,7px 7px; mix-blend-mode:screen;
      }
      body.rf-blood-night::after {
        content:""; position:fixed; inset:0; z-index:0; pointer-events:none;
        background:linear-gradient(90deg,rgba(0,0,0,.52),transparent 15%,transparent 85%,rgba(0,0,0,.52));
      }
      body.rf-blood-night .wrapper,body.rf-blood-night .container,
      body.rf-blood-night .time,body.rf-blood-night .locations { position:relative; z-index:1; }
      body.rf-blood-night .wrapper { width:min(1120px,calc(100% - 28px)); margin-left:auto; margin-right:auto; }
      body.rf-blood-night .container {
        box-sizing:border-box; margin:28px auto 22px !important; padding:clamp(18px,3vw,34px) !important;
        overflow:hidden; border:1px solid var(--rf-blood-line); border-radius:5px;
        background:linear-gradient(135deg,rgba(83,9,25,.18),transparent 38%),var(--rf-blood-panel);
        box-shadow:0 18px 60px rgba(0,0,0,.58),0 0 34px rgba(143,8,32,.12);
      }
      body.rf-blood-night .container::before {
        content:"FRIDAY THE 13TH  /  SURVIVAL NIGHT"; display:block; margin:0 0 15px;
        color:#f04458; font-size:11px; font-weight:900; letter-spacing:.32em;
        text-align:center; text-shadow:0 0 12px rgba(240,43,67,.55);
      }
      body.rf-blood-night .team_name {
        margin:0 0 10px !important; color:#d7b9bf !important; font-size:12px !important;
        font-weight:800; letter-spacing:.2em; text-transform:uppercase;
      }
      body.rf-blood-night h1 {
        position:relative; margin:0 0 27px !important; padding:0 0 19px !important;
        color:#fff1f2 !important; font-family:Impact,"Arial Narrow",sans-serif !important;
        font-size:clamp(27px,5vw,48px) !important; font-weight:900 !important;
        line-height:1.02 !important; letter-spacing:.045em; text-transform:uppercase;
        text-shadow:0 3px 0 #5b0b1b,0 0 22px rgba(205,15,45,.32);
      }
      body.rf-blood-night h1::after {
        content:""; position:absolute; bottom:0; left:0; width:92px; height:3px;
        background:linear-gradient(90deg,var(--rf-blood-bright),transparent);
        box-shadow:0 0 12px rgba(240,43,67,.55);
      }
      body.rf-blood-night .item {
        position:relative; box-sizing:border-box; margin:13px 0 !important; padding:0 !important;
        overflow:hidden; border:1px solid rgba(190,30,54,.28); border-radius:4px;
        background:linear-gradient(110deg,rgba(65,15,26,.94),rgba(17,12,16,.98) 72%);
        box-shadow:0 7px 20px rgba(0,0,0,.3);
        transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease;
      }
      body.rf-blood-night .item::before {
        content:""; position:absolute; top:0; bottom:0; left:0; width:3px; background:#8d1027;
        transition:width .22s ease,background .22s ease;
      }
      body.rf-blood-night .item:hover {
        transform:translateY(-3px); border-color:rgba(240,43,67,.72);
        box-shadow:0 10px 28px rgba(0,0,0,.48),0 0 18px rgba(181,18,43,.16);
      }
      body.rf-blood-night .item:hover::before { width:5px; background:var(--rf-blood-bright); }
      body.rf-blood-night .item a {
        display:grid !important;
        grid-template-columns:minmax(110px,clamp(110px,24%,250px)) minmax(45px,auto) minmax(0,1fr);
        align-items:center; gap:17px; min-height:92px; padding:12px 17px 12px 20px !important;
        color:var(--rf-blood-text) !important; text-decoration:none !important;
      }
      /* Every row gets a responsive image column. Image height follows its own proportions. */
      body.rf-blood-night .item strong {
        display:block; box-sizing:border-box; width:100%; height:auto; min-width:0;
        margin:0; padding:0; overflow:hidden;
        border:1px solid rgba(230,67,87,.35); background:#080608;
      }
      body.rf-blood-night .item strong span {
        display:block; width:100%; height:auto; line-height:0;
      }
      body.rf-blood-night .item strong img {
        display:block; width:100% !important; max-width:100% !important;
        height:auto !important; object-fit:contain;
        filter:saturate(.72) contrast(1.12) brightness(.82);
        transition:filter .25s ease,transform .35s ease;
      }
      body.rf-blood-night .item:hover strong img {
        filter:saturate(1) contrast(1.15) brightness(1); transform:scale(1.025);
      }
      body.rf-blood-night .item a > div:not(.progress) {
        color:#f4dfe3 !important; font-size:16px; font-weight:900;
        font-variant-numeric:tabular-nums; white-space:nowrap;
      }
      body.rf-blood-night .progress {
        height:7px !important; overflow:hidden; border:1px solid rgba(255,255,255,.06);
        border-radius:20px; background:#080608 !important; box-shadow:inset 0 1px 3px rgba(0,0,0,.8);
      }
      body.rf-blood-night .progress-bar {
        min-width:0; height:100%; border-radius:inherit;
        background:linear-gradient(90deg,#780b22,#e21d3d 75%,#ff5364) !important;
        box-shadow:0 0 12px rgba(240,43,67,.5);
      }
      body.rf-blood-night .time {
        box-sizing:border-box; width:min(1120px,calc(100% - 28px)); margin:20px auto !important;
        padding:17px 22px !important; border:1px solid rgba(214,34,59,.42); border-radius:4px;
        background:linear-gradient(100deg,rgba(73,8,24,.92),rgba(17,10,14,.96));
        box-shadow:0 0 28px rgba(134,7,31,.15);
      }
      body.rf-blood-night .time .wrapper {
        display:flex; align-items:center; justify-content:space-between; gap:15px;
        width:100%; margin:0;
      }
      body.rf-blood-night .level_time {
        color:#d7b9bf !important; font-size:12px; font-weight:800;
        letter-spacing:.18em; text-transform:uppercase;
      }
      body.rf-blood-night #time_left {
        display:inline-block; margin-left:7px; color:#ff5268; font-size:19px;
        font-weight:900; letter-spacing:.04em; text-shadow:0 0 12px rgba(240,43,67,.45);
        font-variant-numeric:tabular-nums;
      }
      body.rf-blood-night .timer {
        color:#f3dfe3; font-size:14px; font-weight:800; letter-spacing:.12em;
        font-variant-numeric:tabular-nums;
      }
      body.rf-blood-night .locations {
        width:min(1120px,calc(100% - 28px)); margin:18px auto 35px !important;
        border-collapse:separate !important; border-spacing:0;
        border:1px solid rgba(190,30,54,.28); background:rgba(18,11,15,.94);
      }
      body.rf-blood-night .locations td { padding:13px 17px !important; color:#b99da3; }
      body.rf-blood-night .locations a {
        color:#e54a60 !important; font-size:11px; font-weight:900; letter-spacing:.2em;
        text-decoration:none; text-transform:uppercase;
      }
      body.rf-blood-night .locations a:hover { color:#fff !important; text-shadow:0 0 10px rgba(240,43,67,.7); }
      .rf-blood-particles { position:fixed; inset:0; z-index:0; overflow:hidden; pointer-events:none; }
      .rf-blood-particle {
        position:absolute; top:-12px; width:2px; height:2px; border-radius:50%;
        background:#e52b45; opacity:0; box-shadow:0 0 7px 2px rgba(229,43,69,.35);
        animation:rf-blood-fall linear infinite;
      }
      @keyframes rf-blood-fall {
        0% { transform:translate3d(0,-5vh,0); opacity:0; }
        12% { opacity:.65; } 85% { opacity:.35; }
        100% { transform:translate3d(35px,110vh,0); opacity:0; }
      }
      @media (max-width:600px) {
        body.rf-blood-night .wrapper { width:calc(100% - 18px); }
        body.rf-blood-night .container { margin-top:10px !important; padding:17px 12px !important; }
        body.rf-blood-night .item a {
          grid-template-columns:minmax(84px,30%) minmax(35px,auto) minmax(0,1fr);
          gap:10px; min-height:76px; padding:9px 10px 9px 13px !important;
        }
        body.rf-blood-night .item a > div:not(.progress) { font-size:14px; }
        body.rf-blood-night .time { width:calc(100% - 18px); padding:13px 12px !important; }
        body.rf-blood-night .time .wrapper { align-items:flex-start; flex-direction:column; gap:8px; }
        body.rf-blood-night .locations { width:calc(100% - 18px); }
      }
      @media (prefers-reduced-motion:reduce) {
        .rf-blood-particle { display:none !important; }
        body.rf-blood-night .item,body.rf-blood-night .item img { transition:none !important; }
      }
    `;

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    (document.head || document.documentElement).appendChild(style);
  }

  function addParticles() {
    if (document.querySelector('.rf-blood-particles')) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var layer = document.createElement('div');
    layer.className = 'rf-blood-particles';
    layer.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      var particle = document.createElement('i');
      particle.className = 'rf-blood-particle';
      particle.style.left = (Math.random() * 100).toFixed(2) + '%';
      particle.style.animationDuration = (9 + Math.random() * 13).toFixed(2) + 's';
      particle.style.animationDelay = (-Math.random() * 20).toFixed(2) + 's';
      particle.style.width = (1 + Math.random() * 2).toFixed(1) + 'px';
      particle.style.height = particle.style.width;
      layer.appendChild(particle);
    }
    document.body.appendChild(layer);
  }

  function isGameCabinetPage() {
    // Strict URL gate: only player Safari pages. Admin pages are always excluded.
    var path = window.location && window.location.pathname
      ? window.location.pathname
      : '';
    return /^\/play\/safari\/?$/i.test(path);
  }

  function disableTheme() {
    // Safety cleanup in case an older cached copy ran on this page.
    document.documentElement.classList.remove(ROOT_CLASS);
    if (document.body) document.body.classList.remove(ROOT_CLASS);
    var style = document.getElementById(STYLE_ID);
    if (style) style.remove();
    var particles = document.querySelector('.rf-blood-particles');
    if (particles) particles.remove();
  }

  function init() {
    if (!document.body) return;
    if (!isGameCabinetPage()) {
      disableTheme();
      return;
    }
    if (document.body.classList.contains(ROOT_CLASS)) return;
    addStyles();
    document.documentElement.classList.add(ROOT_CLASS);
    document.body.classList.add(ROOT_CLASS);
    addParticles();
    // Load the optional horror map only on the player Safari cabinet.
    // Keeping this loader here avoids a second long script tag in the game title field.
    if (!document.getElementById('rf-horror-map-loader')) {
      var mapScript = document.createElement('script');
      mapScript.id = 'rf-horror-map-loader';
      mapScript.src = 'https://cdn.jsdelivr.net/gh/RedLine142/redfox-task-engine@e22d5d722247c158512f8c849fb5888b8a9249f3/redfox-horror-map.js?v=1.1.0';
      mapScript.async = true;
      mapScript.onerror = function () {
        if (window.console && console.error) console.error('[RED FOX] Horror map script could not be loaded; original task list remains available.');
      };
      (document.head || document.documentElement).appendChild(mapScript);
    }
    var title = document.querySelector('.container h1');
    if (title) title.setAttribute('data-rf-theme', 'blood-night');
    if (window.console && console.info) console.info('[RED FOX] Blood Night page theme ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})(window, document);