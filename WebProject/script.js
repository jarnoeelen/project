(function injectChatWidget() {
  const widget = document.createElement('div');
  widget.id = 'chatWidget';
  widget.className = 'chat-widget';
  widget.innerHTML = `
    <div class="chat-panel" id="chatPanel" hidden aria-label="Festival assistant chat">
      <div class="chat-panel-header">
        <div>
          <p class="eyebrow" style="margin:0 0 0.1rem;font-size:0.78rem">Festival Assistant</p>
          <p style="margin:0;font-weight:700;font-size:0.95rem">After Tomorrow</p>
        </div>
        <button class="chat-close" id="chatClose" aria-label="Close chat">&#x2715;</button>
      </div>
      <div class="chatbot-quick-replies" aria-label="Suggested questions">
        <button class="chatbot-chip" type="button" data-chat-question="Where is the festival?">Location</button>
        <button class="chatbot-chip" type="button" data-chat-question="When is the festival?">Dates</button>
        <button class="chatbot-chip" type="button" data-chat-question="How do I buy tickets?">Tickets</button>
        <button class="chatbot-chip" type="button" data-chat-question="Is the festival family friendly?">Family</button>
        <button class="chatbot-chip" type="button" data-chat-question="What workshops are there?">Workshops</button>
        <button class="chatbot-chip" type="button" data-chat-question="What food is available?">Food</button>
      </div>
      <div class="chatbot-window" id="chatbotWindow" aria-live="polite" role="log"></div>
      <form class="chatbot-form" id="festivalChatbotForm">
        <label class="sr-only" for="festivalChatbotInput">Type your question</label>
        <input id="festivalChatbotInput" name="question" type="text" placeholder="Ask anything about the festival…" autocomplete="off" />
        <button class="btn btn-primary" type="submit">Send</button>
      </form>
    </div>
    <button class="chat-toggle" id="chatToggle" aria-label="Open festival assistant" aria-expanded="false">
      <img src="images/peace.png" alt="" width="28" height="28" style="object-fit:contain;display:block" />
    </button>`;
  document.body.appendChild(widget);
}());

const THEME_KEY = 'mop_theme';
const MENU_KEY = 'mop_menu_open';
const CART_KEY = 'mop_cart';
const CHECKOUT_URL = '';
const root = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
const navToggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');
const cartCountEls = document.querySelectorAll('.cart-count');
const cartItemsEl = document.getElementById('cartItems');
const subtotalEl = document.getElementById('subtotal');
const vatEl = document.getElementById('vat');
const totalEl = document.getElementById('total');
const clearCartBtn = document.getElementById('clearCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutNotice = document.getElementById('checkoutNotice');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotForm = document.getElementById('festivalChatbotForm');
const chatbotInput = document.getElementById('festivalChatbotInput');
const chatbotQuickReplies = document.querySelectorAll('.chatbot-chip');
const festivalInfo = {
  location: 'After Tomorrow takes place in the alpine meadows of Tirol, Austria — surrounded by mountains and forest. The full address and a map are on the Practical Info page.',
  dates: 'The festival runs on Saturday 12 and Sunday 13 July. Gates open at 09:00 each day and the last act finishes around 22:30.',
  openinghours: 'Gates open at 09:00 on both days. The first workshop (Mindfulness in Nature) starts at 09:00 on Sunday, and main stage music begins mid-morning. The last act wraps up around 22:30.',
  tickets: 'There are three options: a Day Pass for one day, a Weekend Pass for both days, and a Family Pack covering two adults and two children under 12. Children under 5 are free, and under-12s get a half-price Day Pass. Head to the Tickets page to pick yours.',
  accessibility: 'The entire site is flat and barrier-free, with wide paths suitable for wheelchairs and buggies throughout. Accessible toilets are available across the grounds, and dedicated seating areas are positioned close to the stage.',
  family: 'Families are at the heart of After Tomorrow. There is a dedicated Family Zone, a supervised Kids Corner, a Quiet Space Tent, a nursing room, buggy parking, and child-friendly food at every stand. The Family page has all the details.',
  food: 'There are local food trucks spread across the site with Tirolean specialties, international street food, and plenty of vegetarian and vegan choices. All vendors display allergen information, and child-friendly portions are available everywhere.',
  transport: 'The easiest way is by train to Innsbruck, then a regional bus or festival shuttle. Bike parking is available near the entrance. If you drive, parking is limited so carpooling is encouraged. The Practical Info page has full travel directions.',
  contact: 'You can reach the team via the Contact page on this website. The help desk is open from 09:00 to 20:00 on both festival days.',
  game: 'There is a mini game on the Game page called Flying For Peace — a dove-flying game inspired by the festival. Give it a try between sets.',
  about: 'After Tomorrow is organised by Harmony for Tomorrow, an NGO that believes music builds real bridges between people. The festival combines concerts, workshops, and community to create something more than just a show.',
  schedule: 'The programme runs across both days with live sets, workshops, food breaks, and quieter moments in between. Doors open at 09:00 and the last act wraps around 22:30. A full timetable will be published closer to the festival.',
  safety: 'The site has visible staff throughout, clear signage, a dedicated first aid station, and support points where visitors can ask for help. If weather changes quickly in the mountains, follow staff directions and the on-site signage.',
  cashless: 'The festival operates mostly cashless — cards and contactless payment are accepted everywhere on site. There is no ATM inside the grounds, so arrive topped up if you prefer to have cash as a backup.',
  sustainability: 'Harmony for Tomorrow works hard to keep the festival low-impact: local suppliers, reusable cups, minimal plastic, and a waste sorting system on site. Arriving by train or bike is especially appreciated.',
  lineup: 'The six acts are AURORA (ethereal Norwegian folk-pop), Ludovico Einaudi (neoclassical piano), Bonobo (British downtempo and electronic), Sixpence None The Richer (dreamy alt-pop), Fleetwood Mac (legendary rock), and ABBA (iconic pop). Full details and links are on the Line Up page.',
  camping: 'There is no camping on site, but Tirol has plenty of hotels, guesthouses, and holiday apartments nearby. Since the festival runs two days, most visitors stay locally and travel in each morning.',
  photography: 'Personal photos and short video clips are very welcome. If you are a photographer or journalist, please register in advance via the Contact page.',
  weather: 'July in Tirol is usually warm — expect 22–28 °C during the day, with cooler mountain evenings. A light layer for the later sets is a good idea, and it is worth checking the forecast in case of an afternoon shower.',
  volunteers: 'Volunteers are a vital part of After Tomorrow. Fill in the interest form on the Contact page and the Harmony for Tomorrow team will be in touch about what roles are available.',
  merchandise: 'The on-site festival shop sells official After Tomorrow merchandise including limited-edition art prints, tote bags, and other items made with local producers.',
  age: 'After Tomorrow is open to all ages. Children under 5 enter free, under-12s get a half-price Day Pass, and the Family Pack covers two adults and two children. Everyone under 16 must be with a responsible adult.',
  workshops: 'All workshops are free for ticket holders — no registration needed, just arrive a few minutes early. Sessions across both days: Voice & Harmony (Sat 10:00), Movement & Dance (Sat 14:00), Mindfulness in Nature (Sun 09:00), Folk Instruments (Sat 16:00), Children\'s Arts & Crafts (both days 11:00–14:00), and Storytelling Circle (Sun 15:00).',
  familyzone: 'The Family Zone has picnic blankets, shade, and a clear view of the main stage. Nearby: Kids Corner with supervised activities (both days 10:00–17:00), a Quiet Space Tent, a nursing room, buggy parking, and allergen-labelled food. Full details on the Family page.',
  whattobring: 'Good things to bring: your ticket or QR code, a reusable water bottle (free refill points on site), comfortable shoes, a light jacket for the evening, sun protection, and any medication you need. Cash is not necessary — the festival is mostly cashless.',
  reentry: 'Yes, you can leave and re-enter the festival grounds on the same day. Your wristband is your pass — keep it on and it will be scanned on re-entry. Weekend Pass holders should keep it on overnight too.',
  wifi: 'There is no public Wi-Fi on the festival grounds. Mobile signal is generally good in the area. Portable charging stations are available near the main information desk for a small fee.',
  wristband: 'When you arrive, your ticket or QR code is exchanged for a wristband at the entrance. Keep it on for the whole day — it is your proof of entry and allows re-entry. Weekend Pass holders should keep theirs on overnight.',
  lost: 'Lost and found is handled at the main information desk near the entrance. Report anything missing there during the festival, or contact the team via the Contact page after the event.',
  alcohol: 'Alcohol is available at licensed bars on site. Outside alcohol is not permitted. Everyone is asked to drink responsibly — After Tomorrow is a safe, inclusive space for all ages.',
  dresscode: 'No dress code at all. Wear whatever makes you comfortable for a day in the alpine outdoors. Comfortable shoes are strongly recommended, and a light jacket for the evening sets is always a smart choice.',
  aurora_bio: 'AURORA is a Norwegian singer-songwriter known for her ethereal voice and deeply emotional songwriting. Her music blends folk, art-pop, and electronic elements into something otherworldly. You may know her from "Runaway" or "Cure for Me".',
  bonobo_bio: 'Bonobo is the project of British musician Simon Green, whose sound blends downtempo, jazz, and electronic music into something deeply atmospheric. Albums like "Black Sands" and "Migration" have made him one of the most loved acts in contemporary music.',
  einaudi_bio: 'Ludovico Einaudi is an Italian pianist and composer known for his minimalist neoclassical style. Pieces like "Nuvole Bianche" and "Experience" have introduced classical piano to millions of listeners worldwide — and he fits the alpine setting of After Tomorrow perfectly.',
  fleetwood_bio: 'Fleetwood Mac are a British-American rock institution. Their album "Rumours" is one of the best-selling records of all time, and songs like "Go Your Own Way", "The Chain", and "Dreams" are as powerful today as they ever were.',
  abba_bio: 'ABBA are the Swedish pop phenomenon behind some of the most recognisable songs ever written — "Dancing Queen", "Mamma Mia", "Waterloo", and many more. Joyful, anthemic, and universally loved across every generation.',
  sixpence_bio: 'Sixpence None the Richer are an American alt-pop band best known for the warm, dreamy sound of songs like "Kiss Me" and "There She Goes". Their gentle, reflective style makes them the ideal act to ease you into the festival.',
  default: 'I can help with the line-up, tickets, dates, workshops, the family zone, what to bring, transport, weather, and much more. What would you like to know about After Tomorrow?'
};
const chatHistory = [];
function applyTheme(mode){
  root.classList.remove('light','dark');
  if (mode) root.classList.add(mode);
  if (themeBtn){
    const isDark = root.classList.contains('dark');
    themeBtn.textContent = isDark ? 'Light' : 'Dark';
    themeBtn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  }
}
function readCart(){
  try{
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}
function writeCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function updateCartCount(){
  const cart = readCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountEls.forEach((element) => {
    element.textContent = String(count);
  });
}
function formatMoney(amount){
  return amount.toFixed(2);
}
function renderCart(){
  if (!cartItemsEl) return;
  const cart = readCart();
  cartItemsEl.innerHTML = '';
  if (!cart.length){
    cartItemsEl.innerHTML = '<p class="note">Your cart is empty. Add tickets from the Tickets page.</p>';
  } else {
    cart.forEach((item) => {
      const row = document.createElement('article');
      row.className = 'cart-item';
      row.innerHTML = `
        <div>
          <h2>${item.name}</h2>
          <p>€${formatMoney(item.price)} each</p>
        </div>
        <div class="qty" aria-label="Quantity controls">
          <button type="button" data-action="decrease" data-id="${item.id}">-</button>
          <span>${item.qty}</span>
          <button type="button" data-action="increase" data-id="${item.id}">+</button>
          <button type="button" class="remove" data-action="remove" data-id="${item.id}">Remove</button>
        </div>
      `;
      cartItemsEl.appendChild(row);
    });
  }
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const vat = subtotal * 0.21;
  const total = subtotal + vat;
  if (subtotalEl) subtotalEl.textContent = formatMoney(subtotal);
  if (vatEl) vatEl.textContent = formatMoney(vat);
  if (totalEl) totalEl.textContent = formatMoney(total);
}
function addToCart(product){
  const cart = readCart();
  const existingItem = cart.find((item) => item.id === product.id);
  if (existingItem){
    existingItem.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  writeCart(cart);
  updateCartCount();
  renderCart();
}
function changeCartItemQty(id, delta){
  const cart = readCart();
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;
  item.qty += delta;
  const nextCart = item.qty <= 0 ? cart.filter((entry) => entry.id !== id) : cart;
  writeCart(nextCart);
  updateCartCount();
  renderCart();
}
function removeCartItem(id){
  const nextCart = readCart().filter((item) => item.id !== id);
  writeCart(nextCart);
  updateCartCount();
  renderCart();
}
function beginCheckout(){
  if (!CHECKOUT_URL){
    return;
  }
  window.location.assign(CHECKOUT_URL);
}
function addChatMessage(role, text){
  if (!chatbotWindow) return;
  const message = document.createElement('div');
  message.className = `chatbot-message ${role}`;
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  message.appendChild(paragraph);
  chatbotWindow.appendChild(message);
  chatbotWindow.scrollTop = chatbotWindow.scrollHeight;
  return paragraph;
}
function addTypingIndicator(){
  if (!chatbotWindow) return null;
  const message = document.createElement('div');
  message.className = 'chatbot-message bot';
  message.innerHTML = '<div class="chatbot-typing"><span></span><span></span><span></span></div>';
  chatbotWindow.appendChild(message);
  chatbotWindow.scrollTop = chatbotWindow.scrollHeight;
  return message;
}
function typewriterReveal(paragraph, text){
  return new Promise(resolve => {
    let i = 0;
    paragraph.classList.add('chatbot-cursor');
    const step = () => {
      paragraph.textContent = text.slice(0, ++i);
      chatbotWindow.scrollTop = chatbotWindow.scrollHeight;
      if (i < text.length) {
        setTimeout(step, 16);
      } else {
        paragraph.classList.remove('chatbot-cursor');
        resolve();
      }
    };
    step();
  });
}
async function askOpenAI(question){
  chatHistory.push({ role: 'user', content: question });
  if (chatHistory.length > 12) chatHistory.splice(0, 2);
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: chatHistory })
  });
  if (!response.ok){
    chatHistory.pop();
    throw new Error(`Chat request failed with status ${response.status}`);
  }
  const data = await response.json();
  const reply = data.reply?.trim() || getFestivalReply(question);
  chatHistory.push({ role: 'assistant', content: reply });
  return reply;
}
function getFestivalReply(question){
  const q = question.toLowerCase().trim();
  // Greetings and social
  if (/^(hi|hello|hey|hallo|hej|salut|ciao|bonjour|guten tag|yo)\b/.test(q)) return 'Hey! I\'m the After Tomorrow assistant. Ask me anything about the festival — the line-up, tickets, workshops, what to bring, or anything else you need.';
  if (/^(thanks|thank you|thank|danke|merci|cheers|gracias|dank je)\b/.test(q)) return 'Happy to help! Is there anything else you would like to know about After Tomorrow?';
  if (/^(bye|goodbye|see you|tot ziens|auf wiedersehen)\b/.test(q)) return 'See you at the festival! Don\'t forget to grab your tickets if you haven\'t yet.';
  if (/(how are you|are you (an )?ai|are you a bot|who are you|what are you)/.test(q)) return 'I\'m an AI assistant built for After Tomorrow — here to help you with anything about the festival. What would you like to know?';
  // Artist bios — checked before generic "who" and "lineup" catches
  if (/\baurora\b/.test(q) && /(who|what|tell|about|sound|music|song|sing|artist)/.test(q)) return festivalInfo.aurora_bio;
  if (/\bbonobo\b/.test(q) && /(who|what|tell|about|sound|music|song|simon|artist)/.test(q)) return festivalInfo.bonobo_bio;
  if (/(einaudi|ludovico)/.test(q) && /(who|what|tell|about|sound|music|piano|play|artist)/.test(q)) return festivalInfo.einaudi_bio;
  if (/fleetwood/.test(q) && /(who|what|tell|about|sound|music|song|artist)/.test(q)) return festivalInfo.fleetwood_bio;
  if (/\babba\b/.test(q) && /(who|what|tell|about|sound|music|song|artist)/.test(q)) return festivalInfo.abba_bio;
  if (/sixpence/.test(q) && /(who|what|tell|about|sound|music|song|artist)/.test(q)) return festivalInfo.sixpence_bio;
  // Topics
  if (/(where|location|venue|tirol|austria|address|take place|held)/.test(q)) return festivalInfo.location;
  if (/(when|what date|which date|dates?|what day|12 july|13 july|\bjuly\b)/.test(q)) return festivalInfo.dates;
  if (/(what time|open|opens|opening|gates|start time|arrive|arrival|close|end time)/.test(q)) return festivalInfo.openinghours;
  if (/(ticket|pass|price|cost|buy|purchase|how much|fee|paid)/.test(q)) return festivalInfo.tickets;
  if (/(wristband|bracelet|entry|entrance|at the door|getting in)/.test(q)) return festivalInfo.wristband;
  if (/(re.?entr|come back|leave and|exit and|go out|in and out)/.test(q)) return festivalInfo.reentry;
  if (/(family zone|kids corner|quiet space|nursing|buggy|pram|pushchair|family area|family facilit)/.test(q)) return festivalInfo.familyzone;
  if (/(family|kid\b|kids\b|children|child|toddler|baby|babies|stroller|parent)/.test(q)) return festivalInfo.family;
  if (/(access|accessible|wheelchair|disabled|mobility|barrier.free|impairment)/.test(q)) return festivalInfo.accessibility;
  if (/(food|eat|drink|vegetarian|vegan|gluten|allergen|catering|burger|snack|menu|cuisine)/.test(q)) return festivalInfo.food;
  if (/(alcohol|beer|wine|cider|spirits|bar|drunk|booze)/.test(q)) return festivalInfo.alcohol;
  if (/(transport|travel|bus|train|car\b|bike|cycle|drive|parking|get here|how to get|innsbruck|airport|fly\b|plane|shuttle)/.test(q)) return festivalInfo.transport;
  if (/(workshop|session|voice|harmony|movement|dance|mindfulness|folk instrument|storytelling|craft|art class)/.test(q)) return festivalInfo.workshops;
  if (/(schedule|programme|program|timetable|set time|running order|day plan|what.*on|what.*happening)/.test(q)) return festivalInfo.schedule;
  if (/(lineup|line.up|all artist|all act|bands playing|performers|who.* play|who.*perform|who.*on stage|acts)/.test(q)) return festivalInfo.lineup;
  // Standalone artist name catches (no context needed)
  if (/\baurora\b/.test(q)) return festivalInfo.aurora_bio;
  if (/\bbonobo\b/.test(q)) return festivalInfo.bonobo_bio;
  if (/(einaudi|ludovico)/.test(q)) return festivalInfo.einaudi_bio;
  if (/fleetwood/.test(q)) return festivalInfo.fleetwood_bio;
  if (/\babba\b/.test(q)) return festivalInfo.abba_bio;
  if (/sixpence/.test(q)) return festivalInfo.sixpence_bio;
  if (/(weather|temperature|celsius|degrees|warm|cold|rain|sun|forecast|cloud|hot\b|cool\b)/.test(q)) return festivalInfo.weather;
  if (/(dress|what (should i |to )wear|outfit|clothing|clothes|what to put on)/.test(q)) return festivalInfo.dresscode;
  if (/(what (to |should i )bring|pack|packing list|what do i need|need to bring|don.t forget)/.test(q)) return festivalInfo.whattobring;
  if (/(wifi|wi.fi|internet|signal|phone|charge|charging|power bank|plug)/.test(q)) return festivalInfo.wifi;
  if (/(lost|found|missing|lose|lost item|left behind)/.test(q)) return festivalInfo.lost;
  if (/(safe|safety|medical|first aid|security|emergency|help desk|staff)/.test(q)) return festivalInfo.safety;
  if (/(camp|camping|tent|overnight|stay\b|hotel|hostel|accommodation|sleep|airbnb|where to stay)/.test(q)) return festivalInfo.camping;
  if (/(photo|photograph|camera|video|film|record|picture|press|media|journalist)/.test(q)) return festivalInfo.photography;
  if (/(cash|cashless|card|payment|contactless|pay\b|atm|money|tap)/.test(q)) return festivalInfo.cashless;
  if (/(merch|merchandise|shop|souvenir|shirt|tote|poster|print|buy stuff|festival shop)/.test(q)) return festivalInfo.merchandise;
  if (/(volunteer|volunteering|help out|work at|crew|staff application)/.test(q)) return festivalInfo.volunteers;
  if (/(sustain|eco|green|environment|waste|recycle|carbon|low.?waste|plastic)/.test(q)) return festivalInfo.sustainability;
  if (/(age|minimum age|how old|under 18|under 12|under 5|age limit|age restriction|children free)/.test(q)) return festivalInfo.age;
  if (/(contact|email|phone|message|reach|organizer|organiser|helpdesk|help desk|get in touch)/.test(q)) return festivalInfo.contact;
  if (/(about|ngo|who organis|who organiz|harmony for tomorrow|mission|vision|why this|story behind|background)/.test(q)) return festivalInfo.about;
  if (/(game|flappy|dove|flying|mini.?game|play\b)/.test(q)) return festivalInfo.game;
  return festivalInfo.default;
}
async function handleChatQuestion(question){
  const trimmed = question.trim();
  if (!trimmed || !chatbotWindow) return;
  addChatMessage('user', trimmed);
  const typingEl = addTypingIndicator();
  let reply;
  try {
    reply = await askOpenAI(trimmed);
  } catch {
    reply = getFestivalReply(trimmed);
  }
  if (typingEl) typingEl.remove();
  const message = document.createElement('div');
  message.className = 'chatbot-message bot';
  const paragraph = document.createElement('p');
  message.appendChild(paragraph);
  chatbotWindow.appendChild(message);
  chatbotWindow.scrollTop = chatbotWindow.scrollHeight;
  await typewriterReveal(paragraph, reply);
}
function setMenuState(isOpen){
  if (!navToggle || !menu) return;
  menu.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
}
(function initTheme(){
  const saved = localStorage.getItem(THEME_KEY);
  if (saved){
    applyTheme(saved);
  } else {
    // First visit: mirror OS preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }
})();
if (themeBtn){
  themeBtn.addEventListener('click', () => {
    const isDark = root.classList.contains('dark');
    const next = isDark ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });
}
if (navToggle && menu){
  const savedMenu = localStorage.getItem(MENU_KEY) === 'open';
  setMenuState(savedMenu);
  navToggle.addEventListener('click', () => {
    const nextState = !menu.classList.contains('open');
    setMenuState(nextState);
    localStorage.setItem(MENU_KEY, nextState ? 'open' : 'closed');
  });
  menu.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement){
      setMenuState(false);
      localStorage.setItem(MENU_KEY, 'closed');
    }
  });
  document.addEventListener('click', (event) => {
    if (!menu.classList.contains('open')) return;
    if (menu.contains(event.target) || navToggle.contains(event.target)) return;
    setMenuState(false);
    localStorage.setItem(MENU_KEY, 'closed');
  });
}
document.querySelectorAll('.add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    addToCart({
      id: button.dataset.id,
      name: button.dataset.name,
      price: Number(button.dataset.price),
    });
    const originalText = button.textContent;
    button.textContent = 'Added';
    window.setTimeout(() => {
      button.textContent = originalText;
    }, 800);
  });
});
if (cartItemsEl){
  cartItemsEl.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    const { action, id } = target.dataset;
    if (action === 'increase') changeCartItemQty(id, 1);
    if (action === 'decrease') changeCartItemQty(id, -1);
    if (action === 'remove') removeCartItem(id);
  });
  renderCart();
}
if (clearCartBtn){
  clearCartBtn.addEventListener('click', () => {
    writeCart([]);
    updateCartCount();
    renderCart();
  });
}
if (checkoutBtn && checkoutNotice){
  checkoutBtn.addEventListener('click', () => {
    beginCheckout();
  });
}
if (chatbotWindow && chatbotForm && chatbotInput){
  addChatMessage('bot', 'Hi, I\'m the After Tomorrow assistant. Ask me anything — the line-up, tickets, workshops, what to bring, how to get here, or anything else about the festival.');
  chatbotForm.addEventListener('submit', (event) => {
    event.preventDefault();
    handleChatQuestion(chatbotInput.value);
    chatbotInput.value = '';
    chatbotInput.focus();
  });
  chatbotQuickReplies.forEach((button) => {
    button.addEventListener('click', () => {
      handleChatQuestion(button.dataset.chatQuestion || '');
    });
  });
  const chatToggle = document.getElementById('chatToggle');
  const chatClose = document.getElementById('chatClose');
  const chatPanel = document.getElementById('chatPanel');
  if (chatToggle && chatPanel) {
    chatToggle.addEventListener('click', () => {
      const opening = chatPanel.hidden;
      chatPanel.hidden = !opening;
      chatToggle.setAttribute('aria-expanded', String(opening));
      if (opening) chatbotInput.focus();
    });
  }
  if (chatClose) {
    chatClose.addEventListener('click', () => {
      chatPanel.hidden = true;
      document.getElementById('chatToggle')?.setAttribute('aria-expanded', 'false');
    });
  }
}
updateCartCount();