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

  if (window.RedFoxUI && window.RedFoxUI.version === '1.5.1-halloween') return;

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
    link.href = 'https://cdn.jsdelivr.net/gh/RedLine142/redfox-task-engine@2ad802042b4e66376ccc0ce328fcc05ca12a1c3b/redfox-ui.css';
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

  function refresh() {
    installStylesheet();
    document.documentElement.classList.add('rfui-ready');
    if (document.body) document.body.classList.add('rfui-ready');
    syncMobileCodeHeader();
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
    version: '1.5.1-halloween',
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
      if (!document.documentElement.classList.contains('rfui-ready') ||
          (document.body && !document.body.classList.contains('rfui-ready'))) {
        refresh();
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
})(window, document);