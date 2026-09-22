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
