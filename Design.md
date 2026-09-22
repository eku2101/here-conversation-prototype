# In-Person Focus — Design

## The idea

The project began with an everyday observation: when someone repeatedly checks their phone while talking with another person, the conversation can lose momentum and the other person may become less engaged.

The design question is: **Could a personalized notification filter help someone remain present in an in-person conversation while still allowing important communication through?**

The intended user is a person who wants to give someone their attention without feeling completely unreachable. This is a conceptual prototype, not a replacement for an operating system's Focus settings.

## Representing the phenomenon with code

The prototype makes an otherwise hard-to-see change in attention visible. A user selects a fictional notification, the code evaluates the filter settings, and the interface shows the outcome alongside the simulated conversation state.

| Part of the experience                      | Representation in the prototype                       |
| ------------------------------------------- | ----------------------------------------------------- |
| Choosing to protect a conversation          | `active`, controlled by the Focus switch              |
| Deciding who is important                   | `selected`, a set of allowed contacts                 |
| Deciding which updates can wait             | `blockedTypes`, a set of notification categories      |
| Receiving a notification                    | A fictional entry from `messages`                     |
| Applying a personalized filter              | `decision()` returns an allow/block result and reason |
| Staying present or becoming distracted      | `attention`, a value from 0 to 100                    |
| The conversation's apparent emotional state | `conversationMood`, derived from attention            |
| Returning to the conversation               | A reconnect button that restores attention            |

Mood is calculated from attention; it is not an independent observation of another person's feelings. The numbers are deliberately simple and editable so the model's assumptions can be questioned.

## Interaction flow

1. Choose important contacts and blocked categories. Settings remain editable whether Focus is on or off.
2. Activate Focus to apply the filter.
3. Send a simulated notification.
4. JavaScript checks emergency priority, Focus status, and the relevant contact or category setting.
5. The interface displays **ALLOWED** or **BLOCKED**, with an explanation.
6. An allowed notification affects attention. A blocked notification preserves the current attention and mood.
7. Open or dismiss individual messages, reconnect, or continue trying other notifications.

Emergency messages always get through. Their priority is explicitly assigned in the sample data; the prototype does not infer urgency from a real message.

## Main design decisions

### Selectivity rather than complete silence

Important contacts and emergency messages can still interrupt. This represents a tradeoff: communication can be worth an interruption, even when it has an attention cost.

### Visible reasons for each outcome

An ALLOWED or BLOCKED label alone would not explain the filter. Each notification also states why it received that result, such as an important contact, blocked category, or Focus being off.

### Blocking means waiting

Blocked notifications move to a waiting queue instead of being deleted. Users can deliberately open a held message or turn Focus off to release the batch. This keeps the distinction between preventing an interruption and losing information clear.

### Editable settings before activation

An earlier version disabled contact choices until Focus was active. The project creator noticed that the contacts seemed no longer clickable. The revised version keeps settings editable and explains that they apply when Focus is on. This change responds to a specific usability observation during development.

### Personalization without account integration

Users can choose local profile pictures, which appear consistently on contact cards and notifications. This makes the simulation more personal without requiring real contacts, authentication, or uploads. Pictures remain in the current tab only.

### Visible conversation state

Attention is shown as a percentage and progress bar, and mood is named in text. The prototype starts at **Attention: 100%** and **Conversation Mood: Positive**. The exact costs and thresholds are documented in the [README](README.md#conversation-assumptions) and in the interface.

## Scope and limitations

The implementation uses HTML for structure, CSS for appearance, and vanilla JavaScript for state and behavior. It can run by opening `index.html` directly. There is no backend, database, external API, or persistent browser storage.

The simulation assumes that every allowed notification has an immediate attention cost, even before it is opened. It also assigns different costs by category and ties mood directly to attention. Real reactions may depend on the people, topic, timing, expectations, and importance of a message. The prototype does not measure those factors or establish that the proposed filter improves real conversations.

## A possible next evaluation

Ask someone to configure the filter, predict what will happen to a few messages, and explain the results afterward. Observe whether they understand the settings, the waiting queue, and the distinction between important and distracting interruptions. Ask which assumptions feel inaccurate. This would evaluate the clarity of the design; a claim about real conversational benefit would require a separate study.

## Visual direction and first visit

The interface uses [Figma's California beaches palette](https://www.figma.com/resource-library/color-combinations/#combination-29-california-beaches): orange `#FFC067`, aqua `#66F4FF`, sky blue `#66C4FF`, and blue-gray `#7D99AA`. Pale surfaces and dark blue text support readability.

A brief first-visit introduction distinguishes this simulation from Apple's real notification controls. Apple Focus already supports selected people and apps; the prototype's distinguishing purpose is to visualize assumed conversation effects. The comparison references [Apple's Focus guide](https://support.apple.com/guide/iphone/allow-or-silence-notifications-for-a-focus-iph21d43af5b/ios).

Only a dismissed-introduction flag is saved in localStorage. If storage is unavailable, the introduction may appear again after reload; the app remains usable. The footer button reopens it anytime. Resetting the simulation does not reset this preference.
