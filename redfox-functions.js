(function (window, document, $) {
  'use strict';

  if (!$) {
    console.error('[RED FOX] jQuery is required by redfox-functions.js');
    return;
  }
  if (window.RedFoxFunctions && window.RedFoxFunctions.version) return;

  var initialized = false;

  function addStyle(id, css) {
    if (document.getElementById(id)) return;
    var style = document.createElement('style');
    style.id = id;
    style.type = 'text/css';
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }

  function processCustomStyles() {
    var $styles = $('.task_text .style');
    $styles.each(function (index) {
      var css = $(this).html();
      if (!css) return;
      addStyle('rf-custom-task-style-' + index, css);
      $(this).hide();
    });
  }

  function buildOlympTable(size, reverse) {
    var count = Number(size);
    if (![8, 16, 32].includes(count)) return '';
    var rounds = Math.log2(count);
    var columns = [];
    for (var round = 0; round <= rounds; round++) {
      var cells = [];
      var rowSpan = Math.pow(2, round);
      var sectorCount = count / rowSpan;
      for (var i = 0; i < sectorCount; i++) {
        var sectorNumber;
        if (round === 0) sectorNumber = i + 1;
        else sectorNumber = count + count - (2 * count / rowSpan) + i + 1;
        cells.push({
          id: 'olymp' + sectorNumber,
          label: 'Sector ' + sectorNumber,
          rowspan: rowSpan
        });
      }
      columns.push(cells);
    }

    var html = '<table class="olymp rf-olymp"><tbody>';
    for (var row = 0; row < count; row++) {
      html += '<tr>';
      for (var col = 0; col < columns.length; col++) {
        var sourceCol = reverse ? columns.length - 1 - col : col;
        if (row % Math.pow(2, sourceCol) === 0) {
          var cell = columns[sourceCol][Math.floor(row / Math.pow(2, sourceCol))];
          if (cell) {
            html += '<td id="' + cell.id + '" rowspan="' + cell.rowspan + '">' + cell.label + '</td>';
          }
        }
      }
      html += '</tr>';
    }
    html += '</tbody></table>';
    if (reverse) {
      html = html.replace('<table class="olymp rf-olymp">', '<table class="olymp rf-olymp rf-olymp-reverse">');
    }
    return html;
  }

  function createOlymp(oSize) {
    var reverse = String(oSize).charAt(0) === 'r';
    var size = reverse ? String(oSize).slice(1) : String(oSize);
    var html = buildOlympTable(size, reverse);
    if (!html) {
      console.warn('[RED FOX] Unsupported olymp size:', oSize);
      return false;
    }

    var $target = $('.task_text .oPos').first();
    if (!$target.length) $target = $('.task_text').first();
    if (!$target.length) return false;

    $target.append(html);
    addStyle('rf-olymp-styles',
      '.rf-olymp{border-collapse:collapse;max-width:100%;margin:14px 0}.rf-olymp td{border:1px solid #fff;width:125px;min-width:90px;text-align:center;vertical-align:middle;padding:8px}.rf-olymp img{max-width:100%;height:auto}.rf-olymp .up{color:#0f0;font-weight:bold}.rf-olymp-reverse{direction:ltr}');
    $('.task_text .oTasks li').each(function () {
      var id = $(this).attr('id');
      if (id) $('#olymp' + id).html($(this).html());
    });
    return true;
  }

  function processCodeMarkers() {
    $('.code').each(function () {
      var $code = $(this);
      var $s = $code.find('.sTask').first();
      var $a = $code.find('.aTask').first();
      var $r = $code.find('.rTask').first();

      if ($s.length) {
        var sId = $.trim($s.text());
        $('#s' + sId).css('opacity', '0.1');
        $s.hide();
      }

      if ($a.length) {
        var aId = $.trim($a.text());
        var clone = $code.clone();
        clone.find('.sTask,.aTask,.rTask,.pTask,.oTask').remove();
        var answer = $.trim(clone.text());
        if (aId) $('#a' + aId).text(answer);
        $a.hide();
      }

      if ($r.length) {
        var rId = $.trim($r.text());
        var resultHtml = $r.html() || '';
        var space = resultHtml.indexOf(' ');
        var result = space >= 0 ? resultHtml.slice(space + 1) : resultHtml;
        if (rId) $('#r' + rId).html(result);
        $r.hide();
      }
    });

    $('.code .pTask').each(function () {
      var $marker = $(this);
      $.trim($marker.text()).split(/\s+/).filter(Boolean).forEach(function (id) {
        $('#p' + id).css('opacity', '0.1');
      });
      $marker.hide();
    });
  }

  function processOlympMarkers() {
    var $init = $('.task_text .oTaskInit').first();
    if (!$init.length) return;
    $('.task_text').addClass('nobr');
    createOlymp($.trim($init.text()));
    $init.hide();
    $('.task_text .oTask,.task_text .oTasks').hide();

    $('.code .oTask').each(function () {
      var $marker = $(this);
      var id = $.trim($marker.text());
      var codeText = $.trim($marker.closest('.code').text());
      var split = codeText.indexOf(' ');
      var value = split >= 0 ? codeText.slice(0, split) : codeText;
      var $sector = $('#olymp' + id);
      if ($sector.length) $sector.text(value).addClass('up');
    });
  }

  function processSlider() {
    $('.task_text .slider-container').each(function () {
      var $container = $(this);
      var $slides = $container.find('.slider img');
      var count = $slides.length;
      if (!count) return;
      var current = 0;

      function showSlide(index) {
        current = (index + count) % count;
        $slides.each(function (i) {
          $(this).toggle(i === current);
        });
      }

      $container.find('.prev-button').off('click.redfox').on('click.redfox', function (event) {
        event.preventDefault();
        showSlide(current - 1);
      });
      $container.find('.next-button').off('click.redfox').on('click.redfox', function (event) {
        event.preventDefault();
        showSlide(current + 1);
      });
      showSlide(0);
    });
  }

  function processEmoji() {
    $('.task_text .emoji').each(function () {
      var points = $.trim($(this).text()).split(/\s+/).filter(Boolean);
      var result = '';
      points.forEach(function (point) {
        var code = Number(point);
        if (Number.isInteger(code) && code > 0 && code <= 0x10FFFF) {
          try { result += String.fromCodePoint(code); } catch (error) {}
        }
      });
      if (result) $(this).text(result);
    });
  }

  function processRandomList() {
    $('.task_text .randList').each(function () {
      var $list = $(this);
      var items = $list.find('li').map(function () { return $(this).html(); }).get();
      $list.hide();
      if (!items.length) return;
      var selected = Math.floor(Math.random() * items.length);
      $list.closest('.task_text').find('.rand').first().html(items[selected]);
    });
  }

  function processNoBreak() {
    if ($('.task_text .nobr').length) $('.task_text').addClass('nobr');
  }

  function activateTaskTab() {
    if (!$('.task_text .noCodesTab').length) return;
    $('.tabs .tab,.tab').removeClass('active');
    $('#task').addClass('active');
    $('.tabcontent').removeClass('active');
    $('.tabcontent.task,.task').addClass('active');
  }

  function processImageMaps() {
    if (typeof $.fn.rwdImageMaps !== 'function') return;
    if ($('.task_text map').length) $('img[usemap]').rwdImageMaps();
  }

  function init() {
    if (initialized) return;
    initialized = true;

    addStyle('rf-functions-base-styles', '.task_text .nobr br{display:none}');
    processCustomStyles();
    $('.sTask,.aTask,.rTask,.pTask').hide();
    processCodeMarkers();
    processOlympMarkers();
    processSlider();
    processEmoji();
    processRandomList();
    processNoBreak();
    activateTaskTab();
    processImageMaps();

    if (window.RedFox && typeof window.RedFox.refresh === 'function') {
      window.RedFox.refresh();
    }
    $(document).trigger('redfox:functions-ready');
  }

  var api = {
    version: '1.0.0',
    init: init,
    refresh: function () { initialized = false; init(); },
    createOlymp: createOlymp
  };

  window.RedFoxFunctions = api;
  window.createOlymp = createOlymp;

  if (document.readyState === 'loading') {
    $(init);
  } else {
    init();
  }
})(window, document, window.jQuery || window.$);
