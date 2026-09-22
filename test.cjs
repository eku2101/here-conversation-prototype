// Run with: node test.cjs. Exercise complete simulation sessions with a minimal DOM.
const vm = require('node:vm');
const fs = require('node:fs');
const assert = require('node:assert/strict');
class Element {
  constructor() { this.children = []; this.listeners = {}; }
  addEventListener(name, fn) { this.listeners[name] = fn; }
  setAttribute(name, value) { this[name] = value; }
  append(el) { this.children.push(el); }
  replaceChildren() { this.children = []; }
}
const elements = new Map();
const radios = [new Element(), new Element()];
radios[0].value = 'instant'; radios[1].value = 'intentional';
let callback;
const context = vm.createContext({
  document: { getElementById: id => { if (!elements.has(id)) elements.set(id, new Element()); return elements.get(id); }, querySelectorAll: () => radios, createElement: () => new Element() },
  setInterval: fn => { callback = fn; return 1; }, clearInterval: () => { callback = null; }
});
vm.runInContext(fs.readFileSync('app.js', 'utf8'), context);
const click = id => elements.get(id).listeners.click();
const advance = count => { for(let i = 0; i < count; i++) callback(); };
click('start'); advance(60);
assert.equal(elements.get('interruptions').textContent, 6);
assert.equal(elements.get('present').textContent, '60s');
assert.equal(elements.get('check').disabled, true);
assert.equal(callback, null);
radios[1].listeners.change(); click('start'); advance(24);
assert.equal(elements.get('interruptions').textContent, 0);
assert.equal(elements.get('held').textContent, '3 held');
advance(8);
assert.equal(elements.get('interruptions').textContent, 1);
click('check'); assert.equal(elements.get('checks').textContent, 1);
assert.equal(elements.get('check').disabled, true);
advance(4); assert.equal(elements.get('present').textContent, '32s');
click('start'); assert.equal(callback, null);
click('start'); advance(24);
assert.equal(elements.get('present').textContent, '56s');
assert.equal(elements.get('summary').hidden, false);
assert.match(elements.get('summary').children.at(-1).textContent, /Latest runs/);
click('reset'); assert.equal(elements.get('time').textContent, '0 / 60 seconds');
radios[0].listeners.change(); click('start'); advance(8); click('defer');
assert.equal(elements.get('held').textContent, '1 held');
assert.equal(elements.get('checks').textContent, 0);
console.log('PASS: both modes, urgent delivery, batching, attention time, pause/resume, reset, deferral, and comparison.');
