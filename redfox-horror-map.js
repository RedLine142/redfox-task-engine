/* RED FOX — HORROR SEASON INTERACTIVE MAP
   Visual replacement for the task list on /play/safari only.
   Keeps RedFox task links and reads live progress from the original task rows.
   Does not change game timing, answer validation, task logic or server data.
*/
(function (window, document) {
  'use strict';

  // Fail closed: this file may be embedded in the game title and therefore loaded elsewhere.
  // Do absolutely nothing unless this is the exact player task-list route.
  var currentPath = window.location && window.location.pathname ? window.location.pathname : '';
  if (!/^\/play\/safari\/?$/i.test(currentPath)) return;

  var STYLE_ID = 'rf-horror-map-style';
  var ROOT_ID = 'rf-horror-map';
  var IMAGE_URL = 'https://kemerovo.redfoxkrsk.ru/static/up/images/neonaf.png';
  var IMAGE_WIDTH = 1086;
  var IMAGE_HEIGHT = 1448;
  var TASKS = [
    { id: 'crossword', name: 'Билборд с кроссвордом', url: 'https://kemerovo.redfoxkrsk.ru/play/safari/8984', x: 350, y: 980, w: 350, h: 400 },
    { id: 'simpsons-family', name: 'Семья Симпсонов', url: 'https://kemerovo.redfoxkrsk.ru/play/safari/8985', x: 50, y: 920, w: 250, h: 300 },
    { id: 'gardener', name: 'Садовник', url: 'https://kemerovo.redfoxkrsk.ru/play/safari/8986', x: 800, y: 270, w: 280, h: 215 },
    { id: 'thirteen', name: '13', url: 'https://kemerovo.redfoxkrsk.ru/play/safari/8987', x: 890, y: 950, w: 135, h: 160 },
    { id: 'horror', name: 'Хоррор', url: 'https://kemerovo.redfoxkrsk.ru/play/safari/8988', x: 575, y: 100, w: 185, h: 85 },
    { id: 'king', name: 'Кинг', url: 'https://kemerovo.redfoxkrsk.ru/play/safari/8989', x: 350, y: 390, w: 340, h: 310 },
    { id: 'saw', name: 'Пила', url: 'https://kemerovo.redfoxkrsk.ru/play/safari/8990', x: 780, y: 455, w: 306, h: 305 },
    { id: 'nightmare', name: 'Кошмар на улице Вязов', url: 'https://kemerovo.redfoxkrsk.ru/play/safari/8991', x: 0, y: 405, w: 375, h: 340 },
    { id: 'phobia', name: 'Фобия', url: 'https://kemerovo.redfoxkrsk.ru/play/safari/8992', x: 397, y: 176, w: 363, h: 214 },
    { id: 'crypt', name: 'Байки из склепа', url: 'https://kemerovo.redfoxkrsk.ru/play/safari/8993', x: 34, y: 120, w: 297, h: 281 }
  ];

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var css = `
      #${ROOT_ID} { position:relative; width:100%; max-width:900px; margin:10px auto 22px; color:#fff; }
      #${ROOT_ID} .rf-map-heading { margin:0 0 12px; text-align:center; color:#f5dfe3; font-size:12px; font-weight:900; letter-spacing:.22em; text-transform:uppercase; }
      #${ROOT_ID} .rf-map-frame { position:relative; width:100%; aspect-ratio:3 / 4; overflow:visible; isolation:isolate; border:1px solid rgba(240,43,67,.55); background:#090608; box-shadow:0 12px 40px rgba(0,0,0,.55),0 0 28px rgba(181,18,43,.18); }
      #${ROOT_ID} .rf-map-image { display:block; width:100%; height:100%; object-fit:fill; user-select:none; -webkit-user-drag:none; }
      #${ROOT_ID} .rf-hotspot { position:absolute; z-index:2; display:block; padding:0; margin:0; border:1px solid transparent; border-radius:5px; background:rgba(240,43,67,0); cursor:pointer; transform:translateZ(0); transition:transform .22s ease,background .22s ease,border-color .22s ease,box-shadow .22s ease; -webkit-tap-highlight-color:transparent; }
      #${ROOT_ID} .rf-hotspot:hover,#${ROOT_ID} .rf-hotspot:focus-visible,#${ROOT_ID} .rf-hotspot.rf-touch-open { z-index:5; transform:scale(1.035); border-color:rgba(255,92,112,.95); background:rgba(240,43,67,.13); box-shadow:0 0 0 2px rgba(240,43,67,.2),0 0 22px rgba(240,43,67,.5),inset 0 0 18px rgba(240,43,67,.16); outline:none; }
      #${ROOT_ID} .rf-hotspot::after { content:""; position:absolute; inset:0; border-radius:inherit; opacity:0; background:linear-gradient(135deg,rgba(255,255,255,.12),transparent 55%); transition:opacity .2s ease; pointer-events:none; }
      #${ROOT_ID} .rf-hotspot:hover::after,#${ROOT_ID} .rf-hotspot:focus-visible::after,#${ROOT_ID} .rf-hotspot.rf-touch-open::after { opacity:1; }
      #${ROOT_ID} .rf-map-tooltip { position:fixed; z-index:99999; display:none; width:min(290px,calc(100vw - 28px)); box-sizing:border-box; padding:14px 15px 13px; border:1px solid rgba(240,43,67,.72); border-radius:5px; color:#f8e9ec; background:linear-gradient(145deg,rgba(45,10,19,.98),rgba(10,7,10,.98)); box-shadow:0 12px 36px rgba(0,0,0,.65),0 0 22px rgba(181,18,43,.25); pointer-events:none; }
      #${ROOT_ID} .rf-map-tooltip.rf-visible { display:block; }
      #${ROOT_ID} .rf-tip-kicker { margin-bottom:5px; color:#ef5368; font-size:9px; font-weight:900; letter-spacing:.2em; text-transform:uppercase; }
      #${ROOT_ID} .rf-tip-title { margin-bottom:10px; font-size:16px; line-height:1.15; font-weight:900; }
      #${ROOT_ID} .rf-tip-stats { display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:8px; color:#d7b9bf; font-size:11px; font-weight:800; }
      #${ROOT_ID} .rf-tip-count { color:#fff; font-variant-numeric:tabular-nums; }
      #${ROOT_ID} .rf-tip-progress { height:6px; overflow:hidden; border-radius:20px; background:#211116; box-shadow:inset 0 1px 3px rgba(0,0,0,.8); }
      #${ROOT_ID} .rf-tip-progress > span { display:block; width:0; height:100%; border-radius:inherit; background:linear-gradient(90deg,#780b22,#e21d3d 75%,#ff5364); box-shadow:0 0 10px rgba(240,43,67,.5); transition:width .25s ease; }
      #${ROOT_ID} .rf-tip-hint { margin-top:8px; color:#a98d94; font-size:10px; }
      #${ROOT_ID} .rf-map-legend { margin-top:10px; text-align:center; color:#9e858b; font-size:10px; letter-spacing:.08em; }
      @media (max-width:600px) {
        #${ROOT_ID} { margin-top:6px; }
        #${ROOT_ID} .rf-map-tooltip { width:min(260px,calc(100vw - 24px)); padding:12px; }
        #${ROOT_ID} .rf-tip-title { font-size:14px; }
        #${ROOT_ID} .rf-map-legend { font-size:9px; }
      }
      @media (prefers-reduced-motion:reduce) {
        #${ROOT_ID} .rf-hotspot,#${ROOT_ID} .rf-hotspot::after,#${ROOT_ID} .rf-tip-progress > span { transition:none !important; }
      }
    `;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.appendChild(document.createTextNode(css));
    (document.head || document.documentElement).appendChild(style);
  }

  function normalizeUrl(url) {
    try { var u = new URL(url, window.location.href); return u.origin + u.pathname.replace(/\/$/, ''); }
    catch (e) { return String(url || '').split('?')[0].replace(/\/$/, ''); }
  }

  function findOriginalRow(task, container) {
    var target = normalizeUrl(task.url);
    var links = container.querySelectorAll('.item a[href], a[href*="/play/safari/"]');
    for (var i = 0; i < links.length; i++) {
      if (normalizeUrl(links[i].href) === target) return links[i].closest('.item') || links[i];
    }
    return null;
  }

  function readProgress(row) {
    if (!row) return { found: null, total: null, percent: 0, label: 'Статистика пока недоступна' };
    var text = (row.innerText || row.textContent || '').replace(/\s+/g, ' ').trim();
    var match = text.match(/(?:найдено\s*)?(\d+)\s*(?:из|\/)\s*(\d+)(?:\s*\+\s*(\d+))?/i) || text.match(/(\d+)\s*\/\s*(\d+)/);
    var found = match ? parseInt(match[1], 10) : null;
    var total = match ? parseInt(match[2], 10) + (parseInt(match[3], 10) || 0) : null;
    var bar = row.querySelector('.progress-bar,[role="progressbar"],.progress > div');
    var percent = 0;
    if (bar) {
      var width = bar.style.width || bar.getAttribute('aria-valuenow') || bar.getAttribute('data-progress') || '';
      if (/%$/.test(width)) percent = parseFloat(width) || 0;
      else if (width !== '') percent = Math.max(0, Math.min(100, parseFloat(width) || 0));
      if (!percent && bar.getAttribute('aria-valuemax')) {
        var now = parseFloat(bar.getAttribute('aria-valuenow')) || 0;
        var max = parseFloat(bar.getAttribute('aria-valuemax')) || 0;
        if (max > 0) percent = now / max * 100;
      }
    }
    if (found !== null && total !== null && total > 0) {
      percent = Math.max(percent, Math.min(100, found / total * 100));
      return { found: found, total: total, percent: percent, label: 'Найдено ' + found + ' из ' + total };
    }
    if (percent > 0) return { found: null, total: null, percent: percent, label: 'Выполнено ' + Math.round(percent) + '%' };
    return { found: null, total: null, percent: 0, label: 'Статистика пока недоступна' };
  }

  function init() {
    if (!document.body || document.getElementById(ROOT_ID)) return;
    // Positive page fingerprint: require the real task list, not merely a matching URL.
    var container = document.querySelector('.container');
    if (!container || !container.querySelector('h1')) return;
    var matchedRows = [];
    for (var i = 0; i < TASKS.length; i++) {
      var row = findOriginalRow(TASKS[i], container);
      if (row) matchedRows.push(row);
    }
    if (matchedRows.length < 3) return;
    addStyles();
    matchedRows.forEach(function (row) {
      if (row.classList && row.classList.contains('item')) row.style.display = 'none';
    });

    var map = document.createElement('section');
    map.id = ROOT_ID;
    map.setAttribute('aria-label', 'Интерактивная карта заданий сезона');
    map.innerHTML = '<div class="rf-map-heading">Ужасная игра сезона · Тематический</div>' +
      '<div class="rf-map-frame"><img class="rf-map-image" src="' + IMAGE_URL + '" alt="Карта города с десятью заданиями" draggable="false"></div>' +
      '<div class="rf-map-legend">Наведите на объект, чтобы увидеть прогресс · Нажмите, чтобы открыть задание</div>';

    var title = container.querySelector('h1');
    if (title && title.parentNode) title.parentNode.insertBefore(map, title.nextSibling);
    else container.insertBefore(map, container.firstChild);

    var frame = map.querySelector('.rf-map-frame');
    var tooltip = document.createElement('div');
    tooltip.className = 'rf-map-tooltip';
    tooltip.setAttribute('role', 'status');
    document.body.appendChild(tooltip);

    function hideTooltip() { tooltip.classList.remove('rf-visible'); }
    function showTooltip(task, hotspot, point) {
      var progress = readProgress(findOriginalRow(task, container));
      tooltip.innerHTML = '<div class="rf-tip-kicker">Задание сезона</div>' +
        '<div class="rf-tip-title"></div>' +
        '<div class="rf-tip-stats"><span>Прогресс кодов</span><span class="rf-tip-count"></span></div>' +
        '<div class="rf-tip-progress"><span></span></div>' +
        '<div class="rf-tip-hint">Нажмите, чтобы перейти к заданию</div>';
      tooltip.querySelector('.rf-tip-title').textContent = task.name;
      tooltip.querySelector('.rf-tip-count').textContent = progress.label;
      tooltip.querySelector('.rf-tip-progress > span').style.width = Math.max(0, Math.min(100, progress.percent)) + '%';
      tooltip.classList.add('rf-visible');
      var rect = hotspot.getBoundingClientRect();
      var x = point && point.clientX ? point.clientX + 14 : rect.left + rect.width / 2;
      var y = point && point.clientY ? point.clientY + 14 : rect.bottom + 10;
      var tw = tooltip.offsetWidth;
      var th = tooltip.offsetHeight;
      if (x + tw > window.innerWidth - 10) x = window.innerWidth - tw - 10;
      if (y + th > window.innerHeight - 10) y = Math.max(10, rect.top - th - 10);
      tooltip.style.left = Math.max(10, x) + 'px';
      tooltip.style.top = Math.max(10, y) + 'px';
    }

    TASKS.forEach(function (task) {
      var hotspot = document.createElement('a');
      hotspot.className = 'rf-hotspot';
      hotspot.href = task.url;
      hotspot.setAttribute('aria-label', task.name + '. Открыть задание');
      hotspot.title = task.name;
      hotspot.style.left = (task.x / IMAGE_WIDTH * 100) + '%';
      hotspot.style.top = (task.y / IMAGE_HEIGHT * 100) + '%';
      hotspot.style.width = (task.w / IMAGE_WIDTH * 100) + '%';
      hotspot.style.height = (task.h / IMAGE_HEIGHT * 100) + '%';
      hotspot.addEventListener('mouseenter', function (event) { showTooltip(task, hotspot, event); });
      hotspot.addEventListener('mousemove', function (event) { showTooltip(task, hotspot, event); });
      hotspot.addEventListener('mouseleave', hideTooltip);
      hotspot.addEventListener('focus', function () { showTooltip(task, hotspot); });
      hotspot.addEventListener('blur', hideTooltip);
      hotspot.addEventListener('click', function (event) {
        if (window.matchMedia && window.matchMedia('(hover: none)').matches && !hotspot.classList.contains('rf-touch-open')) {
          event.preventDefault();
          map.querySelectorAll('.rf-hotspot.rf-touch-open').forEach(function (el) { el.classList.remove('rf-touch-open'); });
          hotspot.classList.add('rf-touch-open');
          showTooltip(task, hotspot);
        }
      });
      frame.appendChild(hotspot);
    });

    document.addEventListener('click', function (event) {
      if (!map.contains(event.target)) {
        map.querySelectorAll('.rf-hotspot.rf-touch-open').forEach(function (el) { el.classList.remove('rf-touch-open'); });
        hideTooltip();
      }
    });

    var image = map.querySelector('.rf-map-image');
    image.addEventListener('error', function () {
      image.alt = 'Не удалось загрузить карту. Проверьте адрес изображения.';
      image.style.background = '#160910';
    });
    if (window.console && console.info) console.info('[RED FOX] Horror season interactive map ready');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})(window, document);
