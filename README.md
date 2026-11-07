# RED FOX Task Engine

A presentation helper for RED FOX / Encounter task pages.

## Install

Add these lines to the page:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/RedLine142/redfox-task-engine@main/redfox-task-engine.css">
<script src="https://cdn.jsdelivr.net/gh/RedLine142/redfox-task-engine@main/redfox-task-engine.js"></script>
```

## Markup

Use matching task and answer IDs, for example `T1` and `A1`:

```html
<div class="myContainer">
  <div class="myElem">
    <div class="taskEl" id="T1">Task text</div>
    <span class="answerEl" id="A1"></span>
  </div>
</div>
```

## API

After the existing Encounter checker confirms an answer, call `markAnswerCorrect(1)`. The task will be dimmed and `ВЕРНО` will appear.

For several tasks, call `markTasksCorrect([1, 2, 3])`.

This library handles presentation only. It does not validate answers or replace the existing Encounter checker; the checker must call the API after successful validation.
