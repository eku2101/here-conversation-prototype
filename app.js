// In-Person Focus: a browser-only conceptual experiment.
// Read top to bottom: sample data, state, filtering, rendering, interactions.

const $ = (id) => document.getElementById(id);
// Edit these fictional messages to try different situations.
const messages = {
  mom: {
    sender: "Mom",
    category: "contact",
    text: "Can you call me when you have a moment?",
  },
  friend: {
    sender: "Best Friend",
    category: "contact",
    text: "I got the job! I wanted you to know first.",
  },
  partner: {
    sender: "Partner",
    category: "contact",
    text: "What time should I meet you?",
  },
  emergency: {
    sender: "Unknown contact",
    category: "emergency",
    text: "Emergency: there has been an accident. Please call me now.",
  },
  tiktok: {
    sender: "TikTok",
    category: "low",
    text: "A creator you follow just posted a new video.",
  },
  instagram: {
    sender: "Instagram",
    category: "low",
    text: "Someone liked your photo.",
  },
  group: {
    sender: "Weekend plans",
    category: "low",
    text: "Group chat: should we try that new brunch spot?",
  },
};
// Session state. Reloading the page restores defaults; no storage or server is used.
let active = false,
  attention = 100,
  conversationMood = "Positive";
let selected = new Set(["Mom", "Best Friend"]);
let blockedTypes = new Set(["tiktok", "instagram", "group"]);
let delivered = [],
  delayed = [];
const photos = new Map(),
  photoVersions = new Map();
// Filtering has no side effects. Emergency priority always wins.
function decision(message, focus, contacts, blocked = blockedTypes) {
  if (message.category === "emergency")
    return { allow: true, reason: "Emergency messages always come through" };
  if (!focus) return { allow: true, reason: "Focus is off" };
  if (message.category === "contact")
    return {
      allow: contacts.has(message.sender),
      reason: contacts.has(message.sender)
        ? "Important contact"
        : "Contact not selected",
    };
  return {
    allow: !blocked.has(message.type),
    reason: blocked.has(message.type)
      ? "Category is blocked"
      : "Category is allowed",
  };
}
// Illustrative mood thresholds: edit these to explore other assumptions.
function changeAttention(amount, explanation) {
  attention = Math.max(0, Math.min(100, attention + amount));
  conversationMood =
    attention >= 80
      ? "Positive"
      : attention >= 50
        ? "Distracted"
        : "Disconnected";
  $("effect").textContent = explanation;
}
function avatar(element, sender) {
  element.replaceChildren();
  if (photos.has(sender)) {
    const img = document.createElement("img");
    img.src = photos.get(sender);
    img.alt = "";
    element.append(img);
  } else element.textContent = sender[0];
}
function interact(message, action) {
  if (action === "open" && !message.opened) {
    message.opened = true;
    changeAttention(
      -5,
      `You opened ${message.sender}'s message. Attention −5 points.`,
    );
    $("feedback").textContent =
      `${message.sender}: opened in the demo. No reply was sent.`;
  } else if (action === "dismiss") {
    delivered = delivered.filter((item) => item !== message);
    delayed = delayed.filter((item) => item !== message);
    $("feedback").textContent =
      `${message.sender}: dismissed. Attention unchanged.`;
  }
  render();
}
// Build cards safely with textContent instead of inserting message HTML.
function renderMessages(container, items, empty) {
  container.replaceChildren();
  if (!items.length) {
    const p = document.createElement("p");
    p.className = "empty";
    p.textContent = empty;
    container.append(p);
    return;
  }
  items
    .slice()
    .reverse()
    .forEach((message) => {
      const article = document.createElement("article");
      article.className = `notification ${message.category === "emergency" ? "emergency" : ""}`;
      const top = document.createElement("div");
      top.className = "notification-top";
      const picture = document.createElement("span");
      picture.className = "avatar";
      avatar(picture, message.sender);
      const sender = document.createElement("strong");
      sender.textContent = message.sender;
      const time = document.createElement("span");
      time.textContent = message.time;
      top.append(picture, sender, time);
      const outcome = document.createElement("span");
      outcome.className = `outcome ${message.outcome.toLowerCase()}`;
      outcome.textContent = message.outcome;
      const body = document.createElement("p");
      body.textContent = message.text;
      const reason = document.createElement("small");
      reason.textContent = message.reason;
      const actions = document.createElement("div");
      actions.className = "notification-actions";
      const open = document.createElement("button");
      open.className = "text-button";
      open.textContent = message.opened ? "Opened" : "Open (−5%)";
      open.disabled = !!message.opened;
      open.setAttribute("aria-label", `Open message from ${message.sender}`);
      open.addEventListener("click", () => interact(message, "open"));
      const dismiss = document.createElement("button");
      dismiss.className = "text-button";
      dismiss.textContent = "Dismiss";
      dismiss.setAttribute(
        "aria-label",
        `Dismiss message from ${message.sender}`,
      );
      dismiss.addEventListener("click", () => interact(message, "dismiss"));
      actions.append(open, dismiss);
      article.append(top, outcome, body, reason, actions);
      container.append(article);
    });
}
// Keep every visible indicator in sync with the current state.
function render() {
  $("focus-toggle").setAttribute("aria-checked", String(active));
  $("contact-settings").disabled = false;
  $("category-settings").disabled = false;
  $("focus-description").textContent = active
    ? "Focus is on. Your conversation comes first."
    : "Choose your settings anytime. Turn on Focus to apply them.";
  $("settings-status").textContent = active
    ? `${selected.size} contacts allowed`
    : "Settings apply when Focus is on";
  $("phone-title").textContent = active
    ? "Here, in the moment."
    : "You're available";
  $("phone-description").textContent = active
    ? "Your selected contacts and categories can reach you. Emergencies always get through."
    : "All notifications can come through.";
  $("phone-badge").textContent = active ? "◎ In-Person Focus on" : "Focus off";
  document.querySelector(".phone").classList.toggle("active", active);
  $("delivered-count").textContent = `${delivered.length} received`;
  $("queue-count").textContent = delayed.length;
  $("attention").value = attention;
  $("attention").textContent = `${attention}%`;
  $("attention-value").textContent = `${attention}%`;
  $("mood").textContent = conversationMood;
  $("reconnect").disabled = attention === 100;
  document
    .querySelectorAll("[data-avatar]")
    .forEach((el) => avatar(el, el.dataset.avatar));
  renderMessages(
    $("delivered"),
    delivered,
    "Your phone is quiet for now. Send a test notification to begin.",
  );
  renderMessages(
    $("delayed"),
    delayed,
    "Nothing waiting. A little breathing room.",
  );
}
$("focus-toggle").addEventListener("click", () => {
  active = !active;
  if (!active) {
    const count = delayed.length;
    delivered.push(
      ...delayed.map((m) => ({
        ...m,
        outcome: "RELEASED",
        reason: "Originally BLOCKED · Focus ended",
      })),
    );
    delayed = [];
    if (count)
      changeAttention(
        -5,
        "Waiting notifications released as one batch. Attention −5 points.",
      );
    $("feedback").textContent =
      `Focus is off. ${count} waiting notifications released${count ? " as one interruption" : ""}.`;
  } else
    $("feedback").textContent =
      "Focus is on. Choose contacts and blocked categories, then send a test.";
  render();
});
document.querySelectorAll("#contact-settings input").forEach((input) =>
  input.addEventListener("change", () => {
    if (input.checked) selected.add(input.value);
    else selected.delete(input.value);
    $("feedback").textContent =
      `${input.value}: ${input.checked ? "allowed" : "blocked"} for new messages.`;
    render();
  }),
);
document.querySelectorAll("#category-settings input").forEach((input) =>
  input.addEventListener("change", () => {
    if (input.checked) blockedTypes.add(input.value);
    else blockedTypes.delete(input.value);
    $("feedback").textContent =
      `${messages[input.value].sender}: ${input.checked ? "blocked" : "allowed"} for new notifications.`;
    render();
  }),
);
$("send").addEventListener("click", () => {
  const type = $("message-type").value,
    message = { ...messages[type], type };
  const result = decision(message, active, selected);
  const item = {
    ...message,
    outcome: result.allow ? "ALLOWED" : "BLOCKED",
    reason: result.reason,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
  if (result.allow) {
    delivered.push(item);
    const cost = message.category === "low" ? 15 : 5;
    changeAttention(
      -cost,
      `${message.sender} interrupted. Attention −${cost} points.`,
    );
  } else {
    delayed.push(item);
    changeAttention(
      0,
      `${message.sender} was blocked. Attention and mood preserved.`,
    );
  }
  $("feedback").textContent =
    `${message.sender}: ${item.outcome} — ${result.reason}. Attention ${attention}%, mood ${conversationMood}.`;
  render();
});
$("reconnect").addEventListener("click", () => {
  changeAttention(
    10,
    "You returned your attention to the conversation. Up to 10 points restored.",
  );
  render();
});
// Photos are local object URLs. Release old URLs and cancel pending updates.
function clearPhotos() {
  for (const url of photos.values()) URL.revokeObjectURL(url);
  photos.clear();
  document.querySelectorAll("[data-photo]").forEach((input) => {
    input.value = "";
    photoVersions.set(
      input.dataset.photo,
      (photoVersions.get(input.dataset.photo) || 0) + 1,
    );
  });
}
document.querySelectorAll("[data-photo]").forEach((input) =>
  input.addEventListener("change", async () => {
    const sender = input.dataset.photo,
      file = input.files[0];
    const version = (photoVersions.get(sender) || 0) + 1;
    photoVersions.set(sender, version);
    if (!file) return;
    if (
      !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      $("photo-feedback").textContent =
        "Choose a PNG, JPG, or WebP image up to 5 MB.";
      input.value = "";
      return;
    }
    const url = URL.createObjectURL(file),
      img = new Image();
    img.src = url;
    try {
      await img.decode();
      if (photoVersions.get(sender) !== version) {
        URL.revokeObjectURL(url);
        return;
      }
      if (photos.has(sender)) URL.revokeObjectURL(photos.get(sender));
      photos.set(sender, url);
      render();
      $("photo-feedback").textContent =
        `${sender}'s picture is synced across this demo.`;
    } catch {
      URL.revokeObjectURL(url);
      if (photoVersions.get(sender) === version)
        $("photo-feedback").textContent =
          "That image could not be read. Try another picture.";
    }
  }),
);
$("clear-photos").addEventListener("click", () => {
  clearPhotos();
  render();
  $("photo-feedback").textContent = "All profile pictures removed.";
});
$("reset").addEventListener("click", () => {
  active = false;
  selected = new Set(["Mom", "Best Friend"]);
  blockedTypes = new Set(["tiktok", "instagram", "group"]);
  delivered = [];
  delayed = [];
  clearPhotos();
  document.querySelectorAll("#contact-settings input").forEach((input) => {
    input.checked = selected.has(input.value);
  });
  document.querySelectorAll("#category-settings input").forEach((input) => {
    input.checked = true;
  });
  attention = 100;
  changeAttention(0, "Ready for a conversation.");
  $("message-type").value = "mom";
  $("queue-details").open = false;
  $("feedback").textContent =
    "Demo reset. Turn on Focus to personalize your filter.";
  $("photo-feedback").textContent = "PNG, JPG, or WebP · up to 5 MB each.";
  render();
});
render();
