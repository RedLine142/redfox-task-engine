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

  var CSS = "\n    :root {\n      --rf6-bg: #090711;\n      --rf6-panel: #171020;\n      --rf6-panel2: #24142d;\n      --rf6-text: #fff4fb;\n      --rf6-muted: #c6afc5;\n      --rf6-pink: #ff2d87;\n      --rf6-pink2: #ff62b0;\n      --rf6-cyan: #27e8e0;\n      --rf6-border: #63305f;\n      --rf6-input: #100c18;\n      --rf6-bg-image: none;\n    }\n\n    body.rfui-ready {\n      background: #090711 !important;\n      background-color: #090711 !important;\n      color: var(--rf6-text) !important;\n      font-family: Arial, Helvetica, sans-serif !important;\n    }\n\n    body.rfui-ready::before {\n      content: \"\";\n      position: fixed;\n      inset: 0;\n      z-index: -1;\n      pointer-events: none;\n      background:\n        radial-gradient(ellipse at 15% 10%, rgba(255,45,135,.20), transparent 38%),\n        radial-gradient(ellipse at 85% 28%, rgba(39,232,224,.13), transparent 36%),\n        linear-gradient(145deg, #090711 0%, #160d20 52%, #080b15 100%);\n    }\n\n    body.rfui-ready.rfui-has-background-image {\n      background-image: linear-gradient(rgba(8,6,16,.72), rgba(8,6,16,.88)), var(--rf6-bg-image) !important;\n      background-position: center top !important;\n      background-size: cover !important;\n      background-attachment: fixed !important;\n      background-repeat: no-repeat !important;\n    }\n\n    .rfui-ready .enter {\n      box-sizing: border-box !important;\n      padding: 12px !important;\n      color: var(--rf6-text) !important;\n      background: linear-gradient(135deg, rgba(35,17,43,.97), rgba(15,13,28,.97)) !important;\n      border: 1px solid rgba(255,45,135,.65) !important;\n      border-bottom: 3px solid var(--rf6-pink) !important;\n      border-radius: 13px !important;\n      box-shadow: 0 0 18px rgba(255,45,135,.17), 0 10px 35px rgba(0,0,0,.45) !important;\n      backdrop-filter: blur(14px);\n    }\n\n    .rfui-ready .enter input,\n    .rfui-ready .enter input[name=\"code\"] {\n      box-sizing: border-box !important;\n      min-height: 46px !important;\n      padding: 11px 14px !important;\n      color: #fff !important;\n      background: #100c18 !important;\n      border: 1px solid #75406e !important;\n      border-radius: 8px !important;\n      outline: none !important;\n      font: inherit !important;\n      box-shadow: inset 0 0 12px rgba(0,0,0,.35) !important;\n    }\n\n    .rfui-ready .enter input:focus {\n      border-color: var(--rf6-cyan) !important;\n      box-shadow: 0 0 0 2px rgba(39,232,224,.17), 0 0 16px rgba(39,232,224,.16) !important;\n    }\n\n    .rfui-ready .enter input::placeholder { color: #a88ca9 !important; }\n\n    .rfui-ready .enter button,\n    .rfui-ready .enter input[type=\"submit\"],\n    .rfui-ready .enter button[type=\"submit\"] {\n      min-height: 46px !important;\n      padding: 10px 22px !important;\n      color: #fff !important;\n      background: linear-gradient(110deg, #ff2384, #c61b9b) !important;\n      border: 1px solid #ff70b5 !important;\n      border-radius: 8px !important;\n      font: inherit !important;\n      font-weight: 800 !important;\n      letter-spacing: .07em !important;\n      text-transform: uppercase !important;\n      cursor: pointer !important;\n      box-shadow: 0 0 16px rgba(255,35,132,.32) !important;\n      transition: .2s ease !important;\n    }\n\n    .rfui-ready .enter button:hover,\n    .rfui-ready .enter input[type=\"submit\"]:hover {\n      background: linear-gradient(110deg, #ff58a4, #e52bb7) !important;\n      box-shadow: 0 0 23px rgba(255,45,135,.55) !important;\n      transform: translateY(-1px);\n    }\n\n    .rfui-ready .tab {\n      box-sizing: border-box !important;\n      color: #c6afc5 !important;\n      background: linear-gradient(180deg, #21142b, #130e1d) !important;\n      border: 1px solid #59305b !important;\n      border-bottom: 2px solid transparent !important;\n      border-radius: 9px 9px 0 0 !important;\n      text-transform: uppercase !important;\n      letter-spacing: .045em !important;\n      font-weight: 700 !important;\n      transition: .2s ease !important;\n    }\n\n    .rfui-ready .tab:hover {\n      color: #fff !important;\n      border-color: var(--rf6-cyan) !important;\n      text-shadow: 0 0 9px rgba(39,232,224,.5) !important;\n    }\n\n    .rfui-ready .tab.active {\n      color: #fff !important;\n      background: linear-gradient(110deg, rgba(255,45,135,.24), rgba(39,232,224,.10)) !important;\n      border: 1px solid var(--rf6-pink) !important;\n      border-bottom: 2px solid var(--rf6-cyan) !important;\n      box-shadow: 0 -4px 18px rgba(255,45,135,.14) !important;\n      text-shadow: 0 0 10px rgba(255,255,255,.28) !important;\n    }\n\n    .rfui-ready .tabcontent {\n      box-sizing: border-box !important;\n      color: var(--rf6-text) !important;\n      background: linear-gradient(145deg, rgba(28,17,38,.97), rgba(12,13,25,.97)) !important;\n      border: 1px solid #59305b !important;\n      border-top: 1px solid rgba(39,232,224,.45) !important;\n      border-radius: 0 0 13px 13px !important;\n      padding: 18px !important;\n      box-shadow: 0 12px 36px rgba(0,0,0,.35), inset 0 1px rgba(255,255,255,.025) !important;\n    }\n\n    .rfui-ready .task_text,\n    .rfui-ready .found-codes,\n    .rfui-ready .hints,\n    .rfui-ready .location-codes {\n      color: var(--rf6-text) !important;\n      line-height: 1.68 !important;\n    }\n\n    .rfui-ready .task_text h1,\n    .rfui-ready .task_text h2,\n    .rfui-ready .task_text h3,\n    .rfui-ready .task_text h4 {\n      color: #fff !important;\n      text-shadow: 0 0 14px rgba(255,45,135,.28) !important;\n      letter-spacing: .025em !important;\n    }\n\n    .rfui-ready .task_text a {\n      color: var(--rf6-cyan) !important;\n      text-decoration-color: rgba(39,232,224,.55) !important;\n    }\n\n    .rfui-ready .task_text a:hover {\n      color: #fff !important;\n      text-shadow: 0 0 10px rgba(39,232,224,.65) !important;\n    }\n\n    .rfui-ready .task_text img {\n      max-width: 100% !important;\n      height: auto !important;\n      border: 1px solid rgba(255,45,135,.35) !important;\n      border-radius: 9px !important;\n      box-shadow: 0 8px 24px rgba(0,0,0,.3) !important;\n    }\n\n    .rfui-ready .task_text blockquote {\n      margin: 14px 0 !important;\n      padding: 12px 15px !important;\n      color: #e9d8e9 !important;\n      background: rgba(255,45,135,.07) !important;\n      border-left: 3px solid var(--rf6-pink) !important;\n      border-radius: 0 8px 8px 0 !important;\n    }\n\n    .rfui-ready .task_text hr {\n      border: 0 !important;\n      border-top: 1px solid rgba(39,232,224,.35) !important;\n      box-shadow: 0 1px 8px rgba(39,232,224,.12) !important;\n    }\n\n    .rfui-ready .task_text table { max-width: 100% !important; border-collapse: collapse !important; }\n    .rfui-ready .task_text td,\n    .rfui-ready .task_text th {\n      border: 1px solid #59305b !important;\n      color: var(--rf6-text) !important;\n      background-color: rgba(18,12,29,.72) !important;\n      padding: 7px !important;\n    }\n\n    .rfui-ready .task_text .myElem {\n      color: var(--rf6-text) !important;\n      background: linear-gradient(145deg, #21142b, #120e1e) !important;\n      border: 1px solid #63305f !important;\n      border-radius: 9px !important;\n    }\n\n    .rfui-ready .task_text .answerEl,\n    .rfui-ready .task_text .rfte-answer { color: var(--rf6-cyan) !important; }\n\n    .rfui-ready .task_text .olymp td {\n      border: 1px solid #63305f !important;\n      background: rgba(255,255,255,.035) !important;\n      color: var(--rf6-text) !important;\n    }\n\n    .rfui-ready .task_text .olymp .up {\n      color: var(--rf6-cyan) !important;\n      text-shadow: 0 0 8px rgba(39,232,224,.4) !important;\n    }\n\n\n    .rfui-ready .fixed-top {\n      background: rgba(9,7,17,.96) !important;\n      border-bottom: 1px solid rgba(255,45,135,.55) !important;\n      box-shadow: 0 5px 28px rgba(0,0,0,.55), 0 1px 14px rgba(255,45,135,.12) !important;\n    }\n\n    .rfui-ready .container,\n    .rfui-ready .container-location {\n      color: var(--rf6-text) !important;\n    }\n\n    .rfui-ready .container-location {\n      background: transparent !important;\n    }\n\n    .rfui-ready .tabs {\n      background: transparent !important;\n    }\n\n    .rfui-ready .tabs > .wrapper {\n      display: flex !important;\n      gap: 7px !important;\n      flex-wrap: wrap !important;\n      border-bottom: 1px solid rgba(39,232,224,.32) !important;\n    }\n\n    .rfui-ready .container-location > h1 {\n      color: #fff !important;\n      font-weight: 800 !important;\n      letter-spacing: .035em !important;\n      text-shadow: 0 0 18px rgba(255,45,135,.42) !important;\n    }\n\n    .rfui-ready .container-location > h1 a {\n      color: var(--rf6-cyan) !important;\n    }\n\n    .rfui-ready .separator {\n      color: var(--rf6-pink) !important;\n    }\n\n    .rfui-ready .tabcontent p,\n    .rfui-ready .tabcontent li,\n    .rfui-ready .tabcontent strong,\n    .rfui-ready .tabcontent em {\n      color: inherit;\n    }\n\n    .rfui-ready .tabcontent.task {\n      min-height: 120px;\n    }\n\n    .rfui-ready .enter .non-fixed-input {\n      display: flex !important;\n      align-items: center !important;\n      gap: 9px !important;\n    }\n\n    .rfui-ready .enter input[name=\"code\"] {\n      flex: 1 1 auto !important;\n    }\n\n    .rfui-ready .tab,\n    .rfui-ready .tabcontent,\n    .rfui-ready .enter {\n      -webkit-backdrop-filter: blur(14px);\n    }\n\n    @media (max-width: 700px) {\n      .rfui-ready .tabcontent { padding: 12px !important; }\n      .rfui-ready .enter { padding: 9px !important; }\n      .rfui-ready .enter input,\n      .rfui-ready .enter input[name=\"code\"] { width: 100% !important; }\n      .rfui-ready .task_text table { display: block !important; max-width: 100% !important; overflow-x: auto !important; }\n    }\n  ";

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
