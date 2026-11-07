(function (window, document) {
  'use strict';

  if (window.RedFox && window.RedFox.version) return;

  var DEFAULT_THEME = {
    background: '#101216',
    panel: '#191d24',
    panelSoft: '#202630',
    text: '#f1f3f5',
    muted: '#a6adb8',
    accent: '#e53935',
    accentHover: '#ff514b',
    border: '#343b46',
    inputBackground: '#11151b',
    backgroundImage: '',
    fontFamily: 'Arial, Helvetica, sans-serif'
  };

  var CSS = \`
    :root {
      --rfui-bg: #101216;
      --rfui-panel: #191d24;
      --rfui-panel-soft: #202630;
      --rfui-text: #f1f3f5;
      --rfui-muted: #a6adb8;
      --rfui-accent: #e53935;
      --rfui-accent-hover: #ff514b;
      --rfui-border: #343b46;
      --rfui-input-bg: #11151b;
      --rfui-bg-image: none;
      --rfui-font: Arial, Helvetica, sans-serif;
    }

    body.rfui-ready {
      background-color: var(--rfui-bg);
      color: var(--rfui-text);
      font-family: var(--rfui-font);
    }

    body.rfui-ready.rfui-has-background-image {
      background-image: linear-gradient(rgba(10,12,16,.88), rgba(10,12,16,.94)), var(--rfui-bg-image);
      background-position: center top;
      background-size: cover;
      background-attachment: fixed;
      background-repeat: no-repeat;
    }

    .rfui-ready .enter {
      box-sizing: border-box;
      z-index: 1000;
      padding: 10px;
      color: var(--rfui-text);
      background: rgba(20,23,29,.96);
      border: 1px solid var(--rfui-border);
      border-bottom: 2px solid var(--rfui-accent);
      border-radius: 9px;
      box-shadow: 0 8px 24px rgba(0,0,0,.28);
      backdrop-filter: blur(12px);
    }

    .rfui-ready .enter input[type="text"],
    .rfui-ready .enter input[name="code"],
    .rfui-ready .enter input:not([type]),
    .rfui-ready .enter input[type="search"] {
      box-sizing: border-box;
      min-width: 0;
      min-height: 42px;
      padding: 10px 13px;
      color: var(--rfui-text);
      background: var(--rfui-input-bg);
      border: 1px solid var(--rfui-border);
      border-radius: 7px;
      outline: none;
      font: inherit;
      transition: border-color .18s ease, box-shadow .18s ease;
    }

    .rfui-ready .enter input:focus {
      border-color: var(--rfui-accent);
      box-shadow: 0 0 0 3px rgba(229,57,53,.16);
    }

    .rfui-ready .enter input::placeholder { color: var(--rfui-muted); opacity: .85; }

    .rfui-ready .enter button,
    .rfui-ready .enter input[type="submit"],
    .rfui-ready .enter button[type="submit"] {
      min-height: 42px;
      padding: 9px 18px;
      color: #fff;
      background: var(--rfui-accent);
      border: 1px solid var(--rfui-accent);
      border-radius: 7px;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
      transition: background .18s ease, border-color .18s ease, transform .18s ease, box-shadow .18s ease;
    }

    .rfui-ready .enter button:hover,
    .rfui-ready .enter input[type="submit"]:hover {
      background: var(--rfui-accent-hover);
      border-color: var(--rfui-accent-hover);
      box-shadow: 0 5px 16px rgba(229,57,53,.24);
    }

    .rfui-ready .enter button:active,
    .rfui-ready .enter input[type="submit"]:active { transform: translateY(1px); }

    .rfui-ready .tab {
      box-sizing: border-box;
      color: var(--rfui-muted);
      background: var(--rfui-panel);
      border: 1px solid var(--rfui-border);
      border-bottom: 2px solid transparent;
      border-radius: 8px 8px 0 0;
      transition: color .18s ease, background .18s ease, border-color .18s ease;
    }

    .rfui-ready .tab:hover { color: var(--rfui-text); background: var(--rfui-panel-soft); }

    .rfui-ready .tab.active {
      color: #fff;
      background: var(--rfui-panel-soft);
      border-bottom-color: var(--rfui-accent);
    }

    .rfui-ready .tabcontent {
      box-sizing: border-box;
      color: var(--rfui-text);
      background: rgba(25,29,36,.94);
      border: 1px solid var(--rfui-border);
      border-radius: 0 0 10px 10px;
      padding: 16px;
      box-shadow: 0 8px 24px rgba(0,0,0,.12);
    }

    .rfui-ready .task_text { color: var(--rfui-text); line-height: 1.65; overflow-wrap: anywhere; }
    .rfui-ready .task_text h1,
    .rfui-ready .task_text h2,
    .rfui-ready .task_text h3,
    .rfui-ready .task_text h4 { color: #fff; line-height: 1.3; }

    .rfui-ready .task_text a {
      color: var(--rfui-accent-hover);
      text-decoration-color: rgba(255,81,75,.45);
    }

    .rfui-ready .task_text img { max-width: 100%; height: auto; border-radius: 7px; }

    .rfui-ready .task_text blockquote {
      margin: 14px 0;
      padding: 10px 14px;
      color: var(--rfui-muted);
      background: rgba(255,255,255,.035);
      border-left: 3px solid var(--rfui-accent);
      border-radius: 0 7px 7px 0;
    }

    .rfui-ready .task_text hr { border: 0; border-top: 1px solid var(--rfui-border); }
    .rfui-ready .task_text table { max-width: 100%; border-collapse: collapse; }
    .rfui-ready .task_text td,
    .rfui-ready .task_text th { border-color: var(--rfui-border); }

    .rfui-ready .found-codes,
    .rfui-ready .hints,
    .rfui-ready .location-codes { color: var(--rfui-text); }

    .rfui-ready .found-codes > *,
    .rfui-ready .hints > *,
    .rfui-ready .location-codes > * { color: inherit; }

    .rfui-ready .task_text .myElem {
      background: var(--rfui-panel);
      border-color: var(--rfui-border);
      border-radius: 8px;
    }

    .rfui-ready .task_text .myElem.rfte-solved { border-color: #315c42; }
    .rfui-ready .task_text .answerEl,
    .rfui-ready .task_text .rfte-answer { color: #75dfa0; }

    .rfui-ready .task_text .olymp td {
      border: 1px solid var(--rfui-border);
      background: rgba(255,255,255,.025);
      color: var(--rfui-text);
    }

    .rfui-ready .task_text .olymp .up { color: #75dfa0; }

    @media (max-width: 700px) {
      .rfui-ready .tabcontent { padding: 12px; }
      .rfui-ready .enter { padding: 8px; }
      .rfui-ready .enter input[type="text"],
      .rfui-ready .enter input[name="code"],
      .rfui-ready .enter input:not([type]),
      .rfui-ready .enter input[type="search"] { width: 100%; }
      .rfui-ready .enter button,
      .rfui-ready .enter input[type="submit"] { min-width: 96px; }
      .rfui-ready .task_text table { display: block; max-width: 100%; overflow-x: auto; }
    }

    @media (prefers-reduced-motion: reduce) {
      .rfui-ready *, .rfui-ready *::before, .rfui-ready *::after {
        scroll-behavior: auto !important;
        transition-duration: .01ms !important;
        animation-duration: .01ms !important;
        animation-iteration-count: 1 !important;
      }
    }
  \`;

  function addStyles() {
    if (document.getElementById('rfui-styles')) return;
    var style = document.createElement('style');
    style.id = 'rfui-styles';
    style.type = 'text/css';
    style.appendChild(document.createTextNode(CSS));
    (document.head || document.documentElement).appendChild(style);
  }

  function setTheme(options) {
    var theme = Object.assign({}, DEFAULT_THEME, options || {});
    var root = document.documentElement;
    var vars = {
      '--rfui-bg': theme.background,
      '--rfui-panel': theme.panel,
      '--rfui-panel-soft': theme.panelSoft,
      '--rfui-text': theme.text,
      '--rfui-muted': theme.muted,
      '--rfui-accent': theme.accent,
      '--rfui-accent-hover': theme.accentHover,
      '--rfui-border': theme.border,
      '--rfui-input-bg': theme.inputBackground,
      '--rfui-font': theme.fontFamily
    };

    Object.keys(vars).forEach(function (key) {
      root.style.setProperty(key, vars[key]);
    });

    if (typeof theme.backgroundImage === 'string' &&
        /^https?:\/\/[^\s"'<>]+$/i.test(theme.backgroundImage.trim())) {
      root.style.setProperty('--rfui-bg-image', 'url("' + theme.backgroundImage.trim() + '")');
      if (document.body) document.body.classList.add('rfui-has-background-image');
    } else {
      root.style.removeProperty('--rfui-bg-image');
      if (document.body) document.body.classList.remove('rfui-has-background-image');
    }

    return theme;
  }

  function init() {
    addStyles();

    var isPlayerPage = !!(
      document.querySelector('form.enter') ||
      document.querySelector('.tabcontent') ||
      document.querySelector('.task_text')
    );

    if (!isPlayerPage) return;

    var config = window.RFUI_CONFIG || {};
    setTheme(config.theme || config);
    document.body.classList.add('rfui-ready');
  }

  window.RedFox = {
    version: '0.1.0',
    setTheme: setTheme,
    refresh: function () {
      addStyles();
      if (document.body) document.body.classList.add('rfui-ready');
    },
    defaults: Object.assign({}, DEFAULT_THEME)
  };

  window.RedFoxUI = window.RedFoxUI || {
    version: '0.1.0',
    applyTheme: setTheme,
    refresh: window.RedFox.refresh,
    defaults: Object.assign({}, DEFAULT_THEME)
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})(window, document);
