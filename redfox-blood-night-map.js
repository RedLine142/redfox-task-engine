/* RED FOX — BLOOD NIGHT + HORROR MAP v1.6.0
   Single-file build: original Blood Night theme followed by the interactive season map.
   Both modules are restricted to /play/safari and leave admin pages untouched.
*/

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
      body.rf-blood-night { padding-bottom:112px !important; }
      body.rf-blood-night .time {
        box-sizing:border-box; position:fixed !important; z-index:50 !important;
        left:0; right:0; bottom:0; width:100% !important; margin:0 !important;
        padding:12px max(14px,calc((100vw - 1120px)/2)) 14px !important;
        border:0; border-top:1px solid rgba(240,43,67,.58); border-radius:0;
        background:linear-gradient(100deg,rgba(48,7,17,.97),rgba(12,8,11,.98) 55%,rgba(42,6,15,.97));
        box-shadow:0 -10px 35px rgba(0,0,0,.55),0 -2px 18px rgba(181,18,43,.18);
        -webkit-backdrop-filter:blur(14px); backdrop-filter:blur(14px);
      }
      body.rf-blood-night .time .wrapper {
        display:flex; align-items:center; justify-content:space-between; gap:18px;
        width:100%; max-width:1120px; margin:0 auto;
      }
      body.rf-blood-night .rf-blood-time-progress {
        width:100%; max-width:1120px; height:5px; margin:10px auto 0;
        overflow:hidden; border:1px solid rgba(255,255,255,.08); border-radius:20px;
        background:rgba(0,0,0,.62); box-shadow:inset 0 1px 3px rgba(0,0,0,.8);
      }
      body.rf-blood-night .rf-blood-time-progress span {
        display:block; width:0; height:100%; border-radius:inherit;
        background:linear-gradient(90deg,#790b22 0%,#d51a38 68%,#ff5268 100%);
        box-shadow:0 0 12px rgba(240,43,67,.65);
        transition:width .45s ease,background .3s ease;
      }
      body.rf-blood-night .time.rf-time-warning .rf-blood-time-progress span {
        background:linear-gradient(90deg,#a40b27,#ff2949);
        box-shadow:0 0 15px rgba(255,35,65,.8);
      }
      body.rf-blood-night .time.rf-time-critical #time_left {
        color:#ff263f !important; animation:rf-blood-timer-pulse 1s ease-in-out infinite alternate;
      }
      @keyframes rf-blood-timer-pulse {
        from { text-shadow:0 0 5px rgba(240,43,67,.35); }
        to { text-shadow:0 0 18px rgba(255,35,65,.95); }
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
        body.rf-blood-night { padding-bottom:126px !important; }
        body.rf-blood-night .time { width:100% !important; padding:10px 12px 12px !important; }
        body.rf-blood-night .time .wrapper { align-items:center; flex-direction:row; gap:10px; }
        body.rf-blood-night .level_time { font-size:10px; letter-spacing:.1em; }
        body.rf-blood-night #time_left { font-size:16px; }
        body.rf-blood-night .timer { font-size:12px; }
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

  function setupBottomTimer() {
    var timeBox = document.querySelector('.time');
    if (!timeBox) return;

    var wrapper = timeBox.querySelector('.wrapper');
    if (!wrapper) return;

    var progress = timeBox.querySelector('.rf-blood-time-progress');
    if (!progress) {
      progress = document.createElement('div');
      progress.className = 'rf-blood-time-progress';
      progress.setAttribute('role', 'progressbar');
      progress.setAttribute('aria-label', 'Время игры');
      progress.setAttribute('aria-valuemin', '0');
      progress.setAttribute('aria-valuemax', '100');
      var fill = document.createElement('span');
      progress.appendChild(fill);
      timeBox.appendChild(progress);
    }

    if (timeBox._rfBloodTimerInterval) return;

    function updateProgress() {
      var spent = Number(window.time_spent);
      var left = Number(window.time_left);
      if (!isFinite(spent) || !isFinite(left) || spent < 0 || left < 0 || spent + left <= 0) return;

      var total = spent + left;
      var completed = Math.max(0, Math.min(100, spent / total * 100));
      var remaining = 100 - completed;
      var fill = progress.firstElementChild;
      if (fill) fill.style.width = completed + '%';

      progress.setAttribute('aria-valuenow', String(Math.round(completed)));
      timeBox.classList.toggle('rf-time-warning', remaining <= 25 && remaining > 10);
      timeBox.classList.toggle('rf-time-critical', remaining <= 10);
    }

    updateProgress();
    timeBox._rfBloodTimerInterval = window.setInterval(updateProgress, 500);
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
    setupBottomTimer();
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

/* ===== HORROR SEASON MAP MODULE ===== */

/* RED FOX — HORROR SEASON MAP v1.6.0
   Fail-safe visual replacement. The original task list is hidden only after
   the map image has loaded and the map has been inserted successfully.
*/
(function (window, document) {
  'use strict';

  var path = window.location && window.location.pathname || '';
  if (!/^\/play\/safari\/?$/i.test(path)) return;

  var ROOT_ID = 'rf-horror-map';
  var STYLE_ID = 'rf-horror-map-style';
  if (document.getElementById(ROOT_ID)) return;

  var IMAGE_URL = 'https://kemerovo.redfoxkrsk.ru/static/up/images/neonaf.png';
  var IMAGE_WIDTH = 1086;
  var IMAGE_HEIGHT = 1448;
  var TASKS = [
    { name:'Билборд с кроссвордом', url:'/play/safari/8984', x:370, y:1010, w:295, h:230 },
    { name:'Семья Симпсонов', url:'/play/safari/8985', x:60, y:945, w:240, h:245 },
    { name:'Садовник', url:'/play/safari/8986', x:870, y:360, w:130, h:90 },
    { name:'13', url:'/play/safari/8987', x:915, y:1000, w:135, h:120 },
    { name:'Хоррор', url:'/play/safari/8988', x:600, y:117, w:150, h:53 },
    { name:'Кинг', url:'/play/safari/8989', x:540, y:430, w:80, h:170 },
    { name:'Пила', url:'/play/safari/8990', x:820, y:600, w:130, h:80 },
    { name:'Кошмар на улице Вязов', url:'/play/safari/8991', x:230, y:600, w:135, h:90 },
    { name:'Фобия', url:'/play/safari/8992', x:513, y:294, w:127, h:46 },
    { name:'Байки из склепа', url:'/play/safari/8993', x:117, y:295, w:158, h:70 }
  ];

  function normalized(pathname) {
    return String(pathname || '').replace(/\/$/, '');
  }

  function findRow(task, container) {
    var links = container.querySelectorAll('a[href]');
    var target = normalized(task.url);
    for (var i = 0; i < links.length; i++) {
      try {
        if (normalized(new URL(links[i].getAttribute('href'), window.location.origin).pathname) === target) {
          var row = links[i].closest('.item');
          if (row) return row;
        }
      } catch (e) {}
    }
    return null;
  }

  function progressFor(row) {
    if (!row) return { label:'Прогресс недоступен', percent:0 };
    var txt = (row.innerText || row.textContent || '').replace(/\s+/g, ' ');
    var m = txt.match(/(?:найдено\s*)?(\d+)\s*(?:из|\/)\s*(\d+)(?:\s*\+\s*(\d+))?/i);
    var pct = 0;
    var bar = row.querySelector('.progress-bar,[role="progressbar"],.progress > div');
    if (bar) {
      var raw = bar.style.width || bar.getAttribute('aria-valuenow') || '';
      pct = /%$/.test(raw) ? parseFloat(raw) : parseFloat(raw);
      if (!isFinite(pct)) pct = 0;
      if (pct <= 1 && bar.getAttribute('aria-valuemax')) {
        var max = parseFloat(bar.getAttribute('aria-valuemax')) || 0;
        if (max) pct = pct / max * 100;
      }
    }
    if (m) {
      var found = parseInt(m[1],10);
      var total = parseInt(m[2],10) + (parseInt(m[3],10) || 0);
      if (total > 0) {
        pct = Math.max(pct, found / total * 100);
        return { label:'Найдено ' + found + ' из ' + total, percent:Math.max(0,Math.min(100,pct)) };
      }
    }
    return { label:pct > 0 ? 'Выполнено ' + Math.round(pct) + '%' : 'Прогресс недоступен', percent:Math.max(0,Math.min(100,pct)) };
  }

  function addStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var css = [
      '#' + ROOT_ID + '{display:none;position:relative;width:100%;max-width:900px;margin:10px auto 22px;color:#fff}',
      '#' + ROOT_ID + '.rf-ready{display:block}',
      '#' + ROOT_ID + ' .rf-map-frame{position:relative;width:100%;aspect-ratio:3/4;overflow:visible;isolation:isolate;border:1px solid rgba(240,43,67,.55);background:#090608;box-shadow:0 12px 40px rgba(0,0,0,.55),0 0 28px rgba(181,18,43,.18)}',
      '#' + ROOT_ID + ' .rf-map-image{display:block;width:100%;height:100%;object-fit:fill;user-select:none;-webkit-user-drag:none}',
      '#' + ROOT_ID + ' .rf-hotspot{position:absolute;z-index:2;display:block;padding:0;margin:0;border:0;border-radius:0;background:rgba(0,0,0,.055);-webkit-backdrop-filter:grayscale(.57) brightness(.80) saturate(.60);backdrop-filter:grayscale(.57) brightness(.80) saturate(.60);-webkit-mask-image:radial-gradient(ellipse at center,rgba(0,0,0,.72) 34%,rgba(0,0,0,.42) 66%,transparent 100%);mask-image:radial-gradient(ellipse at center,rgba(0,0,0,.72) 34%,rgba(0,0,0,.42) 66%,transparent 100%);-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;box-shadow:none;cursor:pointer;transition:background .25s ease,-webkit-backdrop-filter .25s ease,backdrop-filter .25s ease,box-shadow .25s ease}',
      '#' + ROOT_ID + ' .rf-hotspot:hover,' + '#' + ROOT_ID + ' .rf-hotspot:focus-visible,' + '#' + ROOT_ID + ' .rf-hotspot.rf-touch-open{z-index:5;background:rgba(255,35,65,.035);-webkit-backdrop-filter:grayscale(0) brightness(1.25) saturate(1.42);backdrop-filter:grayscale(0) brightness(1.25) saturate(1.42);box-shadow:inset 0 0 24px rgba(255,45,72,.20),0 0 20px rgba(240,43,67,.48);outline:none}',
      '#' + ROOT_ID + ' .rf-tooltip{position:absolute;z-index:10;left:0;top:0;transform:none;display:none;width:min(300px,calc(100% - 16px));box-sizing:border-box;padding:13px 15px;border:1px solid rgba(240,43,67,.75);border-radius:5px;color:#f8e9ec;background:rgba(15,7,11,.97);box-shadow:0 12px 36px rgba(0,0,0,.65);pointer-events:none}',
      '#' + ROOT_ID + ' .rf-tooltip.rf-visible{display:block}',
      '#' + ROOT_ID + ' .rf-tip-title{font-size:15px;font-weight:900;margin-bottom:8px}',
      '#' + ROOT_ID + ' .rf-tip-count{font-size:11px;color:#d7b9bf;margin-bottom:7px}',
      '#' + ROOT_ID + ' .rf-tip-bar{height:6px;border-radius:20px;overflow:hidden;background:#29151b}',
      '#' + ROOT_ID + ' .rf-tip-bar span{display:block;height:100%;background:linear-gradient(90deg,#780b22,#e21d3d 75%,#ff5364)}',
      '#' + ROOT_ID + ' .rf-map-legend{margin-top:9px;text-align:center;color:#a98d94;font-size:10px}',
      '@media(max-width:600px){#' + ROOT_ID + '{margin-top:6px}#' + ROOT_ID + ' .rf-map-legend{font-size:9px}}',
      '@media(prefers-reduced-motion:reduce){#' + ROOT_ID + ' .rf-hotspot{transition:none}}'
    ].join('\n');
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    (document.head || document.documentElement).appendChild(style);
  }

  function init() {
    if (!document.body || !/^\/play\/safari\/?$/i.test(window.location.pathname || '')) return;
    var container = document.querySelector('.container');
    if (!container || !container.querySelector('h1')) return;

    var rows = [];
    var taskRows = [];
    for (var i = 0; i < TASKS.length; i++) {
      var row = findRow(TASKS[i], container);
      if (row) {
        rows.push(row);
        taskRows.push(row);
      }
    }
    if (rows.length < 3) return;

    var map = document.createElement('section');
    map.id = ROOT_ID;
    map.setAttribute('aria-label', 'Интерактивная карта заданий сезона');

    var frame = document.createElement('div');
    frame.className = 'rf-map-frame';
    var img = document.createElement('img');
    img.className = 'rf-map-image';
    img.alt = 'Карта города с заданиями';
    img.draggable = false;
    frame.appendChild(img);

    var tooltip = document.createElement('div');
    tooltip.className = 'rf-tooltip';
    var tipTitle = document.createElement('div');
    tipTitle.className = 'rf-tip-title';
    var tipCount = document.createElement('div');
    tipCount.className = 'rf-tip-count';
    var tipBar = document.createElement('div');
    tipBar.className = 'rf-tip-bar';
    var tipFill = document.createElement('span');
    tipBar.appendChild(tipFill);
    tooltip.appendChild(tipTitle);
    tooltip.appendChild(tipCount);
    tooltip.appendChild(tipBar);

    frame.appendChild(tooltip);
    map.appendChild(frame);
    var legend = document.createElement('div');
    legend.className = 'rf-map-legend';
    legend.textContent = 'Наведите на объект, чтобы увидеть прогресс · Нажмите, чтобы открыть задание';
    map.appendChild(legend);

    var heading = container.querySelector('h1');
    if (!heading || !heading.parentNode) return;

    try {
      addStyle();
      heading.parentNode.insertBefore(map, heading.nextSibling);
      if (!map.parentNode) throw new Error('Map insertion failed');

      TASKS.forEach(function(task) {
        var a = document.createElement('a');
        a.className = 'rf-hotspot';
        a.href = task.url;
        a.setAttribute('aria-label', task.name + '. Открыть задание');
        a.title = task.name;
        a.style.left = (task.x / IMAGE_WIDTH * 100) + '%';
        a.style.top = (task.y / IMAGE_HEIGHT * 100) + '%';
        a.style.width = (task.w / IMAGE_WIDTH * 100) + '%';
        a.style.height = (task.h / IMAGE_HEIGHT * 100) + '%';

        function show() {
          var p = progressFor(findRow(task, container));
          tipTitle.textContent = task.name;
          tipCount.textContent = p.label;
          tipFill.style.width = p.percent + '%';
          tooltip.classList.add('rf-visible');

          // Position the progress card beside the active hotspot, inside the map.
          var mapWidth = frame.clientWidth;
          var mapHeight = frame.clientHeight;
          var cardWidth = Math.min(300, Math.max(180, mapWidth - 16));
          var cardHeight = tooltip.offsetHeight || 78;
          var centerX = (task.x + task.w / 2) / IMAGE_WIDTH * mapWidth;
          var hotspotTop = task.y / IMAGE_HEIGHT * mapHeight;
          var hotspotBottom = (task.y + task.h) / IMAGE_HEIGHT * mapHeight;
          var left = Math.max(8, Math.min(mapWidth - cardWidth - 8, centerX - cardWidth / 2));
          var top = hotspotBottom + 10;
          if (top + cardHeight > mapHeight - 8) {
            top = hotspotTop - cardHeight - 10;
          }
          top = Math.max(8, Math.min(mapHeight - cardHeight - 8, top));
          tooltip.style.left = left + 'px';
          tooltip.style.top = top + 'px';
        }
        a.addEventListener('mouseenter', show);
        a.addEventListener('focus', show);
        a.addEventListener('mouseleave', function(){ tooltip.classList.remove('rf-visible'); });
        a.addEventListener('blur', function(){ tooltip.classList.remove('rf-visible'); });
        a.addEventListener('click', function(e) {
          if (window.matchMedia && window.matchMedia('(hover: none)').matches && !a.classList.contains('rf-touch-open')) {
            e.preventDefault();
            frame.querySelectorAll('.rf-touch-open').forEach(function(el){el.classList.remove('rf-touch-open');});
            a.classList.add('rf-touch-open');
            show();
          }
        });
        frame.appendChild(a);
      });

      // Show the map shell and hide the old task cards immediately.
      // Do not wait for the background image request to finish: that caused
      // the original list to flash briefly during page load.
      rows.forEach(function(r){ r.style.display = 'none'; });
      map.classList.add('rf-ready');
      img.loading = 'eager';
      if ('fetchPriority' in img) img.fetchPriority = 'high';
      img.decoding = 'async';

      img.onload = function() {
        if (!map.parentNode || !document.body.contains(map)) return;
        map.classList.add('rf-ready');
      };
      img.onerror = function() {
        // Restore the original list if the map image cannot be loaded.
        rows.forEach(function(r){ r.style.display = ''; });
        if (map.parentNode) map.parentNode.removeChild(map);
        var st = document.getElementById(STYLE_ID);
        if (st && st.parentNode) st.parentNode.removeChild(st);
      };
      img.src = IMAGE_URL;
      if (img.complete && img.naturalWidth > 0) img.onload();
    } catch (err) {
      // Keep the original task list usable if map initialization fails.
      rows.forEach(function(r){ r.style.display = ''; });
      if (map.parentNode) map.parentNode.removeChild(map);
      var styleEl = document.getElementById(STYLE_ID);
      if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
      if (window.console && console.error) console.error('[RED FOX] Horror map failed safely:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once:true });
  } else {
    init();
  }
})(window, document);
