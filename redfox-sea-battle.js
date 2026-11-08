(function (window, document) {
  'use strict';

  var VERSION = '1.0.2';
  var COLUMNS = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К'];
  var PREFIX = 'rf-sea-battle';
  var processed = Object.create(null);
  var observer = null;

  if (window.RedFoxSeaBattle && window.RedFoxSeaBattle.version === VERSION) return;

  function addStyles() {
    if (document.getElementById(PREFIX + '-styles')) return;
    var style = document.createElement('style');
    style.id = PREFIX + '-styles';
    style.textContent =
      '.rf-sea-wrap{width:100%;max-width:620px;margin:22px auto;padding:16px;background:#101014;border:1px solid rgba(220,35,55,.45);border-radius:12px;color:#f5eeee;box-sizing:border-box;font-family:Arial,sans-serif}' +
      '.rf-sea-title{margin:0 0 6px;text-align:center;font-size:22px;font-weight:800;letter-spacing:2px;color:#f4eeee}' +
      '.rf-sea-subtitle{margin:0 0 14px;text-align:center;color:#b8a5a5;font-size:12px;letter-spacing:1px}' +
      '.rf-sea-grid{display:grid;grid-template-columns:repeat(11,minmax(0,1fr));gap:4px;width:100%}' +
      '.rf-sea-head,.rf-sea-cell{display:flex;align-items:center;justify-content:center;aspect-ratio:1/1;min-width:0;border:1px solid #51434a;border-radius:5px;box-sizing:border-box}' +
      '.rf-sea-head{background:#2a2025;color:#f5dfe4;font-size:clamp(10px,2.5vw,14px);font-weight:800}' +
      '.rf-sea-corner{background:transparent;border-color:transparent}' +
      '.rf-sea-cell{background:#19171b;color:#8e8589;font-size:clamp(10px,2.6vw,15px);font-weight:700;transition:background .2s,border-color .2s,box-shadow .2s}' +
      '.rf-sea-cell.rf-sea-hit{background:#087b43;border-color:#36e58b;color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.18),0 0 10px rgba(20,220,115,.25)}' +
      '.rf-sea-cell.rf-sea-miss{background:#a51227;border-color:#ff5367;color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.12),0 0 10px rgba(255,40,65,.2)}' +
      '.rf-sea-legend{display:flex;justify-content:center;gap:18px;flex-wrap:wrap;margin-top:14px;color:#c9bec1;font-size:12px}' +
      '.rf-sea-legend span{display:inline-flex;align-items:center;gap:6px}' +
      '.rf-sea-dot{width:10px;height:10px;border-radius:3px;display:inline-block}' +
      '.rf-sea-dot-hit{background:#0b9b55}.rf-sea-dot-miss{background:#c21b32}' +
      '@media(max-width:420px){.rf-sea-wrap{padding:10px}.rf-sea-grid{gap:3px;grid-template-columns:repeat(11,minmax(0,1fr))}.rf-sea-head,.rf-sea-cell{border-radius:3px}.rf-sea-title{font-size:18px}}';
    (document.head || document.documentElement).appendChild(style);
  }

  function buildBoard() {
    if (document.getElementById(PREFIX + '-board')) return;
    var task = document.querySelector('.task_text');
    if (!task) return;

    var wrap = document.createElement('section');
    wrap.className = 'rf-sea-wrap';
    wrap.id = PREFIX + '-board';
    wrap.innerHTML = '<h2 class="rf-sea-title">МОРСКОЙ БОЙ</h2>' +
      '<p class="rf-sea-subtitle">ВВОДИ КООРДИНАТЫ В ПОЛЕ КОДА</p>' +
      '<div class="rf-sea-grid" role="grid" aria-label="Игровое поле 10 на 10"></div>' +
      '<div class="rf-sea-legend"><span><i class="rf-sea-dot rf-sea-dot-hit"></i>Попадание</span><span><i class="rf-sea-dot rf-sea-dot-miss"></i>Промах</span></div>';

    var grid = wrap.querySelector('.rf-sea-grid');
    var corner = document.createElement('div');
    corner.className = 'rf-sea-head rf-sea-corner';
    grid.appendChild(corner);

    COLUMNS.forEach(function (letter) {
      var head = document.createElement('div');
      head.className = 'rf-sea-head';
      head.textContent = letter;
      grid.appendChild(head);
    });

    for (var row = 1; row <= 10; row++) {
      var rowHead = document.createElement('div');
      rowHead.className = 'rf-sea-head';
      rowHead.textContent = row;
      grid.appendChild(rowHead);

      COLUMNS.forEach(function (letter) {
        var cell = document.createElement('div');
        cell.className = 'rf-sea-cell';
        cell.id = PREFIX + '-cell-' + letter + row;
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('aria-label', letter + row + ', не открыта');
        grid.appendChild(cell);
      });
    }

    var anchor = task.querySelector('.noCodesTab');
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(wrap, anchor.nextSibling);
    } else {
      task.insertBefore(wrap, task.firstChild);
    }
  }

  function applyKey(raw) {
    var value = String(raw || '').trim();
    var type = '';
    var letter = '';
    var row = '';
    var match = value.match(/sea-(hit|miss)-([АБВГДЕЖЗИК])(10|[1-9])/i);

    if (match) {
      type = match[1].toLowerCase();
      letter = match[2].toUpperCase();
      row = match[3];
    } else {
      match = value.match(/([АБВГДЕЖЗИКабвгдежзик])(10|[1-9])/);
      if (match) {
        letter = match[1].toUpperCase();
        row = match[2];
        type = match[1] === letter ? 'hit' : 'miss';
      } else {
        match = value.match(/([hm])([АБВГДЕЖЗИК])(10|[1-9])/i);
        if (!match) return false;
        type = match[1].toLowerCase() === 'h' ? 'hit' : 'miss';
        letter = match[2].toUpperCase();
        row = match[3];
      }
    }

    var key = type + '-' + letter + row;
    if (processed[key]) return true;

    var cell = document.getElementById(PREFIX + '-cell-' + letter + row);
    if (!cell) return false;

    cell.classList.remove('rf-sea-hit', 'rf-sea-miss');
    cell.classList.add(type === 'hit' ? 'rf-sea-hit' : 'rf-sea-miss');
    cell.setAttribute('aria-label', letter + row + (type === 'hit' ? ', попадание' : ', промах'));
    cell.textContent = type === 'hit' ? '×' : '•';
    processed[key] = true;
    return true;
  }

  function scanComments() {
    var selectors = [
      '.found_codes .rf-found-comment',
      '.found_codes .code',
      '.found-codes .rf-found-comment',
      '.found-codes .code',
      '.task_text .code'
    ];
    var nodes = document.querySelectorAll(selectors.join(','));
    Array.prototype.forEach.call(nodes, function (node) {
      var marker = node.querySelector && node.querySelector('.sTask');
      if (marker) applyKey(marker.textContent);
      applyKey(node.textContent);
    });
  }

  function startObserver() {
    if (observer || !window.MutationObserver || !document.documentElement) return;
    observer = new MutationObserver(function () {
      buildBoard();
      scanComments();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  }

  function init() {
    addStyles();
    buildBoard();
    scanComments();
    startObserver();
  }

  window.RedFoxSeaBattle = {
    version: VERSION,
    refresh: function () {
      buildBoard();
      scanComments();
    },
    applyKey: applyKey
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})(window, document);
