# RED FOX ENGINE

Our own modular JavaScript library for the RED FOX / Encounter player page.

The main entry point loads our modules from this repository:

- `redfox.js` — main loader and public engine entry point.
- `redfox-ui.js` — theme setup and UI initialization.
- `redfox-ui.css` — GTA VI / Vice City visual theme.
- `redfox-functions.js` — migrated task helpers previously provided by `ForRado42.js`.

## Installation

Keep jQuery loaded first. Remove the old `ForRado42.js` include and use only the RED FOX entry point:

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<p class="noCodesTab"><em><strong>Задание:</strong></em></p>
<script src="https://cdn.jsdelivr.net/gh/RedLine142/redfox-task-engine@main/redfox.js"></script>
```

The main loader loads `redfox-ui.js` and then `redfox-functions.js`. The UI module loads `redfox-ui.css`.

Do not load `ForRado42.js` alongside the new functions module: both would process the same task markup and could duplicate or conflict with changes.

## Migrated legacy functionality

`redfox-functions.js` contains the migrated helpers for:

- custom `.style` blocks inside `.task_text`;
- no-break text (`.nobr`);
- tournament brackets: `8`, `r8`, `16`, `r16`, and `32`;
- `.sTask`, `.aTask`, `.rTask`, and `.pTask` markers;
- `.oTaskInit`, `.oTask`, and `.oTasks` bracket data;
- image sliders (`.slider-container`);
- numeric Unicode emoji (`.emoji`);
- random list selection (`.randList` and `.rand`);
- automatic task-tab activation via `.noCodesTab`;
- responsive image maps when the `rwdImageMaps` jQuery plugin is present.

The public functions API is available as `window.RedFoxFunctions`:

```javascript
RedFoxFunctions.refresh();
RedFoxFunctions.createOlymp('8');
```

The bracket helper is also exposed as `window.createOlymp` for compatibility.

## UI customization

The UI API is available as `window.RedFoxUI` and `window.RedFox`:

```javascript
RedFox.setTheme({
  accent: '#ff2d87',
  cyan: '#27e8e0',
  background: '#090711'
});
```

Call `RedFox.refresh()` to re-apply the UI-ready classes and stylesheet link.

A configuration object can be declared before loading the main entry:

```html
<script>
window.RFUI_CONFIG = {
  theme: {
    background: '#090711',
    panel: '#171020',
    panelSoft: '#24142d',
    accent: '#ff2d87',
    accentHover: '#ff62b0',
    cyan: '#27e8e0'
  }
};
</script>
```

## Development rules

- Keep game submission and server-side answer checking on the platform; this library only handles client-side task helpers and presentation.
- Keep features in separate modules. UI changes belong in `redfox-ui.js` / `redfox-ui.css`; task behavior belongs in `redfox-functions.js`.
- Add future optional features as separate modules and register them in `redfox.js`.
- Test against a real task page before removing compatibility code or changing legacy markup assumptions.
