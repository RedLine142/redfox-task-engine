/* RED FOX — HORROR SEASON MAP v1.2.0
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
      '#' + ROOT_ID + ' .rf-hotspot{position:absolute;z-index:2;display:block;padding:0;margin:0;border:1px solid transparent;border-radius:5px;background:rgba(240,43,67,0);cursor:pointer;transition:transform .2s ease,background .2s ease,border-color .2s ease,box-shadow .2s ease}',
      '#' + ROOT_ID + ' .rf-hotspot:hover,' + '#' + ROOT_ID + ' .rf-hotspot:focus-visible,' + '#' + ROOT_ID + ' .rf-hotspot.rf-touch-open{z-index:5;transform:scale(1.035);border-color:rgba(255,92,112,.95);background:rgba(240,43,67,.13);box-shadow:0 0 0 2px rgba(240,43,67,.2),0 0 22px rgba(240,43,67,.5);outline:none}',
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

      img.onload = function() {
        if (!map.parentNode || !document.body.contains(map)) return;
        map.classList.add('rf-ready');
        rows.forEach(function(r){ r.style.display = 'none'; });
      };
      img.onerror = function() {
        if (map.parentNode) map.parentNode.removeChild(map);
        var st = document.getElementById(STYLE_ID);
        if (st && st.parentNode) st.parentNode.removeChild(st);
      };
      img.src = IMAGE_URL;
      if (img.complete && img.naturalWidth > 0) img.onload();
    } catch (err) {
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