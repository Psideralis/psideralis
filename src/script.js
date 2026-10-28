import { translations } from './translations.js';

const cartKey = 'psideralis-store-cart';
const PROTON_WALLET_ADDRESS = process.env.PROTON_WALLET_ADDRESS || 'YOUR_PROTON_WALLET_ADDRESS';
const FORMSPREE_FORM_ID = normalizeFormspreeFormId(process.env.FORMSPREE_FORM_ID || 'your_formspree_form_id');
const FORMSPREE_QUOTE_FORM_ID = normalizeFormspreeFormId(process.env.FORMSPREE_QUOTE_FORM_ID || 'your_formspree_quote_form_id');
const FORMSPREE_VISIT_FORM_ID = normalizeFormspreeFormId(process.env.FORMSPREE_VISIT_FORM_ID || FORMSPREE_FORM_ID || 'your_formspree_visit_form_id');
const ACTIVATION_CODES = JSON.parse(process.env.ACTIVATION_CODES || '{}');

function normalizeFormspreeFormId(value) {
  if (!value) return '';
  return String(value).trim()
    .replace(/^https?:\/\/formspree\.io\/f\//i, '')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\?.*$/, '');
}
const STATIC_CATALOG = [
  { id: 'web-design', name: 'Diseño de página web', category: 'WEB', description: 'Dirección visual, estructura y prototipo de una página clara y memorable.', price: 1000, unit: 'proyecto', maxQuantity: 5, icon: '✦' },
  { id: 'web-development', name: 'Programación web', category: 'WEB', description: 'Construcción de una página web rápida, accesible y lista para crecer.', price: 2500, unit: 'proyecto', maxQuantity: 5, icon: '</>' },
  { id: 'web-launch', name: 'Implementación web', category: 'WEB', description: 'Publicación, dominio, configuración técnica y salida a producción.', price: 2000, unit: 'lanzamiento', maxQuantity: 5, icon: '↗' },
  { id: 'web-care', name: 'Administración web', category: 'CONTINUIDAD', description: 'Mantenimiento, actualizaciones y cuidado mensual de tu sitio.', price: 1000, unit: 'mes', maxQuantity: 12, icon: '◌' },
  { id: 'cross-platform', name: 'App multiplataforma', category: 'APLICACIONES', description: 'Base de desarrollo para escritorio y móvil desde un mismo producto.', price: 5000, unit: 'módulo', maxQuantity: 10, icon: '▣' },
  { id: 'licenses-distribution', name: 'Licencias y distribución', category: 'APLICACIONES', description: 'Gestión de licencias y preparación para distribuir tu aplicación de escritorio.', price: 2500, unit: 'proyecto', maxQuantity: 5, icon: '⌘' },
  { id: 'data-analysis', name: 'Análisis de datos', category: 'DATOS', description: 'Lectura, limpieza y visualización para convertir datos en decisiones.', price: 2500, unit: 'paquete', maxQuantity: 10, icon: '⌁' },
  { id: 'technical-support', name: 'Soporte técnico', category: 'SOPORTE', description: 'Bolsa de horas para resolver incidencias, ajustes y consultas técnicas.', price: 2000, unit: 'hora', maxQuantity: 40, icon: '?' }
];
let catalog = [...STATIC_CATALOG];
let cart = readCart();
let currentLanguage = localStorage.getItem('language') || 'es';
const $ = (selector) => document.querySelector(selector);

const storeStrings = {
  es: { back: '← Volver a Psideralis', eyebrow: 'TIENDA DE SERVICIOS', title: 'Convierte el plan<br>en <span class="gradient-text">progreso.</span>', intro: 'Selecciona unidades de trabajo definidas para iniciar, mejorar o mantener tus productos digitales.', selection: 'TU SELECCIÓN', cart: 'Carrito', empty: 'Ajusta las cantidades del catálogo para añadir servicios al carrito.', total: 'Total estimado', checkout: 'Continuar al pago <span>→</span>', bitcoin: 'Ver dirección de la billetera', per: 'por', loading: 'Cargando catálogo…', preparing: 'Preparando la información de pago…' },
  en: { back: '← Back to Psideralis', eyebrow: 'SERVICE STORE', title: 'Turn the plan<br>into <span class="gradient-text">progress.</span>', intro: 'Choose defined units of work to launch, improve, or maintain your digital products.', selection: 'YOUR SELECTION', cart: 'Cart', empty: 'Adjust catalogue quantities to add services to your cart.', total: 'Estimated total', checkout: 'Continue to payment <span>→</span>', bitcoin: 'View wallet address', per: 'per', loading: 'Loading catalogue…', preparing: 'Preparing payment details…' },
  fr: { back: '← Retour à Psideralis', eyebrow: 'BOUTIQUE DE SERVICES', title: 'Transformez le plan<br>en <span class="gradient-text">progrès.</span>', intro: 'Choisissez des unités de travail définies pour lancer, améliorer ou maintenir vos produits numériques.', selection: 'VOTRE SÉLECTION', cart: 'Panier', empty: 'Ajustez les quantités du catalogue pour ajouter des services à votre panier.', total: 'Total estimé', checkout: 'Continuer vers le paiement <span>→</span>', bitcoin: 'Voir l’adresse du portefeuille', per: 'par', loading: 'Chargement du catalogue…', preparing: 'Préparation des détails de paiement…' }
};
const productTranslations = {
  en: {
    'web-design': ['Web page design', 'Visual direction, structure, and a prototype for a clear memorable page.', 'project', 'WEB'], 'web-development': ['Web development', 'A fast, accessible web page built to grow.', 'project', 'WEB'], 'web-launch': ['Web implementation', 'Publishing, domain, technical configuration, and production launch.', 'launch', 'WEB'], 'web-care': ['Website management', 'Monthly maintenance, updates, and care for your site.', 'month', 'CONTINUITY'], 'cross-platform': ['Cross-platform app', 'A development foundation for desktop and mobile from one product.', 'module', 'APPLICATIONS'], 'licenses-distribution': ['Licensing & distribution', 'License management and desktop-app distribution preparation.', 'project', 'APPLICATIONS'], 'data-analysis': ['Data analysis', 'Cleaning, reading, and visualization to turn data into decisions.', 'package', 'DATA'], 'technical-support': ['Technical support', 'A block of hours for issues, adjustments, and technical questions.', 'hour', 'SUPPORT']
  },
  fr: {
    'web-design': ['Conception de site web', 'Direction visuelle, structure et prototype d’une page claire et mémorable.', 'projet', 'WEB'], 'web-development': ['Développement web', 'Une page web rapide, accessible et prête à évoluer.', 'projet', 'WEB'], 'web-launch': ['Mise en ligne web', 'Publication, domaine, configuration technique et mise en production.', 'lancement', 'WEB'], 'web-care': ['Administration web', 'Maintenance, mises à jour et suivi mensuel de votre site.', 'mois', 'CONTINUITÉ'], 'cross-platform': ['Application multiplateforme', 'Base de développement pour ordinateur et mobile à partir d’un seul produit.', 'module', 'APPLICATIONS'], 'licenses-distribution': ['Licences et distribution', 'Gestion des licences et préparation à la distribution de votre application.', 'projet', 'APPLICATIONS'], 'data-analysis': ['Analyse de données', 'Nettoyage, lecture et visualisation pour transformer les données en décisions.', 'forfait', 'DONNÉES'], 'technical-support': ['Support technique', 'Bloc d’heures pour incidents, ajustements et questions techniques.', 'heure', 'SUPPORT']
  }
};
function storeText(key) { return storeStrings[currentLanguage]?.[key] || storeStrings.es[key]; }
function displayProduct(product) { const translation = productTranslations[currentLanguage]?.[product.id]; return translation ? { ...product, name: translation[0], description: translation[1], unit: translation[2], category: translation[3] } : product; }
function formatMoney(value) { return new Intl.NumberFormat({ es: 'es-GT', en: 'en-US', fr: 'fr-FR' }[currentLanguage] || 'es-GT', { style: 'currency', currency: 'USD' }).format(value); }

function readCart() { try { return JSON.parse(localStorage.getItem(cartKey)) || {}; } catch { return {}; } }
function persistCart() { localStorage.setItem(cartKey, JSON.stringify(cart)); }
function cartCount() { return Object.values(cart).reduce((total, qty) => total + qty, 0); }
function cartItems() { return catalog.filter((item) => cart[item.id]).map((item) => ({ ...item, quantity: cart[item.id] })); }
function setMiniCart() { const counter = $('#miniCartCount'); if (counter) counter.textContent = cartCount(); }
function setRoute(path, replace = false) { if (window.location.pathname !== path) window.history[replace ? 'replaceState' : 'pushState']({}, '', path); renderRoute(); window.scrollTo({ top: 0, behavior: 'instant' }); }
function isStore() { return window.location.pathname === '/tienda'; }
function routeLinks() { document.querySelectorAll('[data-route]').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); setRoute(link.dataset.route === 'store' ? '/tienda' : '/'); })); }

function nestedTranslation(source, key) { return key.split('.').reduce((value, part) => value?.[part], source); }
function applyLanguage(language) {
  const translation = translations[language]; if (!translation) return;
  currentLanguage = language; document.documentElement.lang = language; localStorage.setItem('language', language);
  $('#languageCurrent').textContent = language.toUpperCase();
  document.querySelectorAll('#languageDropdown [data-lang]').forEach((option) => option.setAttribute('aria-selected', String(option.dataset.lang === language)));
  document.querySelectorAll('[data-i18n]').forEach((element) => { const value = nestedTranslation(translation, element.dataset.i18n); if (value !== undefined) element.innerHTML = value; });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => { const value = nestedTranslation(translation, element.dataset.i18nPlaceholder); if (value !== undefined) element.placeholder = value; });
  if (isStore() && catalog.length) renderStore();
}
function setupLanding() {
  const html = document.documentElement; const themeButton = $('#themeToggle'); const themes = ['dark', 'light', 'sunrise', 'sunset']; const themeIcons = { dark: '◐', light: '☀', sunrise: '◔', sunset: '◑' };
  let currentTheme = localStorage.getItem('theme') || 'dark';
  function applyTheme(theme) { currentTheme = theme; html.dataset.theme = theme; localStorage.setItem('theme', theme); themeButton.querySelector('.theme-icon').textContent = themeIcons[theme]; }
  applyTheme(currentTheme);
  themeButton?.addEventListener('click', () => applyTheme(themes[(themes.indexOf(currentTheme) + 1) % themes.length]));
  const languageSelector = $('#languageSelector'); const languageButton = $('#languageButton');
  languageButton?.addEventListener('click', (event) => { event.stopPropagation(); languageSelector.classList.toggle('open'); languageButton.setAttribute('aria-expanded', String(languageSelector.classList.contains('open'))); });
  $('#languageDropdown')?.addEventListener('click', (event) => { const option = event.target.closest('[data-lang]'); if (!option) return; applyLanguage(option.dataset.lang); languageSelector.classList.remove('open'); languageButton.setAttribute('aria-expanded', 'false'); });
  document.addEventListener('click', (event) => { if (!languageSelector?.contains(event.target)) { languageSelector?.classList.remove('open'); languageButton?.setAttribute('aria-expanded', 'false'); } });
  applyLanguage(localStorage.getItem('language') || 'es');
  $('#menuButton')?.addEventListener('click', () => $('#mainNav').classList.toggle('active'));
  $('#contactForm')?.addEventListener('submit', submitContact);
}

const contactMessages = {
  es: { sending: 'Enviando mensaje…', success: 'Mensaje enviado. Te responderemos pronto.', missing: 'El formulario de contacto aún no está configurado.', error: 'No se pudo enviar el mensaje. Inténtalo de nuevo.' },
  en: { sending: 'Sending message…', success: 'Message sent. We will get back to you soon.', missing: 'The contact form is not configured yet.', error: 'The message could not be sent. Please try again.' },
  fr: { sending: 'Envoi du message…', success: 'Message envoyé. Nous vous répondrons bientôt.', missing: 'Le formulaire de contact n’est pas encore configuré.', error: 'Le message n’a pas pu être envoyé. Veuillez réessayer.' }
};
async function submitContact(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const status = $('#formMessage');
  const button = form.querySelector('button[type="submit"]');
  const messages = contactMessages[currentLanguage] || contactMessages.es;
  const formId = FORMSPREE_FORM_ID;

  button.disabled = true;
  status.textContent = messages.sending;

  try {
    if (!formId || formId === 'your_formspree_form_id') throw new Error(messages.missing);
    const response = await fetch(`https://formspree.io/f/${encodeURIComponent(formId)}`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form)
    });
    if (!response.ok) throw new Error(messages.error);
    form.reset();
    status.textContent = messages.success;
  } catch (error) {
    status.textContent = error.message === messages.missing ? messages.missing : messages.error;
  } finally {
    button.disabled = false;
  }
}

function loadCatalog() { catalog = [...STATIC_CATALOG]; }
function changeItem(id, delta) { approvedCode = ''; const product = catalog.find((item) => item.id === id); if (!product) return; const next = Math.max(0, Math.min(product.maxQuantity, (cart[id] || 0) + delta)); if (next) cart[id] = next; else delete cart[id]; persistCart(); setMiniCart(); renderStore(); }
const quoteCopy = {
  es: { button: 'Solicitar cotización o ingresar código →', title: 'Cuéntanos sobre tu proyecto', intro: 'Completa todos los campos. Revisaremos tu solicitud y te enviaremos un código si se aprueba la cotización.', name: 'Nombre', email: 'Correo electrónico', description: 'Objetivo y descripción del proyecto', web: '¿Qué páginas, funciones y estilo necesitas?', continuity: '¿Qué sitio necesita mantenimiento y qué tareas requieres?', applications: '¿Para qué plataformas y qué funciones necesitas?', data: '¿Qué datos tienes y qué análisis o resultados buscas?', support: '¿Qué problema necesitas resolver y en qué sistemas?', send: 'Enviar solicitud', sending: 'Enviando solicitud…', sent: 'Solicitud enviada. Psideralis se pondrá en contacto contigo.', codeTitle: '¿Ya tienes un código aprobado?', code: 'Código de cotización', apply: 'Validar código', approved: 'Código validado. Elige un método de pago.', close: 'Cerrar' },
  en: { button: 'Request a quote or enter a code →', title: 'Tell us about your project', intro: 'Complete every field. We will review your request and send you a code if the quote is approved.', name: 'Name', email: 'Email', description: 'Project goals and description', web: 'What pages, features and style do you need?', continuity: 'Which site needs maintenance and what tasks are required?', applications: 'Which platforms and features do you need?', data: 'What data do you have and what analysis or results do you need?', support: 'What problem and systems need support?', send: 'Send request', sending: 'Sending request…', sent: 'Request sent. Psideralis will contact you.', codeTitle: 'Already have an approved code?', code: 'Quote code', apply: 'Validate code', approved: 'Code validated. Choose a payment method.', close: 'Close' },
  fr: { button: 'Demander un devis ou saisir un code →', title: 'Parlez-nous de votre projet', intro: 'Remplissez tous les champs. Nous examinerons votre demande et vous enverrons un code si le devis est approuvé.', name: 'Nom', email: 'Adresse e-mail', description: 'Objectif et description du projet', web: 'Quelles pages, fonctionnalités et quel style souhaitez-vous ?', continuity: 'Quel site nécessite une maintenance et quelles tâches sont requises ?', applications: 'Pour quelles plateformes et avec quelles fonctionnalités ?', data: 'Quelles données possédez-vous et quels résultats recherchez-vous ?', support: 'Quel problème et quels systèmes nécessitent une assistance ?', send: 'Envoyer la demande', sending: 'Envoi de la demande…', sent: 'Demande envoyée. Psideralis vous contactera.', codeTitle: 'Vous avez déjà un code approuvé ?', code: 'Code du devis', apply: 'Valider le code', discount: 'Réduction', approved: 'Code validé. Choisissez un moyen de paiement.', close: 'Fermer' }
};
const categoryKeys = { WEB: 'web', CONTINUIDAD: 'continuity', APLICACIONES: 'applications', DATOS: 'data', SOPORTE: 'support' };
let approvedCode = '';
function quoteForm() {
  const t = quoteCopy[currentLanguage] || quoteCopy.es;
  const categories = [...new Set(cartItems().map(item => categoryKeys[item.category]))];
  return `<div class="quote-panel" id="quotePanel" hidden><div class="quote-heading"><h3>${categories.length ? t.title : t.codeTitle}</h3><button type="button" id="closeQuote" aria-label="${t.close}">×</button></div>${categories.length ? `<p>${t.intro}</p>` : ""}<form id="quoteForm" ${categories.length ? "" : "hidden"}><label>${t.name}<input name="name" required maxlength="120" autocomplete="name"></label><label>${t.email}<input name="email" type="email" required maxlength="254" autocomplete="email"></label><label>${t.description}<textarea name="description" required maxlength="4000" rows="3"></textarea></label>${categories.map(key => `<label>${t[key]}<textarea name="${key}" required maxlength="2000" rows="3"></textarea></label>`).join('')}<button class="button button-primary" type="submit">${t.send}</button></form><div class="quote-code"><h3>${t.codeTitle}</h3><form id="codeForm"><label>${t.code}<input name="code" required maxlength="100" autocomplete="off"></label><button class="button button-secondary" type="submit">${t.apply}</button></form><p id="quoteTotal"></p></div><p id="quoteMessage" class="store-message" role="status"></p></div>`;
}
function setupQuote() {
  const t = quoteCopy[currentLanguage] || quoteCopy.es;
  const panel = $('#quotePanel');
  $('#openPayment')?.addEventListener('click', () => { panel.hidden = false; (panel.querySelector('#quoteForm:not([hidden]) input') || panel.querySelector('#codeForm input')).focus(); });
  $('#closeQuote')?.addEventListener('click', () => { panel.hidden = true; });
  const status = (value, error = false) => { const el = $('#quoteMessage'); el.textContent = value; el.classList.toggle('error', error); };
  const items = () => cartItems().map(({ id, quantity }) => ({ id, quantity }));
  $('#quoteForm')?.addEventListener('submit', async event => {
    event.preventDefault(); const form = event.currentTarget; if (!form.reportValidity()) return;
    const messages = contactMessages[currentLanguage] || contactMessages.es;
    const data = new FormData(form);
    for (const field of form.querySelectorAll('[required]')) {
      if (!field.value.trim()) { field.focus(); status(messages.error, true); return; }
    }
    const selected = cartItems();
    const formId = FORMSPREE_QUOTE_FORM_ID;
    data.append('form_type', 'Solicitud de cotización');
    data.append('services', selected.map(item => `${item.name} (${item.id}) × ${item.quantity}`).join('\n'));
    data.append('estimated_total_usd', String(selected.reduce((sum, item) => sum + item.price * item.quantity, 0)));
    const button = form.querySelector('button'); button.disabled = true; status(t.sending);
    try {
      if (!formId || formId === 'your_formspree_quote_form_id') throw new Error(messages.missing);
      const response = await fetch(`https://formspree.io/f/${encodeURIComponent(formId)}`, { method: 'POST', headers: { Accept: 'application/json' }, body: data });
      if (!response.ok) throw new Error(messages.error);
      form.reset(); status(t.sent);
    } catch (error) { status(error.message === messages.missing ? messages.missing : messages.error, true); } finally { button.disabled = false; }
  });
  $('#codeForm')?.addEventListener('submit', event => {
    event.preventDefault(); approvedCode = ''; $('#paymentChoice').classList.remove('open'); $('#quoteTotal').textContent = '';
    const code = new FormData(event.currentTarget).get('code').trim();
    try {
      const result = validateActivationCode(code);
      cart = Object.fromEntries(result.items.map(({ id, quantity }) => [id, quantity]));
      persistCart();
      setMiniCart();
      approvedCode = code;
      renderStore();
      $('#quotePanel').hidden = false;
      $('#codeForm input').value = code;
      $('#quoteTotal').textContent = `${storeText('total')}: ${formatMoney(result.total)}`;
      $('#paymentChoice').classList.add('open');
      $('#quoteMessage').textContent = t.approved;
    } catch (error) {
      status(error.message, true);
    }
  });
}

function validateActivationCode(code) {
  const normalized = String(code || '').trim().toUpperCase();
  const match = ACTIVATION_CODES[normalized];
  if (!match) throw new Error('El código de cotización no es válido.');

  return {
    total: Number(match.total),
    items: [{ id: match.id, quantity: Number(match.quantity) }]
  };
}
function renderStore() {
  const root = $('#storeView');
  const items = cartItems().map(displayProduct);
  const total = cartItems().reduce((sum, item) => sum + item.price * item.quantity, 0);
  root.innerHTML = `<section class="store-page"><a href="/" class="back-store" data-route="home">${storeText('back')}</a><div class="store-hero"><div><span class="section-label">${storeText('eyebrow')}</span><h1>${storeText('title')}</h1></div><p>${storeText('intro')}</p></div><div class="store-layout"><div class="store-grid">${catalog.map((raw) => { const item = displayProduct(raw); return `<article class="store-card"><div class="store-card-top"><span class="store-icon">${item.icon}</span><small>${item.category}</small></div><h3>${item.name}</h3><p>${item.description}</p><div class="store-card-bottom"><div class="price"><strong>${formatMoney(item.price)}</strong><span>${storeText('per')} ${item.unit}</span></div><div class="qty"><button aria-label="- ${item.name}" data-store-change="-1" data-id="${item.id}">−</button><output>${cart[item.id] || 0}</output><button aria-label="+ ${item.name}" data-store-change="1" data-id="${item.id}">+</button></div></div></article>`; }).join('')}</div><aside class="cart-box"><span class="section-label">${storeText('selection')}</span><h2>${storeText('cart')} <small>(${cartCount()})</small></h2><div>${items.length ? items.map((item) => `<div class="cart-line"><span>${item.name} × ${item.quantity}</span><strong>${formatMoney(item.price * item.quantity)}</strong></div>`).join('') : `<p class="cart-empty">${storeText('empty')}</p>`}</div>${items.length ? `<div class="cart-total"><span>${storeText('total')}</span><strong>${formatMoney(total)}</strong></div><button class="button button-primary store-checkout" id="openPayment">${(quoteCopy[currentLanguage] || quoteCopy.es).button}</button>${quoteForm()}<div class="payment-choice" id="paymentChoice"><button data-provider="bitcoin"><b>Bitcoin · Proton Wallet</b><br><small>${storeText('bitcoin')}</small></button></div><div class="bitcoin-box" id="bitcoinBox"></div><p id="storeMessage" class="store-message"></p>` : ''}${!items.length ? `<button class="button button-primary store-checkout" id="openPayment">${(quoteCopy[currentLanguage] || quoteCopy.es).codeTitle}</button>${quoteForm()}<div class="payment-choice" id="paymentChoice"></div><div class="bitcoin-box" id="bitcoinBox"></div><p id="storeMessage" class="store-message"></p>` : ""}</aside></div></section>`;
  routeLinks();
  root.querySelectorAll('[data-store-change]').forEach((button) => button.addEventListener('click', () => changeItem(button.dataset.id, Number(button.dataset.storeChange))));
  setupQuote();
  root.querySelectorAll('[data-provider]').forEach((button) => button.addEventListener('click', () => checkout(button.dataset.provider)));
}
function message(text, error = false) { const box = $('#storeMessage'); if (box) { box.textContent = text; box.classList.toggle('error', error); } }
const bitcoinText = {
  es: { title: 'Direcci\u00f3n Bitcoin', instruction: 'Env\u00eda el pago desde tu billetera. Coordina con Psideralis el importe en BTC y la confirmaci\u00f3n del pago.', total: 'Total del proyecto (USD)' },
  en: { title: 'Bitcoin address', instruction: 'Send the payment from your wallet. Coordinate the BTC amount and payment confirmation with Psideralis.', total: 'Project total (USD)' },
  fr: { title: 'Adresse Bitcoin', instruction: 'Envoyez le paiement depuis votre portefeuille. Convenez du montant en BTC et de la confirmation avec Psideralis.', total: 'Total du projet (USD)' }
};
async function checkout(provider) {
  if (provider !== 'bitcoin') return;

  message(storeText('preparing'));
  try {
    const items = cartItems();
    if (!items.length) {
      throw new Error('Primero añade servicios al carrito.');
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const box = $('#bitcoinBox'); const text = bitcoinText[currentLanguage] || bitcoinText.es;
    box.replaceChildren();
    box.classList.add('open');

    const title = document.createElement('strong');
    title.textContent = text.title;
    const address = document.createElement('p');
    address.className = 'bitcoin-address';
    address.textContent = PROTON_WALLET_ADDRESS;
    const totalLine = document.createElement('p');
    totalLine.textContent = `${text.total}: ${formatMoney(total)}`;
    const instruction = document.createElement('p');
    instruction.textContent = text.instruction;

    box.append(title, address, totalLine, instruction);
    message('');
  } catch (error) {
    message(error.message, true);
  }
}
async function renderRoute() { const home = $('#homeView'); const store = $('#storeView'); const footer = $('.site-footer'); document.body.classList.toggle('store-mode', isStore()); if (!isStore()) { home.hidden = false; store.hidden = true; footer.hidden = false; return; } home.hidden = true; store.hidden = false; footer.hidden = true; store.innerHTML = `<section class="store-page"><p class="cart-empty">${storeText('loading')}</p></section>`; try { loadCatalog(); renderStore(); } catch (error) { store.innerHTML = `<section class="store-page"><a href="/" class="back-store" data-route="home">${storeText('back')}</a><p class="cart-empty">${error.message}</p></section>`; routeLinks(); } }

async function notifyVisitFormspree() {
  if (!FORMSPREE_VISIT_FORM_ID || FORMSPREE_VISIT_FORM_ID === 'your_formspree_form_id' || FORMSPREE_VISIT_FORM_ID === 'your_formspree_visit_form_id') {
    return;
  }

  try {
    const formData = new FormData();
    formData.append('message', 'Has recibido un visita.');
    formData.append('source', 'page-visit');
    formData.append('page', window.location.pathname || '/');
    formData.append('referrer', document.referrer || 'direct');
    formData.append('timestamp', new Date().toISOString());

    await fetch(`https://formspree.io/f/${encodeURIComponent(FORMSPREE_VISIT_FORM_ID)}`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData,
    });
  } catch (error) {
    console.warn('Visit notification could not be sent to Formspree:', error);
  }
}

window.addEventListener('popstate', renderRoute);
setupLanding(); routeLinks(); setMiniCart(); renderRoute();
notifyVisitFormspree();
