(function (window, document) {
  'use strict';

  var path = window.location && window.location.pathname ? window.location.pathname : '';
  var isPlayerPage = /^\/play\/safari(?:\/|$)/i.test(path);

  if (!isPlayerPage) {
    document.documentElement.classList.remove('rfui-ready');
    if (document.body) document.body.classList.remove('rfui-ready', 'rfui-has-background-image');
    var oldSheet = document.getElementById('rfui-stylesheet');
    if (oldSheet && oldSheet.parentNode) oldSheet.parentNode.removeChild(oldSheet);
    return;
  }

  if (window.RedFoxUI && window.RedFoxUI.version === '1.6.3-found-codes-table') return;

  var THEME = {
    background: '#080608',
    panel: 'rgba(18, 14, 15, .97)',
    panelSoft: 'rgba(62, 13, 18, .94)',
    text: '#f4eeee',
    muted: '#b8a5a0',
    accent: '#a30e24',
    accentHover: '#ff4b24',
    cyan: '#f28a24',
    border: 'rgba(190, 35, 35, .42)',
    inputBackground: '#100c0c',
    backgroundImage: '',
    fontFamily: '"Arial Narrow", "Roboto Condensed", Arial, sans-serif'
  };

  function installStylesheet() {
    var link = document.getElementById('rfui-stylesheet');
    if (!link) {
      link = document.createElement('link');
      link.id = 'rfui-stylesheet';
      link.rel = 'stylesheet';
      (document.head || document.documentElement).appendChild(link);
    }
    link.href = 'https://cdn.jsdelivr.net/gh/RedLine142/redfox-task-engine@61df02acd4d121ca290a0926ff4f1443e5dedec2/redfox-ui.css';
  }

  function applyTheme(options) {
    var theme = Object.assign({}, THEME, options || {});
    var root = document.documentElement;
    var vars = {
      '--rf6-bg': theme.background,
      '--rf6-panel': theme.panel,
      '--rf6-panel2': theme.panelSoft,
      '--rf6-text': theme.text,
      '--rf6-muted': theme.muted,
      '--rf6-pink': theme.accent,
      '--rf6-pink2': theme.accentHover,
      '--rf6-cyan': theme.cyan,
      '--rf6-border': theme.border,
      '--rf6-input': theme.inputBackground,
      '--rf6-font': theme.fontFamily
    };

    Object.keys(vars).forEach(function (key) {
      root.style.setProperty(key, vars[key]);
    });

    if (typeof theme.backgroundImage === 'string' &&
        /^https?:\/\//i.test(theme.backgroundImage.trim())) {
      root.style.setProperty(
        '--rf6-bg-image',
        'url("' + theme.backgroundImage.trim().replace(/["'<>]/g, '') + '")'
      );
      if (document.body) document.body.classList.add('rfui-has-background-image');
    } else {
      root.style.removeProperty('--rf6-bg-image');
      if (document.body) document.body.classList.remove('rfui-has-background-image');
    }

    return theme;
  }

  function syncMobileCodeHeader() {
    if (!document.body || !window.matchMedia || !window.matchMedia('(max-width: 700px)').matches) {
      var desktopHeader = document.querySelector('.fixed-top');
      var desktopContent = document.querySelector('.container-location');
      if (desktopHeader) desktopHeader.style.removeProperty('height');
      if (desktopContent) desktopContent.style.removeProperty('margin-top');
      return;
    }

    var header = document.querySelector('.fixed-top');
    var content = document.querySelector('.container-location');
    if (!header || !content) return;

    header.style.removeProperty('height');
    var requiredHeight = Math.ceil(header.scrollHeight);
    if (!requiredHeight) return;

    header.style.setProperty('height', requiredHeight + 'px', 'important');
    header.style.setProperty('bottom', 'auto', 'important');
    content.style.setProperty('margin-top', requiredHeight + 'px', 'important');
  }


  function formatFoundCodes() {
    if (!isPlayerPage) return;
    var lists = document.querySelectorAll('.found-codes ul.found_codes, .found-codes .found_codes');
    lists.forEach(function (list) {
      if (!list.querySelector('.rf-found-codes-head')) {
        var head = document.createElement('div');
        head.className = 'rf-found-codes-head';
        head.innerHTML =
          '<span>ТИП</span>' +
          '<span>КОД</span>' +
          '<span>КОММЕНТАРИЙ</span>';
        list.parentNode.insertBefore(head, list);
      }

      Array.prototype.forEach.call(list.querySelectorAll('li'), function (item) {
        if (item.getAttribute('data-rf-codes-formatted') === '1') return;
        var typeSource = item.querySelector('.class');
        var codeSource = item.querySelector('.code');
        if (!typeSource || !codeSource) return;

        var typeText = (typeSource.textContent || '').trim();
        var combined = (codeSource.textContent || '').trim();
        if (!combined) return;

        var splitAt = combined.search(/\\s/);
        var codeText = splitAt < 0 ? combined : combined.slice(0, splitAt);
        var commentText = splitAt < 0 ? '' : combined.slice(splitAt).trim();

        var typeCell = document.createElement('span');
        typeCell.className = 'class rf-found-type';
        typeCell.textContent = typeText;

        var codeCell = document.createElement('span');
        codeCell.className = 'code rf-found-value';
        codeCell.textContent = codeText;

        var commentCell = document.createElement('span');
        commentCell.className = 'rf-found-comment';
        commentCell.textContent = commentText || '—';

        item.textContent = '';
        item.appendChild(typeCell);
        item.appendChild(codeCell);
        item.appendChild(commentCell);
        item.setAttribute('data-rf-codes-formatted', '1');
      });
    });
  }


  function refresh() {
    installStylesheet();
    document.documentElement.classList.add('rfui-ready');
    if (document.body) document.body.classList.add('rfui-ready');
    syncMobileCodeHeader();
    formatFoundCodes();
    return true;
  }

  function init() {
    if (!isPlayerPage || !document.body) return;
    installStylesheet();
    var config = window.RFUI_CONFIG || {};
    applyTheme(config.theme || config);
    refresh();
  }

  window.RedFoxUI = {
    version: '1.6.3-found-codes-table',
    defaults: Object.assign({}, THEME),
    applyTheme: applyTheme,
    refresh: refresh
  };
  window.RedFox = {
    version: '1.4.0',
    defaults: Object.assign({}, THEME),
    setTheme: applyTheme,
    refresh: refresh
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  window.addEventListener('resize', syncMobileCodeHeader, { passive: true });

  if (window.MutationObserver && document.documentElement) {
    var observer = new MutationObserver(function () {
      if (!isPlayerPage) return;
      if (!document.getElementById('rfui-stylesheet')) installStylesheet();
      formatFoundCodes();
      if (!document.documentElement.classList.contains('rfui-ready') ||
          (document.body && !document.body.classList.contains('rfui-ready'))) {
        refresh();
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
})(window, document);