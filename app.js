const $ = id => document.getElementById(id);
const messages = {
  mom: { sender: 'Mom', category: 'contact', text: 'Can you call me when you have a moment?' },
  friend: { sender: 'Best Friend', category: 'contact', text: 'I got the job! I wanted you to know first.' },
  partner: { sender: 'Partner', category: 'contact', text: 'What time should I meet you?' },
  emergency: { sender: 'Unknown contact', category: 'emergency', text: 'Emergency: there has been an accident. Please call me now.' },
  tiktok: { sender: 'TikTok', category: 'low', text: 'A creator you follow just posted a new video.' },
  instagram: { sender: 'Instagram', category: 'low', text: 'Someone liked your photo.' },
  group: { sender: 'Weekend plans', category: 'low', text: 'Group chat: should we try that new brunch spot?' }
};
let active = false;
let selected = new Set(['Mom', 'Best Friend']);
let delivered = [];
let delayed = [];
function decision(message, focus, contacts) {
  if (!focus) return { allow: true, reason: 'Delivered · Focus is off' };
  if (message.category === 'emergency') return { allow: true, reason: 'Allowed · Emergency messages always come through' };
  if (message.category === 'contact' && contacts.has(message.sender)) return { allow: true, reason: 'Allowed · Important contact' };
  return { allow: false, reason: message.category === 'low' ? 'Delayed · Low-priority notification' : 'Delayed · Contact not selected' };
}
function renderMessages(container, items, empty) {
  container.replaceChildren();
  if (!items.length) {
    const p = document.createElement('p'); p.className = 'empty'; p.textContent = empty; container.append(p); return;
  }
  items.slice().reverse().forEach(message => {
    const article = document.createElement('article'); article.className = `notification ${message.category === 'emergency' ? 'emergency' : ''}`;
    const top = document.createElement('div'); top.className = 'notification-top';
    const sender = document.createElement('strong'); sender.textContent = message.sender;
    const time = document.createElement('span'); time.textContent = message.time;
    top.append(sender, time);
    const body = document.createElement('p'); body.textContent = message.text;
    const reason = document.createElement('small'); reason.textContent = message.reason;
    article.append(top, body, reason); container.append(article);
  });
}
function render() {
  $('focus-toggle').setAttribute('aria-checked', String(active));
  $('contact-settings').disabled = !active;
  $('focus-description').textContent = active ? 'Focus is on. Your conversation comes first.' : 'Turn on Focus to choose who can interrupt.';
  $('settings-status').textContent = active ? `${selected.size} contacts allowed` : 'Activate to customize';
  $('phone-title').textContent = active ? 'Here, in the moment.' : "You're available";
  $('phone-description').textContent = active ? 'Important people can reach you. Everything else can wait.' : 'All notifications can come through.';
  $('phone-badge').textContent = active ? '◎ In-Person Focus on' : 'Focus off';
  document.querySelector('.phone').classList.toggle('active', active);
  $('delivered-count').textContent = `${delivered.length} received`;
  $('queue-count').textContent = delayed.length;
  renderMessages($('delivered'), delivered, 'Your phone is quiet for now. Send a test notification to begin.');
  renderMessages($('delayed'), delayed, 'Nothing waiting. A little breathing room.');
}
$('focus-toggle').addEventListener('click', () => {
  active = !active;
  if (!active) {
    const count = delayed.length;
    delivered.push(...delayed.map(m => ({ ...m, reason: 'Released · Focus ended' })));
    delayed = [];
    $('feedback').textContent = `Focus is off. ${count ? `${count} waiting notification${count === 1 ? ' has' : 's have'} been released.` : 'All new notifications will appear.'}`;
  } else $('feedback').textContent = 'Focus is on. Choose your important contacts, then send a test notification.';
  render();
});
document.querySelectorAll('#contact-settings input').forEach(input => input.addEventListener('change', () => {
  if (input.checked) selected.add(input.value); else selected.delete(input.value);
  $('feedback').textContent = `${input.value} ${input.checked ? 'can now interrupt' : 'will wait until Focus ends'}. This applies to new messages.`;
  render();
}));
$('send').addEventListener('click', () => {
  const message = messages[$('message-type').value];
  const result = decision(message, active, selected);
  const item = { ...message, reason: result.reason, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
  if (result.allow) delivered.push(item); else delayed.push(item);
  $('feedback').textContent = `${message.sender}: ${result.reason}.`;
  render();
});
$('reset').addEventListener('click', () => {
  active = false; selected = new Set(['Mom', 'Best Friend']); delivered = []; delayed = [];
  document.querySelectorAll('#contact-settings input').forEach(input => { input.checked = selected.has(input.value); });
  $('message-type').value = 'mom'; $('queue-details').open = false;
  $('feedback').textContent = 'Demo reset. Turn on Focus to personalize your filter.';
  render();
});
render();
