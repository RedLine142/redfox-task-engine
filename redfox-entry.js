(function (window, document) {
  'use strict';

  var VERSION = '1.5.1-halloween-20261108';
  var BASE = 'https://cdn.jsdelivr.net/gh/RedLine142/redfox-task-engine@0a88c07f799b44788447dfc13b26a04c5f73fa68/';
  var modules = [
    { id: 'rf-module-ui-v151', file: 'redfox-ui.js' },
    { id: 'rf-module-functions-v151', file: 'redfox-functions.js' }
  ];

  if (window.RedFoxEngine && window.RedFoxEngine.version === VERSION) return;

  window.RedFoxEngine = {
    version: VERSION,
    modules: ['ui', 'functions'],
    refresh: function () {
      if (window.RedFoxUI && typeof window.RedFoxUI.refresh === 'function') window.RedFoxUI.refresh();
      if (window.RedFoxFunctions && typeof window.RedFoxFunctions.refresh === 'function') window.RedFoxFunctions.refresh();
    }
  };

  function loadModule(index) {
    if (index >= modules.length) {
      if (window.console && console.info) console.info('[RED FOX] Engine ready ' + VERSION);
      return;
    }

    var module = modules[index];
    if (document.getElementById(module.id)) {
      loadModule(index + 1);
      return;
    }

    var script = document.createElement('script');
    script.id = module.id;
    script.src = BASE + module.file + '?v=' + VERSION;
    script.async = false;
    script.onload = function () {
      if (window.console && console.info) console.info('[RED FOX] Loaded ' + module.file);
      loadModule(index + 1);
    };
    script.onerror = function () {
      if (window.console && console.error) console.error('[RED FOX] Failed to load ' + module.file + ': ' + script.src);
    };
    (document.head || document.documentElement).appendChild(script);
  }

  loadModule(0);
})(window, document);