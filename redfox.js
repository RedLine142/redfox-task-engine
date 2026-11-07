(function (window, document) {
  'use strict';
  if (window.RedFoxEngine && window.RedFoxEngine.version === '1.0.0') return;
  var BASE = 'https://cdn.jsdelivr.net/gh/RedLine142/redfox-task-engine@main/';
  var modules = [
    { id: 'rf-module-ui', file: 'redfox-ui.js' },
    { id: 'rf-module-functions', file: 'redfox-functions.js' }
  ];
  function loadModule(module, done) {
    if (document.getElementById(module.id)) { if (done) done(); return; }
    var script = document.createElement('script');
    script.id = module.id;
    script.src = BASE + module.file + '?v=1.0.0';
    script.async = false;
    script.onload = function () {
      if (window.console && console.info) console.info('[RED FOX] Loaded ' + module.file);
      if (done) done();
    };
    script.onerror = function () {
      if (window.console && console.error) console.error('[RED FOX] Failed to load ' + module.file);
    };
    (document.head || document.documentElement).appendChild(script);
  }
  function loadNext(index) {
    if (index >= modules.length) return;
    loadModule(modules[index], function () { loadNext(index + 1); });
  }
  window.RedFoxEngine = {
    version: '1.0.0',
    modules: ['ui', 'functions'],
    refresh: function () {
      if (window.RedFoxUI) window.RedFoxUI.refresh();
      if (window.RedFoxFunctions) window.RedFoxFunctions.refresh();
    }
  };
  loadNext(0);
})(window, document);
