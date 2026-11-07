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

  if (window.RedFoxUI && window.RedFoxUI.version === '1.6.0-persistent-game-timer') return;

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
    link.href = 'https://cdn.jsdelivr.net/gh/RedLine142/redfox-task-engine@6d874561074baf17e7d7447777f7d990795f68af/redfox-ui.css';
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

  var TIMER_STORAGE_KEY = 'RF_GAME_TIMER_STATE_V1';
  var timerPanel = null;
  var timerInterval = null;

  function parseClock(value) {
    var match = String(value || '').trim().match(/^(?:(\d+)\s*д\.\s*)?(\d{1,3}):(\d{2}):(\d{2})$/i);
    if (!match) return null;
    return (Number(match[1] || 0) * 86400) +
      (Number(match[2]) * 3600) + (Number(match[3]) * 60) + Number(match[4]);
  }

  function formatClock(total, withDays) {
    total = Math.max(0, Math.floor(total));
    var days = Math.floor(total / 86400);
    var hours = Math.floor((total % 86400) / 3600);
    var minutes = Math.floor((total % 3600) / 60);
    var seconds = total % 60;
    var clock = String(hours).padStart(2, '0') + ':' +
      String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
    return withDays && days ? days + ' д. ' + clock : clock;
  }

  function readOriginalTimer() {
    var leftNode = document.getElementById('time_left');
    var timerNode = document.getElementById('timer');
    if (!leftNode || !timerNode) return null;

    var left = parseClock(leftNode.textContent);
    var elapsed = parseClock(timerNode.textContent);
    if (left === null || elapsed === null) return null;

    var state = {
      deadline: Date.now() + left * 1000,
      elapsed: elapsed,
      savedAt: Date.now()
    };

    try { window.localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
    return state;
  }

  function readSavedTimer() {
    try {
      var raw = window.localStorage.getItem(TIMER_STORAGE_KEY);
      if (!raw) return null;
      var state = JSON.parse(raw);
      if (!state || !isFinite(state.deadline) || !isFinite(state.elapsed) || !isFinite(state.savedAt)) return null;
      return state;
    } catch (e) {
      return null;
    }
  }

  function ensureTimerPanel() {
    if (!document.body) return null;
    if (timerPanel && document.body.contains(timerPanel)) return timerPanel;

    timerPanel = document.getElementById('rf-game-timer-panel');
    if (timerPanel) return timerPanel;

    timerPanel = document.createElement('div');
    timerPanel.id = 'rf-game-timer-panel';
    timerPanel.setAttribute('aria-live', 'off');
    timerPanel.innerHTML =
      '<div class="rf-game-timer-inner">' +
        '<div class="rf-game-timer-item rf-game-timer-left">' +
          '<span class="rf-game-timer-caption">ДО КОНЦА ИГРЫ</span>' +
          '<strong class="rf-game-timer-value" data-rf-time-left>—</strong>' +
        '</div>' +
        '<div class="rf-game-timer-divider"></div>' +
        '<div class="rf-game-timer-item rf-game-timer-elapsed">' +
          '<span class="rf-game-timer-caption">ВРЕМЯ ИГРЫ</span>' +
          '<strong class="rf-game-timer-value" data-rf-timer>—</strong>' +
        '</div>' +
      '</div>';
    document.body.appendChild(timerPanel);
    document.body.classList.add('rfui-has-game-timer');
    return timerPanel;
  }

  function updateTimerPanel() {
    if (!isPlayerPage || !document.body) return;

    var liveState = readOriginalTimer();
    var state = liveState || readSavedTimer();
    var panel = ensureTimerPanel();
    if (!panel) return;

    var leftOutput = panel.querySelector('[data-rf-time-left]');
    var elapsedOutput = panel.querySelector('[data-rf-timer]');

    if (!state) {
      leftOutput.textContent = 'ОЖИДАНИЕ ДАННЫХ';
      elapsedOutput.textContent = '—';
      panel.classList.add('rf-game-timer-waiting');
      return;
    }

    panel.classList.remove('rf-game-timer-waiting');
    var now = Date.now();
    var remaining = Math.max(0, Math.ceil((state.deadline - now) / 1000));
    var elapsed = Math.max(0, Math.floor(state.elapsed + (now - state.savedAt) / 1000));

    leftOutput.textContent = formatClock(remaining, true);
    elapsedOutput.textContent = formatClock(elapsed, false);
  }

  function startGameTimer() {
    if (timerInterval) window.clearInterval(timerInterval);
    updateTimerPanel();
    timerInterval = window.setInterval(updateTimerPanel, 1000);
  }

  function refresh() {
    installStylesheet();
    document.documentElement.classList.add('rfui-ready');
    if (document.body) document.body.classList.add('rfui-ready');
    syncMobileCodeHeader();
    startGameTimer();
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
    version: '1.6.0-persistent-game-timer',
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