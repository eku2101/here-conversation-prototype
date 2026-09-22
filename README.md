# In-Person Focus

A simple, responsive HTML/CSS/JavaScript prototype simulating a personalized notification filter for in-person conversations.

## Try it

Open `index.html` in a modern browser. No installation, dependencies, or build step required.

1. Activate **In-Person Focus Mode**.
2. Select important contacts: Mom, Best Friend, or Partner. Mom and Best Friend are selected initially.
3. Choose a fictional notification and click **Send test**.
4. Watch allowed messages appear on the phone and delayed messages collect under **Waiting for later**.
5. Turn Focus off to release all waiting messages. **Reset demo** clears messages and restores defaults.

## Filtering rules

| Notification | Focus on | Focus off |
| --- | --- | --- |
| Selected important contact | Allowed | Delivered |
| Unselected contact | Delayed | Delivered |
| Emergency, including unknown sender | Always allowed | Delivered |
| TikTok, Instagram, non-urgent group chat | Delayed | Delivered |

Contact settings unlock after activation. Changes apply to future incoming messages; existing delayed messages stay in the queue until Focus ends. Emergency priority is an explicit category in the simulated data, not an automatic emergency detection system. Low-priority notifications are delayed rather than deleted.

## Privacy and scope

This is a simulation. It does not access a phone, change device Focus settings, read contacts, detect emergencies, or send real notifications. All examples are fictional. State exists only in memory and resets on reload. No network requests or external dependencies are needed.

## Files and validation

- `index.html`: accessible controls and simulated phone interface
- `styles.css`: responsive visual design
- `app.js`: filtering, queue, and interface behavior
- `test.cjs`: regression checks; run `node test.cjs`

The earlier conversation-momentum experiment is preserved in the repository's commit history. This version focuses on the personalized notification filter.

## Personalized filtering and conversation state

Choose which low-priority types to block during Focus. Each incoming message displays ALLOWED or BLOCKED with its reason. BLOCKED means held quietly in the waiting queue, not deleted. Settings changes apply to future arrivals. Emergencies always override the filter.

Attention starts at 100%. Allowed low-priority alerts cost 15 points; allowed contact or emergency messages cost 5. Blocked alerts cost zero. Opening any message deliberately costs another 5 points, once per message. Dismiss removes a message without changing attention. Turning Focus off releases the waiting queue as a single interruption costing 5 points. Reconnect restores up to 10 points. Attention is clamped to 0–100. Mood is Positive at 80–100, Distracted at 50–79, and Disconnected below 50. These values are illustrative assumptions, not research findings or a measure of anyone's actual emotions. Blocking preserves the current state; it does not automatically restore attention already lost.

## Profile pictures

Expand **Sync profile pictures** to choose a PNG, JPG, or WebP up to 5 MB per contact. The same local picture appears in that contact's card and all current and future notifications, including held notifications. Pictures use in-memory object URLs, never upload, and do not sync with external accounts or real contacts. Replace a picture by selecting another file, or remove all pictures with the provided button. Reset and page reload clear them. Decoding is validated before applying a picture; stale uploads cannot restore photos after reset.
