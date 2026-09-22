const vm = require("node:vm");
const fs = require("node:fs");
const assert = require("node:assert/strict");
class Element {
  constructor() {
    this.children = [];
    this.listeners = {};
    this.classList = { toggle() {} };
  }
  showModal() {
    this.open = true;
  }
  close() {
    this.open = false;
    this.listeners.close?.();
  }
  addEventListener(name, fn) {
    this.listeners[name] = fn;
  }
  setAttribute(name, value) {
    this[name] = value;
  }
  append(...items) {
    this.children.push(...items);
  }
  replaceChildren() {
    this.children = [];
  }
}
const elements = new Map();
const inputs = ["Mom", "Best Friend", "Partner"].map((value) =>
  Object.assign(new Element(), { value, checked: value !== "Partner" }),
);
const get = (id) => {
  if (!elements.has(id)) elements.set(id, new Element());
  return elements.get(id);
};
const context = vm.createContext({
  document: {
    getElementById: get,
    querySelector: get,
    querySelectorAll: (selector) =>
      selector === "#contact-settings input" ? inputs : [],
    createElement: () => new Element(),
  },
});
vm.runInContext(fs.readFileSync("app.js", "utf8"), context);
const click = (id) => get(id).listeners.click();
const send = (value) => {
  get("message-type").value = value;
  click("send");
};
assert.equal(get("contact-settings").disabled, false);
send("tiktok");
assert.equal(get("delivered-count").textContent, "1 received");
click("focus-toggle");
assert.equal(get("contact-settings").disabled, false);
send("mom");
send("friend");
send("emergency");
assert.equal(get("delivered-count").textContent, "4 received");
send("partner");
send("tiktok");
send("instagram");
send("group");
assert.equal(get("queue-count").textContent, 4);
inputs[0].checked = false;
inputs[0].listeners.change();
send("mom");
assert.equal(get("queue-count").textContent, 5);
inputs[2].checked = true;
inputs[2].listeners.change();
send("partner");
assert.equal(get("delivered-count").textContent, "5 received");
assert.equal(get("queue-count").textContent, 5);
inputs.forEach((input) => {
  input.checked = false;
  input.listeners.change();
});
send("emergency");
assert.equal(get("delivered-count").textContent, "6 received");
click("focus-toggle");
assert.equal(get("queue-count").textContent, 0);
assert.equal(get("delivered-count").textContent, "11 received");
click("focus-toggle");
click("focus-toggle");
assert.equal(get("delivered-count").textContent, "11 received");
click("reset");
assert.equal(get("delivered-count").textContent, "0 received");
assert.equal(get("queue-count").textContent, 0);
assert.equal(get("focus-toggle")["aria-checked"], "false");
assert.equal(inputs[0].checked, true);
assert.equal(inputs[2].checked, false);
vm.runInContext(
  "for(let i=0;i<20;i++){ changeAttention(-15,'test'); } render();",
  context,
);
assert.equal(get("attention").value, 0);
assert.equal(get("mood").textContent, "Disconnected");
click("reset");
click("focus-toggle");
send("tiktok");
assert.equal(get("attention").value, 100);
send("mom");
assert.equal(get("attention").value, 95);
vm.runInContext(
  "interact(delivered[0], 'open'); interact(delivered[0], 'open');",
  context,
);
assert.equal(get("attention").value, 90);
vm.runInContext("blockedTypes.delete('tiktok');", context);
send("tiktok");
assert.equal(get("attention").value, 75);
assert.equal(get("mood").textContent, "Distracted");
click("reconnect");
assert.equal(get("attention").value, 85);
assert.equal(get("mood").textContent, "Positive");
click("reset");
assert.equal(get("attention").value, 100);
console.log(
  "PASS: attention bounds, mood transitions, blocked attention preservation, category opt-out, single open penalty, reconnect, Focus off/on, contact selection, emergency override, all low-priority types, delayed queue release without duplication, and reset.",
);

// The explanation opens before the demo and remains available after dismissal.
assert.equal(get("welcome").open, true);
click("welcome-start");
assert.equal(get("welcome").open, false);
click("about-prototype");
assert.equal(get("welcome").open, true);
