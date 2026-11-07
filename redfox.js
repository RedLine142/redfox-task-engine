(function (window, document) {
  'use strict';

  if (window.RedFox && window.RedFox.version === '0.2.0') return;

  var THEME = {
    background: '#090711',
    panel: '#171020',
    panelSoft: '#24142d',
    text: '#fff4fb',
    muted: '#c6afc5',
    accent: '#ff2d87',
    accentHover: '#ff62b0',
    cyan: '#27e8e0',
    border: '#63305f',
    inputBackground: '#100c18',
    backgroundImage: '',
    fontFamily: 'Arial, Helvetica, sans-serif'
  };

  var CSS = `
    :root {
      --rf6-bg: #090711;
      --rf6-panel: #171020;
      --rf6-panel2: #24142d;
      --rf6-text: #fff4fb;
      --rf6-muted: #c6afc5;
      --rf6-pink: #ff2d87;
      --rf6-pink2: #ff62b0;
      --rf6-cyan: #27e8e0;
      --rf6-border: #63305f;
      --rf6-input: #100c18;
      --rf6-bg-image: none;
    }

    body.rfui-ready {
      background: #090711 !important;
      background-color: #090711 !important;
      color: var(--rf6-text) !important;
      font-family: Arial, Helvetica, sans-serif !important;
    }

    body.rfui-ready::before {
      content: "";
      position: fixed;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      background:
        radial-gradient(ellipse at 15% 10%, rgba(255,45,135,.20), transparent 38%),
        radial-gradient(ellipse at 85% 28%, rgba(39,232,224,.13), transparent 36%),
        linear-gradient(145deg, #090711 0%, #160d20 52%, #080b15 100%);
    }

    body.rfui-ready.rfui-has-background-image {
      background-image: linear-gradient(rgba(8,6,16,.72), rgba(8,6,16,.88)), var(--rf6-bg-image) !important;
      background-position: center top !important;
      background-size: cover !important;
      background-attachment: fixed !important;
      background-repeat: no-repeat !important;
    }

    .rfui-ready .enter {
      box-sizing: border-box !important;
      padding: 12px !important;
      color: var(--rf6-text) !important;
      background: linear-gradient(135deg, rgba(35,17,43,.97), rgba(15,13,28,.97)) !important;
      border: 1px solid rgba(255,45,135,.65) !important;
      border-bottom: 3px solid var(--rf6-pink) !important;
      border-radius: 13px !important;
      box-shadow: 0 0 18px rgba(255,45,135,.17), 0 10px 35px rgba(0,0,0,.45) !important;
      backdrop-filter: blur(14px);
    }

    .rfui-ready .enter input,
    .rfui-ready .enter input[name="code"] {
      box-sizing: border-box !important;
      min-height: 46px !important;
      padding: 11px 14px !important;
      color: #fff !important;
      background: #100c18 !important;
      border: 1px solid #75406e !important;
      border-radius: 8px !important;
      outline: none !important;
      font: inherit !important;
      box-shadow: inset 0 0 12px rgba(0,0,0,.35) !important;
    }

    .rfui-ready .enter input:focus {
      border-color: var(--rf6-cyan) !important;
      box-shadow: 0 0 0 2px rgba(39,232,224,.17), 0 0 16px rgba(39,232,224,.16) !important;
    }

    .rfui-ready .enter input::placeholder { color: #a88ca9 !important; }

    .rfui-ready .enter button,
    .rfui-ready .enter input[type="submit"],
    .rfui-ready .enter button[type="submit"] {
      min-height: 46px !important;
      padding: 10px 22px !important;
      color: #fff !important;
      background: linear-gradient(110deg, #ff2384, #c61b9b) !important;
      border: 1px solid #ff70b5 !important;
      border-radius: 8px !important;
      font: inherit !important;
      font-weight: 800 !important;
      letter-spacing: .07em !important;
      text-transform: uppercase !important;
      cursor: pointer !important;
      box-shadow: 0 0 16px rgba(255,35,132,.32) !important;
      transition: .2s ease !important;
    }

    .rfui-ready .enter button:hover,
    .rfui-ready .enter input[type="submit"]:hover {
      background: linear-gradient(110deg, #ff58a4, #e52bb7) !important;
      box-shadow: 0 0 23px rgba(255,45,135,.55) !important;
      transform: translateY(-1px);
    }

    .rfui-ready .tab {
      box-sizing: border-box !important;
      color: #c6afc5 !important;
      background: linear-gradient(180deg, #21142b, #130e1d) !important;
      border: 1px solid #59305b !important;
      border-bottom: 2px solid transparent !important;
      border-radius: 9px 9px 0 0 !important;
      text-transform: uppercase !important;
      letter-spacing: .045em !important;
      font-weight: 700 !important;
      transition: .2s ease !important;
    }

    .rfui-ready .tab:hover {
      color: #fff !important;
      border-color: var(--rf6-cyan) !important;
      text-shadow: 0 0 9px rgba(39,232,224,.5) !important;
    }

    .rfui-ready .tab.active {
      color: #fff !important;
      background: linear-gradient(110deg, rgba(255,45,135,.24), rgba(39,232,224,.10)) !important;
      border: 1px solid var(--rf6-pink) !important;
      border-bottom: 2px solid var(--rf6-cyan) !important;
      box-shadow: 0 -4px 18px rgba(255,45,135,.14) !important;
      text-shadow: 0 0 10px rgba(255,255,255,.28) !important;
    }

    .rfui-ready .tabcontent {
      box-sizing: border-box !important;
      color: var(--rf6-text) !important;
      background: linear-gradient(145deg, rgba(28,17,38,.97), rgba(12,13,25,.97)) !important;
      border: 1px solid #59305b !important;
      border-top: 1px solid rgba(39,232,224,.45) !important;
      border-radius: 0 0 13px 13px !important;
      padding: 18px !important;
      box-shadow: 0 12px 36px rgba(0,0,0,.35), inset 0 1px rgba(255,255,255,.025) !important;
    }

    .rfui-ready .task_text,
    .rfui-ready .found-codes,
    .rfui-ready .hints,
    .rfui-ready .location-codes {
      color: var(--rf6-text) !important;
      line-height: 1.68 !important;
    }

    .rfui-ready .task_text h1,
    .rfui-ready .task_text h2,
    .rfui-ready .task_text h3,
    .rfui-ready .task_text h4 {
      color: #fff !important;
      text-shadow: 0 0 14px rgba(255,45,135,.28) !important;
      letter-spacing: .025em !important;
    }

    .rfui-ready .task_text a {
      color: var(--rf6-cyan) !important;
      text-decoration-color: rgba(39,232,224,.55) !important;
    }

    .rfui-ready .task_text a:hover {
      color: #fff !important;
      text-shadow: 0 0 10px rgba(39,232,224,.65) !important;
    }

    .rfui-ready .task_text img {
      max-width: 100% !important;
      height: auto !important;
      border: 1px solid rgba(255,45,135,.35) !important;
      border-radius: 9px !important;
      box-shadow: 0 8px 24px rgba(0,0,0,.3) !important;
    }

    .rfui-ready .task_text blockquote {
      margin: 14px 0 !important;
      padding: 12px 15px !important;
      color: #e9d8e9 !important;
      background: rgba(255,45,135,.07) !important;
      border-left: 3px solid var(--rf6-pink) !important;
      border-radius: 0 8px 8px 0 !important;
    }

    .rfui-ready .task_text hr {
      border: 0 !important;
      border-top: 1px solid rgba(39,232,224,.35) !important;
      box-shadow: 0 1px 8px rgba(39,232,224,.12) !important;
    }

    .rfui-ready .task_text table { max-width: 100% !important; border-collapse: collapse !important; }
    .rfui-ready .task_text td,
    .rfui-ready .task_text th {
      border: 1px solid #59305b !important;
      color: var(--rf6-text) !important;
      background-color: rgba(18,12,29,.72) !important;
      padding: 7px !important;
    }

    .rfui-ready .task_text .myElem {
      color: var(--rf6-text) !important;
      background: linear-gradient(145deg, #21142b, #120e1e) !important;
      border: 1px solid #63305f !important;
      border-radius: 9px !important;
    }

    .rfui-ready .task_text .answerEl,
    .rfui-ready .task_text .rfte-answer { color: var(--rf6-cyan) !important; }

    .rfui-ready .task_text .olymp td {
      border: 1px solid #63305f !important;
      background: rgba(255,255,255,.035) !important;
      color: var(--rf6-text) !important;
    }

    .rfui-ready .task_text .olymp .up {
      color: var(--rf6-cyan) !important;
      text-shadow: 0 0 8px rgba(39,232,224,.4) !important;
    }


    .rfui-ready .fixed-top {
      background: rgba(9,7,17,.96) !important;
      border-bottom: 1px solid rgba(255,45,135,.55) !important;
      box-shadow: 0 5px 28px rgba(0,0,0,.55), 0 1px 14px rgba(255,45,135,.12) !important;
    }

    .rfui-ready .container,
    .rfui-ready .container-location {
      color: var(--rf6-text) !important;
    }

    .rfui-ready .container-location {
      background: transparent !important;
    }

    .rfui-ready .tabs {
      background: transparent !important;
    }

    .rfui-ready .tabs > .wrapper {
      display: flex !important;
      gap: 7px !important;
      flex-wrap: wrap !important;
      border-bottom: 1px solid rgba(39,232,224,.32) !important;
    }

    .rfui-ready .container-location > h1 {
      color: #fff !important;
      font-weight: 800 !important;
      letter-spacing: .035em !important;
      text-shadow: 0 0 18px rgba(255,45,135,.42) !important;
    }

    .rfui-ready .container-location > h1 a {
      color: var(--rf6-cyan) !important;
    }

    .rfui-ready .separator {
      color: var(--rf6-pink) !important;
    }

    .rfui-ready .tabcontent p,
    .rfui-ready .tabcontent li,
    .rfui-ready .tabcontent strong,
    .rfui-ready .tabcontent em {
      color: inherit;
    }

    .rfui-ready .tabcontent.task {
      min-height: 120px;
    }

    .rfui-ready .enter .non-fixed-input {
      display: flex !important;
      align-items: center !important;
      gap: 9px !important;
    }

    .rfui-ready .enter input[name="code"] {
      flex: 1 1 auto !important;
    }

    .rfui-ready .tab,
    .rfui-ready .tabcontent,
    .rfui-ready .enter {
      -webkit-backdrop-filter: blur(14px);
    }

    @media (max-width: 700px) {
      .rfui-ready .tabcontent { padding: 12px !important; }
      .rfui-ready .enter { padding: 9px !important; }
      .rfui-ready .enter input,
      .rfui-ready .enter input[name="code"] { width: 100% !important; }
      .rfui-ready .task_text table { display: block !important; max-width: 100% !important; overflow-x: auto !important; }
    }
  `;

  function installStyles() {
    var style = document.getElementById('rfui-styles');
    if (!style) {
      style = document.createElement('style');
      style.id = 'rfui-styles';
      style.type = 'text/css';
      (document.head || document.documentElement).appendChild(style);
    }
    if (style.textContent !== CSS) style.textContent = CSS;
  }

  function applyTheme(options) {
    var theme = Object.assign({}, THEME, options || {});
    var root = document.documentElement;
    root.style.setProperty('--rf6-bg', theme.background);
    root.style.setProperty('--rf6-panel', theme.panel);
    root.style.setProperty('--rf6-panel2', theme.panelSoft);
    root.style.setProperty('--rf6-text', theme.text);
    root.style.setProperty('--rf6-muted', theme.muted);
    root.style.setProperty('--rf6-pink', theme.accent);
    root.style.setProperty('--rf6-pink2', theme.accentHover);
    root.style.setProperty('--rf6-cyan', theme.cyan);
    root.style.setProperty('--rf6-border', theme.border);
    root.style.setProperty('--rf6-input', theme.inputBackground);

    if (typeof theme.backgroundImage === 'string' && /^https?:\/\/[^\s"'<>]+$/i.test(theme.backgroundImage.trim())) {
      root.style.setProperty('--rf6-bg-image', 'url("' + theme.backgroundImage.trim() + '")');
      if (document.body) document.body.classList.add('rfui-has-background-image');
    } else {
      root.style.removeProperty('--rf6-bg-image');
      if (document.body) document.body.classList.remove('rfui-has-background-image');
    }
  }

  function activate() {
    installStyles();
    if (!document.body) return;
    document.documentElement.classList.add('rfui-ready');
    document.body.classList.add('rfui-ready');
    var config = window.RFUI_CONFIG || {};
    applyTheme(config.theme || config);
  }

  window.RedFox = {
    version: '0.2.0',
    setTheme: applyTheme,
    refresh: activate,
    defaults: Object.assign({}, THEME)
  };

  window.RedFoxUI = {
    version: '0.2.0',
    applyTheme: applyTheme,
    refresh: activate,
    defaults: Object.assign({}, THEME)
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', activate, { once: true });
  } else {
    activate();
  }

  // Some task pages insert their contents after the initial page load.
  if (window.MutationObserver && document.documentElement) {
    var observer = new MutationObserver(function () {
      if (document.body && (!document.body.classList.contains('rfui-ready') || !document.documentElement.classList.contains('rfui-ready'))) activate();
      if (!document.getElementById('rfui-styles')) installStyles();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
})(window, document);
