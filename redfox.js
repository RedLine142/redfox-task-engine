/*!
 * RED FOX PLAYER ADDON
 * Version: 1.0.0
 * Unified script replacing the old ForRado42.js include.
 * Existing RED FOX game engine logic is not modified.
 *
 * Included: UI theme + embedded CSS; .style; .sTask/.aTask/.rTask/.pTask;
 * Olympic grids (8/16/32 and reverse); .oTaskInit/.oTask/.oTasks;
 * slider; emoji; randList; nobr; noCodesTab; responsive image maps
 * (when rwdImageMaps is available); hidden success-code triggers.
 * Requires jQuery for the migrated legacy task functions.
 */

(function (window, document) {
  'use strict';
  if (window.RedFoxUI && window.RedFoxUI.version === '1.1.0') return;
  var THEME = {
    background: '#090711', panel: '#171020', panelSoft: '#24142d',
    text: '#fff4fb', muted: '#c6afc5', accent: '#ff2d87',
    accentHover: '#ff62b0', cyan: '#27e8e0', border: '#63305f',
    inputBackground: '#100c18', backgroundImage: '',
    fontFamily: 'Arial, Helvetica, sans-serif'
  };
  function installStylesheet() {
    var style = document.getElementById('rfui-stylesheet');
    if (!style) {
      style = document.createElement('style');
      style.id = 'rfui-stylesheet';
      style.type = 'text/css';
      style.textContent = "\n    :root {\n      --rf6-bg: #090711;\n      --rf6-panel: #171020;\n      --rf6-panel2: #24142d;\n      --rf6-text: #fff4fb;\n      --rf6-muted: #c6afc5;\n      --rf6-pink: #ff2d87;\n      --rf6-pink2: #ff62b0;\n      --rf6-cyan: #27e8e0;\n      --rf6-border: #63305f;\n      --rf6-input: #100c18;\n      --rf6-bg-image: none;\n    }\n\n    body.rfui-ready {\n      background: #090711 !important;\n      background-color: #090711 !important;\n      color: var(--rf6-text) !important;\n      font-family: Arial, Helvetica, sans-serif !important;\n    }\n\n    body.rfui-ready::before {\n      content: \"\";\n      position: fixed;\n      inset: 0;\n      z-index: -1;\n      pointer-events: none;\n      background:\n        radial-gradient(ellipse at 15% 10%, rgba(255,45,135,.20), transparent 38%),\n        radial-gradient(ellipse at 85% 28%, rgba(39,232,224,.13), transparent 36%),\n        linear-gradient(145deg, #090711 0%, #160d20 52%, #080b15 100%);\n    }\n\n    body.rfui-ready.rfui-has-background-image {\n      background-image: linear-gradient(rgba(8,6,16,.72), rgba(8,6,16,.88)), var(--rf6-bg-image) !important;\n      background-position: center top !important;\n      background-size: cover !important;\n      background-attachment: fixed !important;\n      background-repeat: no-repeat !important;\n    }\n\n    .rfui-ready .enter {\n      box-sizing: border-box !important;\n      padding: 12px !important;\n      color: var(--rf6-text) !important;\n      background: linear-gradient(135deg, rgba(35,17,43,.97), rgba(15,13,28,.97)) !important;\n      border: 1px solid rgba(255,45,135,.65) !important;\n      border-bottom: 3px solid var(--rf6-pink) !important;\n      border-radius: 13px !important;\n      box-shadow: 0 0 18px rgba(255,45,135,.17), 0 10px 35px rgba(0,0,0,.45) !important;\n      backdrop-filter: blur(14px);\n    }\n\n    .rfui-ready .enter input,\n    .rfui-ready .enter input[name=\"code\"] {\n      box-sizing: border-box !important;\n      min-height: 46px !important;\n      padding: 11px 14px !important;\n      color: #fff !important;\n      background: #100c18 !important;\n      border: 1px solid #75406e !important;\n      border-radius: 8px !important;\n      outline: none !important;\n      font: inherit !important;\n      box-shadow: inset 0 0 12px rgba(0,0,0,.35) !important;\n    }\n\n    .rfui-ready .enter input:focus {\n      border-color: var(--rf6-cyan) !important;\n      box-shadow: 0 0 0 2px rgba(39,232,224,.17), 0 0 16px rgba(39,232,224,.16) !important;\n    }\n\n    .rfui-ready .enter input::placeholder { color: #a88ca9 !important; }\n\n    .rfui-ready .enter button,\n    .rfui-ready .enter input[type=\"submit\"],\n    .rfui-ready .enter button[type=\"submit\"] {\n      min-height: 46px !important;\n      padding: 10px 22px !important;\n      color: #fff !important;\n      background: linear-gradient(110deg, #ff2384, #c61b9b) !important;\n      border: 1px solid #ff70b5 !important;\n      border-radius: 8px !important;\n      font: inherit !important;\n      font-weight: 800 !important;\n      letter-spacing: .07em !important;\n      text-transform: uppercase !important;\n      cursor: pointer !important;\n      box-shadow: 0 0 16px rgba(255,35,132,.32) !important;\n      transition: .2s ease !important;\n    }\n\n    .rfui-ready .enter button:hover,\n    .rfui-ready .enter input[type=\"submit\"]:hover {\n      background: linear-gradient(110deg, #ff58a4, #e52bb7) !important;\n      box-shadow: 0 0 23px rgba(255,45,135,.55) !important;\n      transform: translateY(-1px);\n    }\n\n    .rfui-ready .tab {\n      box-sizing: border-box !important;\n      color: #c6afc5 !important;\n      background: linear-gradient(180deg, #21142b, #130e1d) !important;\n      border: 1px solid #59305b !important;\n      border-bottom: 2px solid transparent !important;\n      border-radius: 9px 9px 0 0 !important;\n      text-transform: uppercase !important;\n      letter-spacing: .045em !important;\n      font-weight: 700 !important;\n      transition: .2s ease !important;\n    }\n\n    .rfui-ready .tab:hover {\n      color: #fff !important;\n      border-color: var(--rf6-cyan) !important;\n      text-shadow: 0 0 9px rgba(39,232,224,.5) !important;\n    }\n\n    .rfui-ready .tab.active {\n      color: #fff !important;\n      background: linear-gradient(110deg, rgba(255,45,135,.24), rgba(39,232,224,.10)) !important;\n      border: 1px solid var(--rf6-pink) !important;\n      border-bottom: 2px solid var(--rf6-cyan) !important;\n      box-shadow: 0 -4px 18px rgba(255,45,135,.14) !important;\n      text-shadow: 0 0 10px rgba(255,255,255,.28) !important;\n    }\n\n    .rfui-ready .tabcontent {\n      box-sizing: border-box !important;\n      color: var(--rf6-text) !important;\n      background: linear-gradient(145deg, rgba(28,17,38,.97), rgba(12,13,25,.97)) !important;\n      border: 1px solid #59305b !important;\n      border-top: 1px solid rgba(39,232,224,.45) !important;\n      border-radius: 0 0 13px 13px !important;\n      padding: 18px !important;\n      box-shadow: 0 12px 36px rgba(0,0,0,.35), inset 0 1px rgba(255,255,255,.025) !important;\n    }\n\n    .rfui-ready .task_text,\n    .rfui-ready .found-codes,\n    .rfui-ready .hints,\n    .rfui-ready .location-codes {\n      color: var(--rf6-text) !important;\n      line-height: 1.68 !important;\n    }\n\n    .rfui-ready .task_text h1,\n    .rfui-ready .task_text h2,\n    .rfui-ready .task_text h3,\n    .rfui-ready .task_text h4 {\n      color: #fff !important;\n      text-shadow: 0 0 14px rgba(255,45,135,.28) !important;\n      letter-spacing: .025em !important;\n    }\n\n    .rfui-ready .task_text a {\n      color: var(--rf6-cyan) !important;\n      text-decoration-color: rgba(39,232,224,.55) !important;\n    }\n\n    .rfui-ready .task_text a:hover {\n      color: #fff !important;\n      text-shadow: 0 0 10px rgba(39,232,224,.65) !important;\n    }\n\n    .rfui-ready .task_text img {\n      max-width: 100% !important;\n      height: auto !important;\n      border: 1px solid rgba(255,45,135,.35) !important;\n      border-radius: 9px !important;\n      box-shadow: 0 8px 24px rgba(0,0,0,.3) !important;\n    }\n\n    .rfui-ready .task_text blockquote {\n      margin: 14px 0 !important;\n      padding: 12px 15px !important;\n      color: #e9d8e9 !important;\n      background: rgba(255,45,135,.07) !important;\n      border-left: 3px solid var(--rf6-pink) !important;\n      border-radius: 0 8px 8px 0 !important;\n    }\n\n    .rfui-ready .task_text hr {\n      border: 0 !important;\n      border-top: 1px solid rgba(39,232,224,.35) !important;\n      box-shadow: 0 1px 8px rgba(39,232,224,.12) !important;\n    }\n\n    .rfui-ready .task_text table { max-width: 100% !important; border-collapse: collapse !important; }\n    .rfui-ready .task_text td,\n    .rfui-ready .task_text th {\n      border: 1px solid #59305b !important;\n      color: var(--rf6-text) !important;\n      background-color: rgba(18,12,29,.72) !important;\n      padding: 7px !important;\n    }\n\n    .rfui-ready .task_text .myElem {\n      color: var(--rf6-text) !important;\n      background: linear-gradient(145deg, #21142b, #120e1e) !important;\n      border: 1px solid #63305f !important;\n      border-radius: 9px !important;\n    }\n\n    .rfui-ready .task_text .answerEl,\n    .rfui-ready .task_text .rfte-answer { color: var(--rf6-cyan) !important; }\n\n    .rfui-ready .task_text .olymp td {\n      border: 1px solid #63305f !important;\n      background: rgba(255,255,255,.035) !important;\n      color: var(--rf6-text) !important;\n    }\n\n    .rfui-ready .task_text .olymp .up {\n      color: var(--rf6-cyan) !important;\n      text-shadow: 0 0 8px rgba(39,232,224,.4) !important;\n    }\n\n\n    .rfui-ready .fixed-top {\n      background: rgba(9,7,17,.96) !important;\n      border-bottom: 1px solid rgba(255,45,135,.55) !important;\n      box-shadow: 0 5px 28px rgba(0,0,0,.55), 0 1px 14px rgba(255,45,135,.12) !important;\n    }\n\n    .rfui-ready .container,\n    .rfui-ready .container-location {\n      color: var(--rf6-text) !important;\n    }\n\n    .rfui-ready .container-location {\n      background: transparent !important;\n    }\n\n    .rfui-ready .tabs {\n      background: transparent !important;\n    }\n\n    .rfui-ready .tabs > .wrapper {\n      display: flex !important;\n      gap: 7px !important;\n      flex-wrap: wrap !important;\n      border-bottom: 1px solid rgba(39,232,224,.32) !important;\n    }\n\n    .rfui-ready .container-location > h1 {\n      color: #fff !important;\n      font-weight: 800 !important;\n      letter-spacing: .035em !important;\n      text-shadow: 0 0 18px rgba(255,45,135,.42) !important;\n    }\n\n    .rfui-ready .container-location > h1 a {\n      color: var(--rf6-cyan) !important;\n    }\n\n    .rfui-ready .separator {\n      color: var(--rf6-pink) !important;\n    }\n\n    .rfui-ready .tabcontent p,\n    .rfui-ready .tabcontent li,\n    .rfui-ready .tabcontent strong,\n    .rfui-ready .tabcontent em {\n      color: inherit;\n    }\n\n    .rfui-ready .tabcontent.task {\n      min-height: 120px;\n    }\n\n    .rfui-ready .enter .non-fixed-input {\n      display: flex !important;\n      align-items: center !important;\n      gap: 9px !important;\n    }\n\n    .rfui-ready .enter input[name=\"code\"] {\n      flex: 1 1 auto !important;\n    }\n\n    .rfui-ready .tab,\n    .rfui-ready .tabcontent,\n    .rfui-ready .enter {\n      -webkit-backdrop-filter: blur(14px);\n    }\n\n    @media (max-width: 700px) {\n      .rfui-ready .tabcontent { padding: 12px !important; }\n      .rfui-ready .enter { padding: 9px !important; }\n      .rfui-ready .enter input,\n      .rfui-ready .enter input[name=\"code\"] { width: 100% !important; }\n      .rfui-ready .task_text table { display: block !important; max-width: 100% !important; overflow-x: auto !important; }\n    }\n  ";
      (document.head || document.documentElement).appendChild(style);
    }
  }
  function applyTheme(options) {
    var theme = Object.assign({}, THEME, options || {});
    var root = document.documentElement;
    var vars = {
      '--rf6-bg': theme.background, '--rf6-panel': theme.panel,
      '--rf6-panel2': theme.panelSoft, '--rf6-text': theme.text,
      '--rf6-muted': theme.muted, '--rf6-pink': theme.accent,
      '--rf6-pink2': theme.accentHover, '--rf6-cyan': theme.cyan,
      '--rf6-border': theme.border, '--rf6-input': theme.inputBackground,
      '--rf6-font': theme.fontFamily
    };
    Object.keys(vars).forEach(function (key) { root.style.setProperty(key, vars[key]); });
    if (typeof theme.backgroundImage === 'string' && /^https?:\/\//i.test(theme.backgroundImage.trim())) {
      root.style.setProperty('--rf6-bg-image', 'url("' + theme.backgroundImage.trim().replace(/["'<>]/g, '') + '")');
      if (document.body) document.body.classList.add('rfui-has-background-image');
    } else {
      root.style.removeProperty('--rf6-bg-image');
      if (document.body) document.body.classList.remove('rfui-has-background-image');
    }
    return theme;
  }
  function refresh() {
    installStylesheet();
    document.documentElement.classList.add('rfui-ready');
    if (document.body) document.body.classList.add('rfui-ready');
    return true;
  }
  function init() {
    installStylesheet();
    var config = window.RFUI_CONFIG || {};
    applyTheme(config.theme || config);
    refresh();
  }
  window.RedFoxUI = { version: '1.1.0', defaults: Object.assign({}, THEME), applyTheme: applyTheme, refresh: refresh };
  window.RedFox = { version: '1.0.0', defaults: Object.assign({}, THEME), setTheme: applyTheme, refresh: refresh };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
  if (window.MutationObserver && document.documentElement) {
    var observer = new MutationObserver(function () {
      if (!document.getElementById('rfui-stylesheet')) installStylesheet();
      if (!document.documentElement.classList.contains('rfui-ready') ||
          (document.body && !document.body.classList.contains('rfui-ready'))) refresh();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
})(window, document);


(function (window, document, $) {
  'use strict';

  if (!$) {
    console.error('[RED FOX] jQuery is required by redfox-functions.js');
    return;
  }
  if (window.RedFoxFunctions && window.RedFoxFunctions.version) return;

  var initialized = false;

  function addStyle(id, css) {
    if (document.getElementById(id)) return;
    var style = document.createElement('style');
    style.id = id;
    style.type = 'text/css';
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }

  function processCustomStyles() {
    var $styles = $('.task_text .style');
    $styles.each(function (index) {
      var css = $(this).html();
      if (!css) return;
      addStyle('rf-custom-task-style-' + index, css);
      $(this).hide();
    });
  }

  function buildOlympTable(size, reverse) {
    var count = Number(size);
    if (![8, 16, 32].includes(count)) return '';
    var rounds = Math.log2(count);
    var columns = [];
    for (var round = 0; round <= rounds; round++) {
      var cells = [];
      var rowSpan = Math.pow(2, round);
      var sectorCount = count / rowSpan;
      for (var i = 0; i < sectorCount; i++) {
        var sectorNumber;
        if (round === 0) sectorNumber = i + 1;
        else sectorNumber = count + count - (2 * count / rowSpan) + i + 1;
        cells.push({
          id: 'olymp' + sectorNumber,
          label: 'Sector ' + sectorNumber,
          rowspan: rowSpan
        });
      }
      columns.push(cells);
    }

    var html = '<table class="olymp rf-olymp"><tbody>';
    for (var row = 0; row < count; row++) {
      html += '<tr>';
      for (var col = 0; col < columns.length; col++) {
        var sourceCol = reverse ? columns.length - 1 - col : col;
        if (row % Math.pow(2, sourceCol) === 0) {
          var cell = columns[sourceCol][Math.floor(row / Math.pow(2, sourceCol))];
          if (cell) {
            html += '<td id="' + cell.id + '" rowspan="' + cell.rowspan + '">' + cell.label + '</td>';
          }
        }
      }
      html += '</tr>';
    }
    html += '</tbody></table>';
    if (reverse) {
      html = html.replace('<table class="olymp rf-olymp">', '<table class="olymp rf-olymp rf-olymp-reverse">');
    }
    return html;
  }

  function createOlymp(oSize) {
    var reverse = String(oSize).charAt(0) === 'r';
    var size = reverse ? String(oSize).slice(1) : String(oSize);
    var html = buildOlympTable(size, reverse);
    if (!html) {
      console.warn('[RED FOX] Unsupported olymp size:', oSize);
      return false;
    }

    var $target = $('.task_text .oPos').first();
    if (!$target.length) $target = $('.task_text').first();
    if (!$target.length) return false;

    $target.append(html);
    addStyle('rf-olymp-styles',
      '.rf-olymp{border-collapse:collapse;max-width:100%;margin:14px 0}.rf-olymp td{border:1px solid #fff;width:125px;min-width:90px;text-align:center;vertical-align:middle;padding:8px}.rf-olymp img{max-width:100%;height:auto}.rf-olymp .up{color:#0f0;font-weight:bold}.rf-olymp-reverse{direction:ltr}');
    $('.task_text .oTasks li').each(function () {
      var id = $(this).attr('id');
      if (id) $('#olymp' + id).html($(this).html());
    });
    return true;
  }

  function processCodeMarkers() {
    $('.code').each(function () {
      var $code = $(this);
      var $s = $code.find('.sTask').first();
      var $a = $code.find('.aTask').first();
      var $r = $code.find('.rTask').first();

      if ($s.length) {
        var sId = $.trim($s.text());
        $('#s' + sId).css('opacity', '0.1');
        $s.hide();
      }

      if ($a.length) {
        var aId = $.trim($a.text());
        var clone = $code.clone();
        clone.find('.sTask,.aTask,.rTask,.pTask,.oTask').remove();
        var answer = $.trim(clone.text());
        if (aId) $('#a' + aId).text(answer);
        $a.hide();
      }

      if ($r.length) {
        var rId = $.trim($r.text());
        var resultHtml = $r.html() || '';
        var space = resultHtml.indexOf(' ');
        var result = space >= 0 ? resultHtml.slice(space + 1) : resultHtml;
        if (rId) $('#r' + rId).html(result);
        $r.hide();
      }
    });

    $('.code .pTask').each(function () {
      var $marker = $(this);
      $.trim($marker.text()).split(/\s+/).filter(Boolean).forEach(function (id) {
        $('#p' + id).css('opacity', '0.1');
      });
      $marker.hide();
    });
  }

  function processOlympMarkers() {
    var $init = $('.task_text .oTaskInit').first();
    if (!$init.length) return;
    $('.task_text').addClass('nobr');
    createOlymp($.trim($init.text()));
    $init.hide();
    $('.task_text .oTask,.task_text .oTasks').hide();

    $('.code .oTask').each(function () {
      var $marker = $(this);
      var id = $.trim($marker.text());
      var codeText = $.trim($marker.closest('.code').text());
      var split = codeText.indexOf(' ');
      var value = split >= 0 ? codeText.slice(0, split) : codeText;
      var $sector = $('#olymp' + id);
      if ($sector.length) $sector.text(value).addClass('up');
    });
  }

  function processSlider() {
    $('.task_text .slider-container').each(function () {
      var $container = $(this);
      var $slides = $container.find('.slider img');
      var count = $slides.length;
      if (!count) return;
      var current = 0;

      function showSlide(index) {
        current = (index + count) % count;
        $slides.each(function (i) {
          $(this).toggle(i === current);
        });
      }

      $container.find('.prev-button').off('click.redfox').on('click.redfox', function (event) {
        event.preventDefault();
        showSlide(current - 1);
      });
      $container.find('.next-button').off('click.redfox').on('click.redfox', function (event) {
        event.preventDefault();
        showSlide(current + 1);
      });
      showSlide(0);
    });
  }

  function processEmoji() {
    $('.task_text .emoji').each(function () {
      var points = $.trim($(this).text()).split(/\s+/).filter(Boolean);
      var result = '';
      points.forEach(function (point) {
        var code = Number(point);
        if (Number.isInteger(code) && code > 0 && code <= 0x10FFFF) {
          try { result += String.fromCodePoint(code); } catch (error) {}
        }
      });
      if (result) $(this).text(result);
    });
  }

  function processRandomList() {
    $('.task_text .randList').each(function () {
      var $list = $(this);
      var items = $list.find('li').map(function () { return $(this).html(); }).get();
      $list.hide();
      if (!items.length) return;
      var selected = Math.floor(Math.random() * items.length);
      $list.closest('.task_text').find('.rand').first().html(items[selected]);
    });
  }

  function processNoBreak() {
    if ($('.task_text .nobr').length) $('.task_text').addClass('nobr');
  }

  function activateTaskTab() {
    if (!$('.task_text .noCodesTab').length) return;
    $('.tabs .tab,.tab').removeClass('active');
    $('#task').addClass('active');
    $('.tabcontent').removeClass('active');
    $('.tabcontent.task,.task').addClass('active');
  }

  function processImageMaps() {
    if (typeof $.fn.rwdImageMaps !== 'function') return;
    if ($('.task_text map').length) $('img[usemap]').rwdImageMaps();
  }

  function init() {
    if (initialized) return;
    initialized = true;

    addStyle('rf-functions-base-styles', '.task_text .nobr br{display:none}');
    processCustomStyles();
    $('.sTask,.aTask,.rTask,.pTask').hide();
    processCodeMarkers();
    processOlympMarkers();
    processSlider();
    processEmoji();
    processRandomList();
    processNoBreak();
    activateTaskTab();
    processImageMaps();

    if (window.RedFox && typeof window.RedFox.refresh === 'function') {
      window.RedFox.refresh();
    }
    $(document).trigger('redfox:functions-ready');
  }

  var api = {
    version: '1.0.0',
    init: init,
    refresh: function () { initialized = false; init(); },
    createOlymp: createOlymp
  };

  window.RedFoxFunctions = api;
  window.createOlymp = createOlymp;

  if (document.readyState === 'loading') {
    $(init);
  } else {
    init();
  }
})(window, document, window.jQuery || window.$);


(function (window, document) {
  'use strict';
  if (window.RedFoxTriggers && window.RedFoxTriggers.version) return;

  var handlers = Object.create(null), processed = new WeakMap(), observer = null;
  var lastTrigger = null, started = false;

  function normalize(value) {
    return String(value == null ? '' : value).replace(/\\s+/g, ' ').trim().toLocaleLowerCase();
  }
  function addHiddenMarkerStyle() {
    if (document.getElementById('rf-trigger-marker-style')) return;
    var style = document.createElement('style');
    style.id = 'rf-trigger-marker-style';
    style.textContent = '.sTask{display:none!important;visibility:hidden!important}';
    (document.head || document.documentElement).appendChild(style);
  }
  function run(marker, context) {
    var list = handlers[marker];
    if (list && list.length) list.slice().forEach(function (handler) {
      try { handler(context); }
      catch (error) { console.error('[RED FOX] Trigger error (' + context.marker + '):', error); }
    });
    document.dispatchEvent(new CustomEvent('redfox:trigger', { detail: context }));
  }
  function inspect(message) {
    if (!message || message.nodeType !== 1 || message.id !== 'message') return;
    if (!message.classList.contains('success')) return;
    var markers = message.querySelectorAll('.sTask');
    if (!markers.length) return;
    var seen = processed.get(message);
    if (!seen) { seen = Object.create(null); processed.set(message, seen); }
    Array.prototype.forEach.call(markers, function (node) {
      var raw = (node.textContent || '').replace(/\\s+/g, ' ').trim();
      var key = normalize(raw);
      if (!key || seen[key]) return;
      seen[key] = true;
      var context = {
        marker: raw,
        normalizedMarker: key,
        message: (message.textContent || '').replace(/\\s+/g, ' ').trim(),
        messageElement: message,
        markerElement: node,
        timestamp: Date.now()
      };
      lastTrigger = context;
      console.info('[RED FOX] Successful code marker:', raw);
      run(key, context);
    });
  }
  function scan(root) {
    root = root || document;
    if (root.nodeType === 1 && root.id === 'message') inspect(root);
    if (root.querySelectorAll) Array.prototype.forEach.call(root.querySelectorAll('#message'), inspect);
  }
  function start() {
    if (started) { scan(document); return; }
    started = true;
    addHiddenMarkerStyle();
    scan(document);
    if (!window.MutationObserver) return;
    observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === 'attributes') {
          if (mutation.target && mutation.target.id === 'message') inspect(mutation.target);
          return;
        }
        if (mutation.type === 'characterData') {
          var parent = mutation.target.parentElement;
          var message = parent && parent.closest ? parent.closest('#message') : null;
          if (message) inspect(message);
          return;
        }
        Array.prototype.forEach.call(mutation.addedNodes, function (node) {
          if (node.nodeType === 1) {
            scan(node);
            var message = node.closest ? node.closest('#message') : null;
            if (message) inspect(message);
          } else if (node.nodeType === 3 && node.parentElement) {
            var containing = node.parentElement.closest ? node.parentElement.closest('#message') : null;
            if (containing) inspect(containing);
          }
        });
      });
    });
    observer.observe(document.documentElement, {
      childList: true, subtree: true, characterData: true,
      attributes: true, attributeFilter: ['class']
    });
  }
  function on(marker, callback) {
    var key = normalize(marker);
    if (!key) throw new Error('RED FOX: marker must not be empty');
    if (typeof callback !== 'function') throw new TypeError('RED FOX: callback must be a function');
    if (!handlers[key]) handlers[key] = [];
    handlers[key].push(callback);
    return function () {
      var list = handlers[key];
      if (!list) return;
      var index = list.indexOf(callback);
      if (index !== -1) list.splice(index, 1);
      if (!list.length) delete handlers[key];
    };
  }
  var api = {
    version: '1.0.0',
    on: on,
    scan: function () { scan(document); },
    refresh: function () { addHiddenMarkerStyle(); scan(document); },
    getLastTrigger: function () { return lastTrigger; }
  };
  window.RedFoxTriggers = api;
  window.RedFoxAddon = window.RedFoxAddon || {};
  window.RedFoxAddon.version = '1.0.0';
  window.RedFoxAddon.refresh = function () {
    if (window.RedFoxUI && window.RedFoxUI.refresh) window.RedFoxUI.refresh();
    if (window.RedFoxFunctions && window.RedFoxFunctions.refresh) window.RedFoxFunctions.refresh();
    api.refresh();
  };
  var configured = window.RF_TASK_ACTIONS || {};
  Object.keys(configured).forEach(function (marker) {
    if (typeof configured[marker] === 'function') on(marker, configured[marker]);
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})(window, document);
