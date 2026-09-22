# In-Person Focus — Learning Notes

These notes summarize the documented development process. They are not a record of participant research or a substitute for the creator's own personal reflection.

## From observation to a prototype

The starting observation concerned repeated phone checking during in-person conversations and its possible effect on momentum and engagement. The project developed into a selective notification filter that makes choices and their simulated consequences visible.

The initial version compared immediate and intentional delivery during a timed conversation. The project was then refocused on a user-controlled filter: important contacts, emergency messages, and low-priority updates. Later revisions added local profile pictures, message actions, and attention and mood indicators.

## Revisions and what they revealed

| Revision | Reason or insight |
| --- | --- |
| Added important contacts and emergency priority | Staying present should still allow communication the user considers important. |
| Added configurable low-priority categories | Personalization needs choices beyond a single on/off switch. |
| Added explicit ALLOWED / BLOCKED results | The relationship between a setting and an outcome should be visible. |
| Added attention and mood indicators | The original social observation needed a visual representation in the simulation. |
| Added Open and Dismiss actions | Users should be able to explore how their own responses affect the modeled conversation. |
| Kept contacts editable when Focus is off | Disabled controls were mistaken for broken controls during development. |
| Formatted and commented the source | The project should be understandable and modifiable by its creator. |

## What the code makes explicit

Representing a social phenomenon with code requires assumptions. The prototype specifies which messages count as emergencies, what an interruption costs, and how attention maps to mood. Those choices make the experiment understandable, but they also limit what its results mean.

For example, blocking two low-priority notifications preserves attention because the code assigns blocked messages zero cost. That result demonstrates the rule working. It does not prove that real people would retain a particular percentage of attention or feel a particular emotion.

The distinction between a useful interruption and a distracting one also matters. A message from Mom may be welcome while still drawing attention away from the person in front of the user. The model allows that tradeoff rather than treating all interruptions as equally undesirable.

## Role of AI assistance

The creator supplied the initial observation, project purpose, feature requests, constraints, and feedback about confusing interactions. Codex assisted with generating and revising the HTML, CSS, JavaScript, tests, documentation, and GitHub commits.

The design evolved through that exchange. The creator's report that Important Contacts seemed unclickable led to a clearer interaction flow. These documentation drafts were also prepared with AI assistance and should be reviewed by the creator for accuracy and supplemented with their own reflections before submission.

## What has been checked

Development checks cover filtering with Focus on and off, contact selection, emergency overrides, blocked categories, queue release, reset behavior, attention bounds, mood transitions, the one-time opening cost, and reconnecting. Browser checks also confirmed selected interactions, including a blocked notification preserving 100% attention and Positive mood.

These checks verify implementation behavior. They do not establish usability for a broader audience, accessibility compliance, or benefits to real conversations. No formal participant study is documented in this project.

## Questions still open

- Who should decide what counts as an emergency, and how could a real system handle mistakes?
- Would agreeing with the other person about phone use change the experience?
- Does a mood label oversimplify the other person's reaction?
- How would the filter work when a normally low-priority message becomes important?
- Would releasing a batch at the end create a different kind of distraction?
- What observations would support or challenge the idea that selective filtering helps?

## Personal reflection prompts

The creator can add their own answers before submitting:

1. What specific moment or pattern led me to choose this phenomenon?
2. Which prototype behavior best represents what I noticed, and which feels least realistic?
3. What did I change after trying the prototype myself?
4. What did AI help me do, and which generated choices did I question or revise?
5. What would I change after feedback from my professor or classmates?
