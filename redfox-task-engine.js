(function (window, document) {
  'use strict';
  if (window.RedFoxTaskEngine) return;

  function markAnswerCorrect(number, label) {
    var id = String(number);
    var task = document.getElementById('T' + id);
    var answer = document.getElementById('A' + id);
    var card = task && task.closest ? task.closest('.myElem') : null;
    if (task) {
      task.style.opacity = '0.1';
      task.classList.add('rfte-solved');
    }
    if (answer) {
      answer.textContent = label || 'ВЕРНО';
      answer.classList.add('rfte-answer');
    }
    if (card) card.classList.add('rfte-solved');
  }

  function markTasksCorrect(numbers, label) {
    if (!Array.isArray(numbers)) return;
    numbers.forEach(function (number) { markAnswerCorrect(number, label); });
  }

  function refresh() {
    Array.prototype.forEach.call(document.querySelectorAll('.noCodesTab'), function (tab) {
      tab.style.display = '';
    });
  }

  function installStyles() {
    if (document.getElementById('rfte-inline-task-styles')) return;
    var style = document.createElement('style');
    style.id = 'rfte-inline-task-styles';
    style.textContent = '.task_text .myContainer{display:flex;flex-direction:column;gap:8px}.task_text .myElem{display:flex;align-items:stretch;justify-content:space-between;gap:12px;padding:12px 14px;background:#151b19;border:1px solid #28734b;border-radius:8px;color:#eee}.task_text .myElem .taskEl{flex:1;min-width:0}.task_text .myElem .answerEl,.task_text .myElem .rfte-answer{flex:0 0 auto;align-self:center;color:#54d98b;font-weight:800;text-align:right}.task_text .myElem.rfte-solved{background:#101512;border-color:#244b35}.task_text .myElem.rfte-solved .taskEl{opacity:.25}@media(max-width:600px){.task_text .myElem{padding:10px;gap:8px}}';
    document.head.appendChild(style);
  }

  installStyles();
  window.RedFoxTaskEngine = {
    version: '1.0.0',
    markAnswerCorrect: markAnswerCorrect,
    markTasksCorrect: markTasksCorrect,
    refresh: refresh
  };
  window.markAnswerCorrect = markAnswerCorrect;
  window.markTasksCorrect = markTasksCorrect;
})(window, document);
