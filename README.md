# Here — a conversation experiment

A simple HTML, CSS, and JavaScript prototype exploring how repeated phone notifications can interrupt an in-person conversation, and how intentional delivery might help.

## Run

Open `index.html` in a modern browser. No installation or build is required. The optional Google Fonts stylesheet falls back to system fonts offline.

## Explore

1. Choose **As they happen** and start the 60-second conversation.
2. Check your phone or let an alert wait. Watch the dialogue, momentum, and time present change.
3. Try **With intention**. Routine notifications are held; an urgent family message comes through.
4. Finish both modes to compare the latest results. Switching modes resets the current run. Pause freezes the simulation; reset starts a fresh run. Waiting messages are revealed at the end.

## Model and limitations

This is a fictional, illustrative model, not research evidence or a measurement of a real person's feelings. Momentum starts at 70, recovers 1 point per present second, loses 4 per delivered alert, and loses 12 per phone check. A check occupies 4 simulated seconds. Scores are clamped to 0–100. Six messages arrive at 8-second intervals from second 8 to second 48; the message at second 32 is urgent. The same schedule is used in both modes. User behavior affects comparisons, so these are not controlled causal results.

No real notifications, phone access, tracking, accounts, or data storage. Results exist only in memory and disappear on page reload. The simulated clock advances once per timer callback and may slow in background tabs.

## Files

- `index.html` — semantic interface
- `styles.css` — responsive layout and styling
- `app.js` — simulation, notification queue, and comparison

## Reflection

When is checking a phone appropriate? What should count as urgent? Would agreeing on a pause together feel different from quietly checking? How could a future user study test this model's assumptions?
