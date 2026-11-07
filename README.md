# RED FOX UI / Task Engine

A presentation extension for existing RED FOX / Encounter player pages. It does not replace the game engine or its answer checker.

## Install

Keep the existing task-engine files and add the UI files to the player page:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/RedLine142/redfox-task-engine@main/redfox-task-engine.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/RedLine142/redfox-task-engine@main/redfox-ui.css">

<script src="https://cdn.jsdelivr.net/gh/RedLine142/redfox-task-engine@main/redfox-task-engine.js"></script>
<script src="https://cdn.jsdelivr.net/gh/RedLine142/redfox-task-engine@main/redfox-ui.js"></script>
```

Load the stylesheets before the scripts. The existing task-engine script and its API remain available.

## RED FOX DARK theme

The UI module applies the RED FOX DARK theme to known player-page elements, including the code-entry form, tabs, task text, hints, found-code panel and location-code panel.

Optional customization can be declared before loading `redfox-ui.js`:

```html
<script>
window.RFUI_CONFIG = {
  theme: {
    background: "#101216",
    panel: "#191d24",
    panelSoft: "#202630",
    text: "#f1f3f5",
    muted: "#a6adb8",
    accent: "#e53935",
    accentHover: "#ff514b",
    border: "#343b46",
    inputBackground: "#11151b",
    backgroundImage: ""
  }
};
</script>
```

Use an absolute HTTP(S) image URL for `backgroundImage`. Leave it empty to use a solid dark background.

The theme can also be changed after initialization:

```javascript
RedFoxUI.applyTheme({
  accent: "#e53935",
  background: "#101216",
  backgroundImage: "https://example.com/background.jpg"
});
```

Call `RedFoxUI.refresh()` to re-apply the UI-ready body class after dynamic page changes.

## Existing task markup

Use matching task and answer IDs, for example `T1` and `A1`:

```html
<div class="myContainer">
  <div class="myElem">
    <div class="taskEl" id="T1">Task text</div>
    <span class="answerEl" id="A1"></span>
  </div>
</div>
```

## Existing task API

After the existing game checker confirms an answer, call `markAnswerCorrect(1)`. The task will be dimmed and `ВЕРНО` will appear.

For several tasks, call `markTasksCorrect([1, 2, 3])`.

## Compatibility

The UI module is presentation-only. It does not validate answers, submit codes, change game progress, or replace Encounter's server-side behavior. The existing task-engine functions are kept separate from the new UI theme.
