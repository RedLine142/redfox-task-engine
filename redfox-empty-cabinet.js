(function (window, document) {
  'use strict';

  var STYLE_ID = 'rf-empty-cabinet-style';
  var ROOT_CLASS = 'rf-empty-cabinet';
  var SOCIAL_ID = 'rf-empty-social';

  function textOf(node) {
    return (node && (node.textContent || node.innerText) || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function isTargetPage() {
    var team = document.querySelector('.team_name');
    var heading = document.querySelector('h3');
    var timer = document.getElementById('timer');
    return !!(team && heading && timer && /на данный момент нет активных игр/.test(textOf(heading)));
  }

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;

    var css = `
      :root {
        --rf-empty-bg: #090b0f;
        --rf-empty-panel: #111720;
        --rf-empty-panel-2: #151e29;
        --rf-empty-red: #e3263e;
        --rf-empty-red-light: #ff465b;
        --rf-empty-text: #f4f6f8;
        --rf-empty-muted: #9da8b7;
        --rf-empty-line: rgba(255,255,255,.09);
      }
      html.rf-empty-cabinet { min-height:100%; background:var(--rf-empty-bg) !important; }
      body.rf-empty-cabinet {
        box-sizing:border-box; min-height:100vh; margin:0 !important; padding:clamp(22px,5vw,58px) 16px 0 !important;
        overflow-x:hidden; color:var(--rf-empty-text) !important;
        background:
          radial-gradient(ellipse at 50% -12%,rgba(227,38,62,.23),transparent 48%),
          radial-gradient(ellipse at 0% 65%,rgba(33,67,95,.16),transparent 38%),
          linear-gradient(180deg,#0d1118 0%,#080a0e 100%) !important;
        font-family:Inter,Arial,Helvetica,sans-serif !important;
      }
      body.rf-empty-cabinet::before {
        content:""; position:fixed; inset:0; z-index:0; pointer-events:none; opacity:.17;
        background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),
          linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);
        background-size:42px 42px;
        mask-image:linear-gradient(to bottom,black,transparent 85%);
      }
      body.rf-empty-cabinet #rf-empty-shell {
        position:relative; z-index:1; box-sizing:border-box; width:min(850px,100%);
        margin:0 auto 28px; padding:clamp(26px,5vw,54px) clamp(18px,5vw,58px) 36px;
        overflow:hidden; text-align:center; border:1px solid rgba(255,255,255,.1);
        border-radius:12px; background:linear-gradient(145deg,rgba(25,34,46,.97),rgba(13,18,25,.98) 68%);
        box-shadow:0 24px 80px rgba(0,0,0,.48),0 0 55px rgba(227,38,62,.08);
      }
      body.rf-empty-cabinet #rf-empty-shell::before {
        content:""; position:absolute; top:0; left:8%; right:8%; height:2px;
        background:linear-gradient(90deg,transparent,var(--rf-empty-red),#ff6575,var(--rf-empty-red),transparent);
        box-shadow:0 0 18px rgba(227,38,62,.55);
      }
      body.rf-empty-cabinet .rf-empty-brand {
        display:flex; align-items:center; justify-content:center; gap:10px; margin:0 0 34px;
        color:#fff; font-size:clamp(22px,4vw,30px); font-weight:950; letter-spacing:.13em;
        text-transform:uppercase;
      }
      body.rf-empty-cabinet .rf-empty-mark {
        display:inline-flex; align-items:center; justify-content:center; width:34px; height:34px;
        border:2px solid var(--rf-empty-red); border-radius:9px; color:var(--rf-empty-red-light);
        font-size:19px; line-height:1; transform:rotate(-8deg);
        box-shadow:0 0 18px rgba(227,38,62,.2);
      }
      body.rf-empty-cabinet .team_name {
        display:inline-block; margin:0 0 22px !important; padding:8px 15px;
        border:1px solid rgba(227,38,62,.35); border-radius:30px;
        background:rgba(227,38,62,.09); color:#ff7180 !important;
        font-size:12px !important; font-weight:800; letter-spacing:.17em;
        text-transform:uppercase;
      }
      body.rf-empty-cabinet .rf-empty-kicker {
        margin:0 0 13px; color:#77879a; font-size:10px; font-weight:900;
        letter-spacing:.3em; text-transform:uppercase;
      }
      body.rf-empty-cabinet h3 {
        margin:0 auto !important; max-width:650px; color:var(--rf-empty-text) !important;
        font-size:clamp(27px,5.5vw,46px) !important; font-weight:950 !important;
        line-height:1.12 !important; letter-spacing:-.035em; text-transform:uppercase;
        text-shadow:0 5px 25px rgba(0,0,0,.45);
      }
      body.rf-empty-cabinet h3 p { margin:0 !important; color:inherit !important; font:inherit !important; }
      body.rf-empty-cabinet .rf-empty-divider {
        width:64px; height:3px; margin:25px auto 21px; border-radius:3px;
        background:linear-gradient(90deg,#a90f26,var(--rf-empty-red-light));
        box-shadow:0 0 15px rgba(227,38,62,.35);
      }
      body.rf-empty-cabinet .rf-empty-description {
        max-width:510px; margin:0 auto; color:var(--rf-empty-muted);
        font-size:14px; line-height:1.8;
      }
      body.rf-empty-cabinet .timer {
        float:none !important; display:inline-flex; align-items:center; justify-content:center;
        margin:28px 0 0 !important; padding:10px 17px; border:1px solid var(--rf-empty-line);
        border-radius:7px; background:rgba(4,7,11,.48); color:#dce4ed !important;
        font-family:Consolas,Monaco,monospace; font-size:14px; font-weight:800;
        letter-spacing:.12em; font-variant-numeric:tabular-nums;
      }
      body.rf-empty-cabinet #timer { color:#ff5368; text-shadow:0 0 12px rgba(227,38,62,.35); }
      body.rf-empty-cabinet #rf-empty-social {
        position:relative; z-index:1; box-sizing:border-box; width:min(850px,100%);
        margin:0 auto; padding:28px clamp(16px,4vw,34px) 22px;
        border:1px solid rgba(255,255,255,.08); border-radius:10px 10px 0 0;
        background:linear-gradient(145deg,#111923,#0c1118);
        text-align:center; box-shadow:0 15px 45px rgba(0,0,0,.25);
      }
      body.rf-empty-cabinet .rf-empty-social-title {
        margin:0 0 9px; color:#fff; font-size:20px; font-weight:950; letter-spacing:.04em;
      }
      body.rf-empty-cabinet .rf-empty-social-copy {
        max-width:540px; margin:0 auto 21px; color:var(--rf-empty-muted);
        font-size:13px; line-height:1.7;
      }
      body.rf-empty-cabinet .rf-empty-social-links {
        display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:9px;
        width:min(650px,100%); margin:0 auto;
      }
      body.rf-empty-cabinet .rf-empty-social-link {
        display:flex; min-height:58px; box-sizing:border-box; flex-direction:column;
        align-items:center; justify-content:center; gap:5px; padding:10px 5px;
        border:1px solid rgba(255,255,255,.12); border-radius:7px;
        color:#fff !important; text-decoration:none !important;
        font-size:13px; font-weight:900; letter-spacing:.06em;
        transition:transform .2s ease,border-color .2s ease,filter .2s ease;
      }
      body.rf-empty-cabinet .rf-empty-social-link span {
        font-size:10px; font-weight:500; letter-spacing:0; opacity:.78;
      }
      body.rf-empty-cabinet .rf-empty-social-link:hover { transform:translateY(-3px); filter:brightness(1.18); }
      body.rf-empty-cabinet .rf-empty-vk { background:#182b43; border-color:#31547e; }
      body.rf-empty-cabinet .rf-empty-tg { background:#142b39; border-color:#28566b; }
      body.rf-empty-cabinet .rf-empty-ig { background:#301a2b; border-color:#653451; }
      body.rf-empty-cabinet .rf-empty-signature {
        margin:24px 0 0; padding-top:17px; border-top:1px solid rgba(255,255,255,.1);
        color:#657183; font-size:10px; line-height:1.9; letter-spacing:.22em;
      }
      @media(max-width:520px) {
        body.rf-empty-cabinet { padding:12px 10px 0 !important; }
        body.rf-empty-cabinet #rf-empty-shell { padding:27px 17px 29px; border-radius:9px; }
        body.rf-empty-cabinet .rf-empty-brand { margin-bottom:29px; }
        body.rf-empty-cabinet .rf-empty-social-links { gap:6px; }
        body.rf-empty-cabinet .rf-empty-social-link { min-height:55px; font-size:11px; }
        body.rf-empty-cabinet .rf-empty-social-link span { font-size:9px; }
      }
      @media(prefers-reduced-motion:reduce) {
        body.rf-empty-cabinet .rf-empty-social-link { transition:none; }
      }
    `;

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    (document.head || document.documentElement).appendChild(style);
  }

  function createSocialBlock() {
    if (document.getElementById(SOCIAL_ID)) return;

    var section = document.createElement('section');
    section.id = SOCIAL_ID;
    section.innerHTML =
      '<div class="rf-empty-social-title">БУДЬ НА СВЯЗИ С RED FOX</div>' +
      '<div class="rf-empty-social-copy">Следи за новостями, узнавай об играх и оставайся частью нашего сообщества.</div>' +
      '<div class="rf-empty-social-links">' +
        '<a class="rf-empty-social-link rf-empty-vk" href="https://vk.ru/redfox_kmr" target="_blank" rel="noopener noreferrer">VK<span>Сообщество</span></a>' +
        '<a class="rf-empty-social-link rf-empty-tg" href="https://t.me/redfox_kmr" target="_blank" rel="noopener noreferrer">TELEGRAM<span>Наш канал</span></a>' +
        '<a class="rf-empty-social-link rf-empty-ig" href="https://instagram.com/redfox_kmr" target="_blank" rel="noopener noreferrer">INSTAGRAM<span>Наши фото</span></a>' +
      '</div>' +
      '<div class="rf-empty-signature">RED FOX KEMEROVO<br>НОЧЬ. ДРАЙВ. КОМАНДА.</div>';
    document.body.appendChild(section);
  }

  function init() {
    if (!document.body || document.body.classList.contains(ROOT_CLASS)) return;
    if (!isTargetPage()) return;

    var team = document.querySelector('.team_name');
    var heading = document.querySelector('h3');
    var timer = document.querySelector('.timer');
    var shell = document.createElement('main');
    shell.id = 'rf-empty-shell';

    var brand = document.createElement('div');
    brand.className = 'rf-empty-brand';
    brand.innerHTML = '<span class="rf-empty-mark">R</span><span>RED FOX QUEST</span>';

    var kicker = document.createElement('div');
    kicker.className = 'rf-empty-kicker';
    kicker.textContent = 'Игровой кабинет';

    var divider = document.createElement('div');
    divider.className = 'rf-empty-divider';

    var description = document.createElement('p');
    description.className = 'rf-empty-description';
    description.textContent = 'Следи за анонсами и готовь команду к следующему приключению. Новые игры появятся здесь.';

    document.body.insertBefore(shell, document.body.firstChild);
    shell.appendChild(brand);
    shell.appendChild(team);
    shell.appendChild(kicker);
    shell.appendChild(heading);
    shell.appendChild(divider);
    shell.appendChild(description);
    if (timer) shell.appendChild(timer);

    document.body.classList.add(ROOT_CLASS);
    document.documentElement.classList.add(ROOT_CLASS);
    addStyles();
    createSocialBlock();

    if (window.console && console.info) console.info('[RED FOX] Empty cabinet landing theme ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})(window, document);
