const $ = id => document.getElementById(id);
const schedule = [
  { at: 8, from: 'Group chat', text: 'Anyone free for dinner on Friday?' },
  { at: 16, from: 'Social', text: 'Someone liked your photo.' },
  { at: 24, from: 'Shopping', text: 'Your saved item is back in stock.' },
  { at: 32, from: 'Family · urgent', text: 'Locked out. Could you call me?', urgent: true },
  { at: 40, from: 'Email', text: 'Your weekly roundup is ready.' },
  { at: 48, from: 'Group chat', text: 'Friday works for me!' }
];
let mode = 'instant', timer, state;
const previous = {};
function reset() {
  clearInterval(timer); timer = null;
  state = { time: 0, momentum: 70, checks: 0, alerts: 0, present: 0, away: 0, held: [], inbox: [], running: false, done: false, points: ['0,36'] };
  $('summary').hidden = true;
  $('notification').innerHTML = '<p class="empty">Nothing needs your attention.<br>Enjoy the moment.</p>';
  $('delivery-note').textContent = mode === 'intentional' ? 'Routine updates wait until the end. The urgent message still comes through at 32 seconds.' : 'Updates will arrive at 8, 16, 24, 32, 40, and 48 seconds.';
  render();
}
function render() {
  $('time').textContent = `${state.time} / 60 seconds`;
  $('score').textContent = `${state.momentum} / 100`;
  $('engagement').value = state.momentum;
  $('trace').setAttribute('points', state.points.join(' '));
  $('chart-title').textContent = `Illustrative conversation momentum: ${state.momentum} out of 100 after ${state.time} seconds`;
  $('checks').textContent = state.checks;
  $('interruptions').textContent = state.alerts;
  $('present').textContent = `${state.present}s`;
  $('held').textContent = `${state.held.length} held`;
  $('start').textContent = state.done ? 'Run again ↻' : state.running ? 'Pause conversation Ⅱ' : state.time ? 'Resume conversation →' : 'Start conversation →';
  $('status').textContent = state.done ? 'Conversation complete' : state.running ? 'Conversation in progress' : state.time ? 'Paused' : 'Ready when you are';
  $('attention').textContent = state.away ? 'Checking phone' : 'Present';
  $('feeling').textContent = state.momentum >= 70 ? 'Engaged' : state.momentum >= 40 ? 'Losing the thread' : 'Feeling disconnected';
  $('connection').textContent = state.away ? 'Attention elsewhere' : state.momentum >= 70 ? 'Room to connect' : 'Finding the rhythm';
  $('dialogue').textContent = state.done ? '“Thanks for making some time to catch up.”' : state.away ? '“I’ll wait… let me know when you’re ready.”' : state.momentum < 40 ? '“Maybe we can talk about it another time.”' : state.momentum < 70 ? '“Where was I? Oh, right…”' : state.time < 15 ? '“I’ve been wanting to tell you about something…”' : state.time < 35 ? '“I’m thinking about trying something new. It’s a little scary.”' : '“It helps to talk it through with you.”';
  $('check').disabled = !state.running || !!state.away || !(state.inbox.length + state.held.length);
  $('defer').disabled = !state.running || !state.inbox.length;
}
function showInbox() {
  const item = state.inbox.at(-1);
  $('notification').replaceChildren();
  if (!item) {
    const p = document.createElement('p'); p.className = 'empty';
    p.textContent = state.held.length ? `${state.held.length} updates are waiting quietly.` : 'Nothing needs your attention. Enjoy the moment.';
    $('notification').append(p); return;
  }
  const box = document.createElement('div'); box.className = 'notice';
  for (const [tag, value] of [['strong', item.from], ['p', item.text], ['small', `${state.inbox.length} unread · ${item.urgent ? 'Urgent' : 'Routine'}`]]) {
    const el = document.createElement(tag); el.textContent = value; box.append(el);
  }
  $('notification').append(box);
}
function recordPoint() { state.points.push(`${state.time * 10},${92 - state.momentum * .8}`); }
function tick() {
  state.time++;
  if (state.away) state.away--; else { state.present++; state.momentum = Math.min(100, state.momentum + 1); }
  const item = schedule.find(n => n.at === state.time);
  if (item) {
    if (mode === 'intentional' && !item.urgent) state.held.push(item);
    else { state.inbox.push(item); state.alerts++; state.momentum = Math.max(0, state.momentum - 4); }
    showInbox();
  }
  recordPoint();
  if (state.time === 60) finish();
  render();
}
function finish() {
  clearInterval(timer); timer = null; state.running = false; state.done = true;
  previous[mode] = { momentum: state.momentum, checks: state.checks, present: state.present, alerts: state.alerts };
  const waiting = [...state.inbox, ...state.held];
  $('summary').replaceChildren();
  const p = document.createElement('p');
  p.textContent = `Conversation complete. You spent ${state.present} of 60 seconds present and checked your phone ${state.checks} times. Final illustrative momentum: ${state.momentum}/100.`;
  $('summary').append(p);
  if (waiting.length) {
    const heading = document.createElement('strong'); heading.textContent = 'Your waiting updates'; $('summary').append(heading);
    const list = document.createElement('ul');
    waiting.sort((a,b) => a.at-b.at).forEach(n => { const li = document.createElement('li'); li.textContent = `${n.from}: ${n.text}`; list.append(li); });
    $('summary').append(list);
  }
  const comparison = document.createElement('p');
  comparison.textContent = previous.instant && previous.intentional ? `Latest runs — As they happen: ${previous.instant.alerts} alerts, ${previous.instant.checks} checks, ${previous.instant.present}s present, ${previous.instant.momentum}/100 momentum. With intention: ${previous.intentional.alerts} alerts, ${previous.intentional.checks} checks, ${previous.intentional.present}s present, ${previous.intentional.momentum}/100 momentum. Your checking choices affect this comparison.` : 'Try the other mode next. The notification timing stays the same; your choices can change.';
  $('summary').append(comparison); $('summary').hidden = false;
}
$('start').addEventListener('click', () => {
  if (state.done) reset();
  state.running = !state.running;
  if (state.running) timer = setInterval(tick, 1000); else { clearInterval(timer); timer = null; }
  render();
});
$('reset').addEventListener('click', reset);
document.querySelectorAll('input[name="mode"]').forEach(input => input.addEventListener('change', () => { mode = input.value; reset(); }));
$('check').addEventListener('click', () => {
  if (!state.running || state.away || !(state.inbox.length + state.held.length)) return;
  const count = state.inbox.length + state.held.length;
  state.checks++; state.away = 4; state.momentum = Math.max(0, state.momentum - 12);
  const messages = [...state.inbox, ...state.held].sort((a,b) => a.at-b.at);
  state.inbox = []; state.held = [];
  $('notification').replaceChildren();
  const p = document.createElement('p'); p.className = 'empty'; p.textContent = messages.map(n => `${n.from}: ${n.text}`).join(' · '); $('notification').append(p);
  $('delivery-note').textContent = `You checked ${count} update${count === 1 ? '' : 's'}. Attention returns in 4 seconds.`;
  recordPoint(); render();
});
$('defer').addEventListener('click', () => {
  if (!state.running || !state.inbox.length) return;
  state.held.push(...state.inbox); state.inbox = []; showInbox();
  $('delivery-note').textContent = 'Set aside for later. The conversation continues.';
  render();
});
reset();
