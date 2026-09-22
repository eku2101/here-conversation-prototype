# In-Person Focus

A self-contained conceptual prototype exploring whether selective notification filtering can help people stay present in a conversation while allowing important communication through. It does not recreate or control Apple's Focus system.

## Project guide

The starting observation is that repeatedly checking a phone during an in-person conversation can seem to interrupt its momentum and leave the other person less engaged. This project turns that observation into an interactive model that invites exploration rather than claiming to prove an effect.

- **README.md** (this document): project overview, instructions, and implementation guide.
- **[Design.md](Design.md)**: the question, design decisions, and how the phenomenon is represented in code.
- **[Learningnotes.md](Learningnotes.md)**: documented revisions, the role of AI assistance, limitations, and questions for further reflection.

For a quick demonstration, reset the app, leave Focus off, and send two TikTok notifications. Attention falls from 100% to 70%, and mood becomes Distracted. Reset again, turn Focus on with TikTok blocked, and send the same two notifications: attention remains at 100% and mood stays Positive. Then send a message from selected contact Mom: it is allowed, and attention falls to 95%. These outcomes follow the programmed rules; they are not experimental evidence about real conversations.

## Open and explore

Double-click `index.html` to open it in a modern browser. No installation, internet connection, build step, or server is required.

1. Choose important contacts and blocked notification categories. These controls work even when Focus is off.
2. Turn on **In-Person Focus Mode** to apply your choices.
3. Select a fictional notification and click **Send test**.
4. Read its **ALLOWED / BLOCKED** result and watch Attention and Conversation Mood.
5. Open or dismiss a message, try other settings, or take a moment to reconnect.

Turning Focus off releases waiting messages as one batch. **Reset demo** restores initial settings, 100% attention, Positive mood, and clears messages and profile pictures.

## How filtering works

| Incoming message                | Focus on       | Focus off |
| ------------------------------- | -------------- | --------- |
| Emergency                       | Always allowed | Allowed   |
| Selected contact                | Allowed        | Allowed   |
| Unselected contact              | Blocked        | Allowed   |
| Checked low-priority category   | Blocked        | Allowed   |
| Unchecked low-priority category | Allowed        | Allowed   |

BLOCKED means held quietly under **Waiting for later**, not deleted. Changing settings affects new arrivals. You can deliberately open a held message, which costs attention. Emergency status is part of the fictional sample data; the app does not detect real emergencies.

## Understand and edit the code

The application uses only these three files:

- **index.html** — page structure, contact/category controls, and simulated phone. Edit labels and explanatory text here.
- **styles.css** — colors, spacing, responsive layouts, and notification styles. Shared colors are defined in `:root` at the beginning.
- **app.js** — sample messages, session variables, filtering, rendering, and event handlers, with comments marking the main sections.

Useful starting points in `app.js`:

- `messages`: change fictional senders and notification text.
- `active`, `selected`, `blockedTypes`: Focus and filter settings.
- `attention`, `conversationMood`: current conversation state.
- `decision()`: determines whether an incoming notification is allowed.
- `changeAttention()`: clamps attention to 0–100 and derives the mood.
- `render()`: updates the UI from the variables.
- The `send` event handler: applies an interruption cost and routes the message.
- `interact()`: handles opening and dismissing a message.

## Conversation assumptions

These are design assumptions for exploration, not scientific measurements of feelings:

- Start at 100% attention and Positive mood.
- An allowed low-priority notification costs 15 attention points.
- An allowed contact or emergency message costs 5 points.
- A blocked notification costs no points and preserves the current mood.
- Opening a message costs 5 additional points, once per message.
- Dismissing a message costs nothing.
- Releasing a waiting batch when Focus ends costs 5 points total.
- Reconnecting restores up to 10 points.
- Mood is Positive at 80–100, Distracted at 50–79, and Disconnected below 50.

Blocking prevents further loss; it does not automatically restore attention. The interface also explains these rules under **How the simulation works**.

## Pictures and privacy

**Sync profile pictures** lets you choose a PNG, JPG, or WebP up to 5 MB per contact. The picture updates that contact's card and existing/future notifications in this tab. This is local visual syncing, not integration with real contacts or accounts.

Everything stays in JavaScript memory. There is no database, login, external API, backend, analytics, or localStorage. Pictures are local object URLs, never uploaded. Reloading or resetting clears the session. No external fonts, scripts, or images are required.

## Optional developer checks

`test.cjs` contains regression checks. If Node.js is already installed, run `node test.cjs`. This file is not loaded by the application and Node.js is not needed to use the prototype.
