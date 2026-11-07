(function (window, document) {
  'use strict';

  if (window.RedFoxUI && window.RedFoxUI.version) return;

  var defaults = {
    background: '#101216',
    panel: '#191d24',
    panelSoft: '#202630',
    text: '#f1f3f5',
    muted: '#a6adb8',
    accent: '#e53935',
    accentHover: '#ff514b',
    border: '#343b46',
    inputBackground: '#11151b',
    backgroundImage: ''
  };

  function validImageUrl(value) {
    return typeof value === 'string' && /^https?:\/\//i.test(value.trim());
  }

  function applyTheme(options) {
    var theme = Object.assign({}, defaults, options || {});
    var root = document.documentElement;
    var properties = {
      '--rfui-bg': theme.background,
      '--rfui-panel': theme.panel,
      '--rfui-panel-soft': theme.panelSoft,
      '--rfui-text': theme.text,
      '--rfui-muted': theme.muted,
      '--rfui-accent': theme.accent,
      '--rfui-accent-hover': theme.accentHover,
      '--rfui-border': theme.border,
      '--rfui-input-bg': theme.inputBackground
    };

    Object.keys(properties).forEach(function (name) {
      root.style.setProperty(name, properties[name]);
    });

    if (validImageUrl(theme.backgroundImage)) {
      root.style.setProperty('--rfui-bg-image', 'url("' + theme.backgroundImage.trim().replace(/["\\\\]/g, '') + '")');
      root.classList.add('rfui-has-background-image');
    } else {
      root.style.removeProperty('--rfui-bg-image');
      root.classList.remove('rfui-has-background-image');
    }

    document.body.classList.add('rfui-ready');
    return theme;
  }

  function refresh() {
    if (document.body) document.body.classList.add('rfui-ready');
  }

  function init() {
    var config = window.RFUI_CONFIG || {};
    applyTheme(config.theme || config);
    refresh();
  }

  window.RedFoxUI = {
    version: '1.0.0',
    defaults: Object.assign({}, defaults),
    applyTheme: applyTheme,
    refresh: refresh
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})(window, document);
