import { translations } from './translations.js';
import worldCountries from './data/world-countries.json';

const cartKey = 'psideralis-store-cart';
const FORMSPREE_FORM_ID = normalizeFormspreeFormId(process.env.FORMSPREE_FORM_ID || 'your_formspree_form_id');
const FORMSPREE_QUOTE_FORM_ID = normalizeFormspreeFormId(process.env.FORMSPREE_QUOTE_FORM_ID || 'your_formspree_quote_form_id');
const FORMSPREE_VISIT_FORM_ID = normalizeFormspreeFormId(process.env.FORMSPREE_VISIT_FORM_ID || 'your_formspree_visit_form_id');

function normalizeFormspreeFormId(value) {
  if (!value) return '';
  const formId = String(value).trim()
    .replace(/^https?:\/\/formspree\.io\/f\//i, '')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\?.*$/, '');
  return /^[a-zA-Z0-9]+$/.test(formId) && !formId.startsWith('your_') ? formId : '';
}
const STATIC_CATALOG = [
  { id: 'web-design', type: 'service', name: 'Diseño de página web', category: 'WEB', description: 'Diseño para TV, escritorio, tablet, móvil y PWA.', price: 1000, unit: 'proyecto', maxQuantity: 5, icon: '✦' },
  { id: 'web-development', type: 'service', name: 'Programación de página web', category: 'WEB', description: 'Incluye usuarios, seguridad, monitoreo y marketing.', price: 1000, unit: 'proyecto', maxQuantity: 5, icon: '◩' },
  { id: 'web-implementation', type: 'service', name: 'Implementación de página web', category: 'WEB', description: 'En la nube o bajo premisas, con bases de datos.', price: 2000, unit: 'implementación', maxQuantity: 5, icon: '↗' },
  { id: 'web-administration', type: 'service', name: 'Administración de página web', category: 'WEB', description: 'Dominio, seguimiento, seguridad, monitoreo y marketing.', price: 1000, unit: 'mes', maxQuantity: 12, icon: '◌' },
  { id: 'desktop-app', type: 'service', name: 'App multiplataforma escritorio', category: 'APLICACIONES', description: 'Desarrollo para Windows, Linux y macOS.', price: 5000, unit: 'proyecto', maxQuantity: 10, icon: '▣' },
  { id: 'mobile-app', type: 'service', name: 'App multiplataforma móvil', category: 'APLICACIONES', description: 'Desarrollo para Android e iOS.', price: 5000, unit: 'proyecto', maxQuantity: 10, icon: '◉' },
  { id: 'licenses-distribution', type: 'service', name: '100 licencias y distribución de 5 software', category: 'APLICACIONES', description: 'Licenciamiento y distribución mensual de cinco productos de software.', price: 5000, unit: 'mes', maxQuantity: 12, icon: '⌘' },
  { id: 'data-analysis', type: 'service', name: 'Análisis de datos', category: 'DATOS', description: 'Análisis y visualización para transformar datos en decisiones.', price: 2500, unit: 'proyecto', maxQuantity: 10, icon: '⌁' },
  { id: 'technical-support', type: 'service', name: 'Soporte técnico', category: 'SOPORTE', description: 'Soporte técnico continuo para tu operación.', price: 250, unit: 'mes', maxQuantity: 12, icon: '?' },
  { id: 'digital-advertising', type: 'service', name: 'Campaña de publicidad digital', category: 'MARKETING', description: 'Instagram, Facebook, X, TikTok y YouTube.', price: 5000, unit: 'mes', maxQuantity: 12, icon: '◫' },
  { id: 'digital-marketing', type: 'service', name: 'Campaña de marketing digital', category: 'MARKETING', description: 'Correo electrónico y SMS.', price: 2500, unit: 'mes', maxQuantity: 12, icon: '✉' },
  { id: 'ultralogik-math', type: 'product', name: 'uLTRALogik · Paquete de matemática', category: 'PRODUCTOS', description: 'Paquete mensual de herramientas y recursos de matemática.', price: 1000, unit: 'mes', maxQuantity: 12, icon: '∑' },
  { id: 'hyperscientia-physis', type: 'product', name: 'Hyperscientia Physis', category: 'PRODUCTOS', description: 'Versión mensual enfocada en física.', price: 1000, unit: 'mes', maxQuantity: 12, icon: 'Φ' },
  { id: 'hyperscientia-chem', type: 'product', name: 'Hyperscientia Chem', category: 'PRODUCTOS', description: 'Versión mensual enfocada en química.', price: 1000, unit: 'mes', maxQuantity: 12, icon: '⚗' },
  { id: 'hyperscientia-bio', type: 'product', name: 'Hyperscientia Bio', category: 'PRODUCTOS', description: 'Versión mensual enfocada en biología.', price: 1000, unit: 'mes', maxQuantity: 12, icon: '⌬' },
  { id: 'hyperscientia-geo', type: 'product', name: 'Hyperscientia Geo', category: 'PRODUCTOS', description: 'Versión mensual enfocada en geociencias.', price: 1000, unit: 'mes', maxQuantity: 12, icon: '◈' }
];
let catalog = [...STATIC_CATALOG];
let cart = readCart();
let currentLanguage = localStorage.getItem('language') || 'es';
const $ = (selector) => document.querySelector(selector);

const storeStrings = {
  es: { back: '← Volver a Psideralis', eyebrow: 'TIENDA DE SERVICIOS', title: 'Convierte el plan<br>en <span class="gradient-text">progreso.</span>', intro: 'Selecciona unidades de trabajo definidas para iniciar, mejorar o mantener tus productos digitales.', services: 'Servicios', products: 'Productos', selection: 'TU SELECCIÓN', cart: 'Carrito', empty: 'Ajusta las cantidades del catálogo para añadir servicios al carrito.', per: 'por', loading: 'Cargando catálogo…' },
  en: { back: '← Back to Psideralis', eyebrow: 'SERVICE STORE', title: 'Turn the plan<br>into <span class="gradient-text">progress.</span>', intro: 'Choose defined units of work to launch, improve, or maintain your digital products.', services: 'Services', products: 'Products', selection: 'YOUR SELECTION', cart: 'Cart', empty: 'Adjust catalogue quantities to add services to your cart.', per: 'per', loading: 'Loading catalogue…' },
  fr: { back: '← Retour à Psideralis', eyebrow: 'BOUTIQUE DE SERVICES', title: 'Transformez le plan<br>en <span class="gradient-text">progrès.</span>', intro: 'Choisissez des unités de travail définies pour lancer, améliorer ou maintenir vos produits numériques.', services: 'Services', products: 'Produits', selection: 'VOTRE SÉLECTION', cart: 'Panier', empty: 'Ajustez les quantités du catalogue pour ajouter des services à votre panier.', per: 'par', loading: 'Chargement du catalogue…' }
};
const productTranslations = {
  en: {
    'web-design': ['Web page design', 'Visual direction, structure, and a prototype for a clear memorable page.', 'project', 'WEB'], 'web-development': ['Web development', 'A fast, accessible web page built to grow.', 'project', 'WEB'], 'web-launch': ['Web implementation', 'Publishing, domain, technical configuration, and production launch.', 'launch', 'WEB'], 'web-care': ['Website management', 'Monthly maintenance, updates, and care for your site.', 'month', 'CONTINUITY'], 'cross-platform': ['Cross-platform app', 'A development foundation for desktop and mobile from one product.', 'module', 'APPLICATIONS'], 'licenses-distribution': ['Licensing & distribution', 'License management and desktop-app distribution preparation.', 'project', 'APPLICATIONS'], 'data-analysis': ['Data analysis', 'Cleaning, reading, and visualization to turn data into decisions.', 'package', 'DATA'], 'technical-support': ['Technical support', 'A block of hours for issues, adjustments, and technical questions.', 'hour', 'SUPPORT']
  },
  fr: {
    'web-design': ['Conception de site web', 'Direction visuelle, structure et prototype d’une page claire et mémorable.', 'projet', 'WEB'], 'web-development': ['Développement web', 'Une page web rapide, accessible et prête à évoluer.', 'projet', 'WEB'], 'web-launch': ['Mise en ligne web', 'Publication, domaine, configuration technique et mise en production.', 'lancement', 'WEB'], 'web-care': ['Administration web', 'Maintenance, mises à jour et suivi mensuel de votre site.', 'mois', 'CONTINUITÉ'], 'cross-platform': ['Application multiplateforme', 'Base de développement pour ordinateur et mobile à partir d’un seul produit.', 'module', 'APPLICATIONS'], 'licenses-distribution': ['Licences et distribution', 'Gestion des licences et préparation à la distribution de votre application.', 'projet', 'APPLICATIONS'], 'data-analysis': ['Analyse de données', 'Nettoyage, lecture et visualisation pour transformer les données en décisions.', 'forfait', 'DONNÉES'], 'technical-support': ['Support technique', 'Bloc d’heures pour incidents, ajustements et questions techniques.', 'heure', 'SUPPORT']
  }
};
Object.assign(productTranslations.en, {
  'web-design': ['Web page design', 'Design for TV, desktop, tablet, mobile, and PWA.', 'project', 'WEB'],
  'web-development': ['Web page programming', 'Includes users, security, monitoring, and marketing.', 'project', 'WEB'],
  'web-implementation': ['Web page implementation', 'Cloud or on-premises implementation with databases.', 'implementation', 'WEB'],
  'web-administration': ['Website administration', 'Domain, tracking, security, monitoring, and marketing.', 'month', 'WEB'],
  'desktop-app': ['Desktop cross-platform app', 'Development for Windows, Linux, and macOS.', 'project', 'APPLICATIONS'],
  'mobile-app': ['Mobile cross-platform app', 'Development for Android and iOS.', 'project', 'APPLICATIONS'],
  'licenses-distribution': ['100 licenses and distribution of 5 software products', 'Monthly licensing and distribution for five software products.', 'month', 'APPLICATIONS'],
  'data-analysis': ['Data analysis', 'Analysis and visualization that turns data into decisions.', 'project', 'DATA'],
  'technical-support': ['Technical support', 'Ongoing technical support for your operation.', 'month', 'SUPPORT'],
  'digital-advertising': ['Digital advertising campaign', 'Instagram, Facebook, X, TikTok, and YouTube.', 'month', 'MARKETING'],
  'digital-marketing': ['Digital marketing campaign', 'Email and SMS.', 'month', 'MARKETING'],
  'ultralogik-math': ['uLTRALogik · Mathematics package', 'Monthly package of mathematics tools and resources.', 'month', 'PRODUCTS'],
  'hyperscientia-physis': ['Hyperscientia Physis', 'Monthly edition focused on physics.', 'month', 'PRODUCTS'],
  'hyperscientia-chem': ['Hyperscientia Chem', 'Monthly edition focused on chemistry.', 'month', 'PRODUCTS'],
  'hyperscientia-bio': ['Hyperscientia Bio', 'Monthly edition focused on biology.', 'month', 'PRODUCTS'],
  'hyperscientia-geo': ['Hyperscientia Geo', 'Monthly edition focused on geosciences.', 'month', 'PRODUCTS']
});
Object.assign(productTranslations.fr, {
  'web-design': ['Conception de site web', 'Conception pour TV, ordinateur, tablette, mobile et PWA.', 'projet', 'WEB'],
  'web-development': ['Programmation de site web', 'Inclut utilisateurs, sécurité, surveillance et marketing.', 'projet', 'WEB'],
  'web-implementation': ['Implémentation de site web', 'Dans le cloud ou sur site, avec bases de données.', 'implémentation', 'WEB'],
  'web-administration': ['Administration de site web', 'Domaine, suivi, sécurité, surveillance et marketing.', 'mois', 'WEB'],
  'desktop-app': ['Application multiplateforme de bureau', 'Développement pour Windows, Linux et macOS.', 'projet', 'APPLICATIONS'],
  'mobile-app': ['Application mobile multiplateforme', 'Développement pour Android et iOS.', 'projet', 'APPLICATIONS'],
  'licenses-distribution': ['100 licences et distribution de 5 logiciels', 'Licences et distribution mensuelles pour cinq logiciels.', 'mois', 'APPLICATIONS'],
  'data-analysis': ['Analyse de données', 'Analyse et visualisation pour transformer les données en décisions.', 'projet', 'DONNÉES'],
  'technical-support': ['Support technique', 'Support technique continu pour votre activité.', 'mois', 'SUPPORT'],
  'digital-advertising': ['Campagne de publicité numérique', 'Instagram, Facebook, X, TikTok et YouTube.', 'mois', 'MARKETING'],
  'digital-marketing': ['Campagne de marketing numérique', 'E-mail et SMS.', 'mois', 'MARKETING'],
  'ultralogik-math': ['uLTRALogik · Pack de mathématiques', 'Pack mensuel d’outils et de ressources mathématiques.', 'mois', 'PRODUITS'],
  'hyperscientia-physis': ['Hyperscientia Physis', 'Édition mensuelle axée sur la physique.', 'mois', 'PRODUITS'],
  'hyperscientia-chem': ['Hyperscientia Chem', 'Édition mensuelle axée sur la chimie.', 'mois', 'PRODUITS'],
  'hyperscientia-bio': ['Hyperscientia Bio', 'Édition mensuelle axée sur la biologie.', 'mois', 'PRODUITS'],
  'hyperscientia-geo': ['Hyperscientia Geo', 'Édition mensuelle axée sur les géosciences.', 'mois', 'PRODUITS']
});
function storeText(key) { return storeStrings[currentLanguage]?.[key] || storeStrings.es[key]; }
function displayProduct(product) { const translation = productTranslations[currentLanguage]?.[product.id]; return translation ? { ...product, name: translation[0], description: translation[1], unit: translation[2], category: translation[3] } : product; }
function formatMoney(value) { return new Intl.NumberFormat({ es: 'es-GT', en: 'en-US', fr: 'fr-FR' }[currentLanguage] || 'es-GT', { style: 'currency', currency: 'USD' }).format(value); }

function readCart() { try { return JSON.parse(localStorage.getItem(cartKey)) || {}; } catch { return {}; } }
function persistCart() { localStorage.setItem(cartKey, JSON.stringify(cart)); }
function cartCount() { return Object.values(cart).reduce((total, qty) => total + qty, 0); }
function cartItems() { return catalog.filter((item) => cart[item.id]).map((item) => ({ ...item, quantity: cart[item.id] })); }
function setMiniCart() { const counter = $('#miniCartCount'); if (counter) counter.textContent = cartCount(); }
function currentRoute() {
  const hashRoute = window.location.hash.slice(1).split('?')[0];
  if (hashRoute) return hashRoute.startsWith('/') ? hashRoute : `/${hashRoute}`;
  return window.location.pathname === '/tienda' ? '/tienda' : '/';
}
function setRoute(path, replace = false) {
  const routeHash = path === '/tienda' ? '#/tienda' : path === '/global-reach' ? '#/global-reach' : '#/';
  if (window.location.hash !== routeHash) {
    if (replace) window.history.replaceState({}, '', routeHash);
    else window.location.hash = routeHash;
  }
  renderRoute();
  window.scrollTo({ top: 0, behavior: 'instant' });
}
function isStore() { return currentRoute() === '/tienda'; }
function isGlobalReach() { return currentRoute() === '/global-reach'; }
function routeLinks() { document.querySelectorAll('[data-route]').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); setRoute(link.dataset.route === 'store' ? '/tienda' : link.dataset.route === 'global' ? '/global-reach' : '/'); })); }

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
    if (!formId) throw new Error(messages.missing);
    const data = new FormData(form);
    data.append('_subject', 'Nuevo mensaje desde Psideralis');
    const response = await fetch(`https://formspree.io/f/${encodeURIComponent(formId)}`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: data
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
/*
function legacyChangeItem(id, delta) { approvedCode = ''; const product = catalog.find((item) => item.id === id); if (!product) return; const next = Math.max(0, Math.min(product.maxQuantity, (cart[id] || 0) + delta)); if (next) cart[id] = next; else delete cart[id]; persistCart(); setMiniCart(); renderStore(); }
const quoteCopy = {
  es: { button: 'Solicitar cotización o ingresar código →', title: 'Cuéntanos sobre tu proyecto', intro: 'Completa todos los campos. Revisaremos tu solicitud y te enviaremos un código si se aprueba la cotización.', name: 'Nombre', email: 'Correo electrónico', description: 'Objetivo y descripción del proyecto', web: '¿Qué páginas, funciones y estilo necesitas?', continuity: '¿Qué sitio necesita mantenimiento y qué tareas requieres?', applications: '¿Para qué plataformas y qué funciones necesitas?', data: '¿Qué datos tienes y qué análisis o resultados buscas?', support: '¿Qué problema necesitas resolver y en qué sistemas?', marketing: '¿Qué objetivos y audiencia tiene tu campaña?', products: '¿Qué producto educativo necesitas y para quién?', send: 'Enviar solicitud', sending: 'Enviando solicitud…', sent: 'Solicitud enviada. Psideralis se pondrá en contacto contigo.', codeTitle: '¿Ya tienes un código aprobado?', code: 'Código de cotización', apply: 'Validar código', approved: 'Código validado. Elige un método de pago.', close: 'Cerrar' },
  en: { button: 'Request a quote or enter a code →', title: 'Tell us about your project', intro: 'Complete every field. We will review your request and send you a code if the quote is approved.', name: 'Name', email: 'Email', description: 'Project goals and description', web: 'What pages, features and style do you need?', continuity: 'Which site needs maintenance and what tasks are required?', applications: 'Which platforms and features do you need?', data: 'What data do you have and what analysis or results do you need?', support: 'What problem and systems need support?', marketing: 'What are the campaign goals and audience?', products: 'Which educational product do you need and for whom?', send: 'Send request', sending: 'Sending request…', sent: 'Request sent. Psideralis will contact you.', codeTitle: 'Already have an approved code?', code: 'Quote code', apply: 'Validate code', approved: 'Code validated. Choose a payment method.', close: 'Close' },
  fr: { button: 'Demander un devis ou saisir un code →', title: 'Parlez-nous de votre projet', intro: 'Remplissez tous les champs. Nous examinerons votre demande et vous enverrons un code si le devis est approuvé.', name: 'Nom', email: 'Adresse e-mail', description: 'Objectif et description du projet', web: 'Quelles pages, fonctionnalités et quel style souhaitez-vous ?', continuity: 'Quel site nécessite une maintenance et quelles tâches sont requises ?', applications: 'Pour quelles plateformes et avec quelles fonctionnalités ?', data: 'Quelles données possédez-vous et quels résultats recherchez-vous ?', support: 'Quel problème et quels systèmes nécessitent une assistance ?', marketing: 'Quels sont les objectifs et le public de la campagne ?', products: 'Quel produit éducatif vous faut-il et pour qui ?', send: 'Envoyer la demande', sending: 'Envoi de la demande…', sent: 'Demande envoyée. Psideralis vous contactera.', codeTitle: 'Vous avez déjà un code approuvé ?', code: 'Code du devis', apply: 'Valider le code', discount: 'Réduction', approved: 'Code validé. Choisissez un moyen de paiement.', close: 'Fermer' }
};
const categoryKeys = { WEB: 'web', CONTINUIDAD: 'continuity', APLICACIONES: 'applications', DATOS: 'data', SOPORTE: 'support', MARKETING: 'marketing', PRODUCTOS: 'products' };
let approvedCode = '';
function legacyQuoteForm() {
  const t = quoteCopy[currentLanguage] || quoteCopy.es;
  const categories = [...new Set(cartItems().map(item => categoryKeys[item.category]))];
  return `<div class="quote-panel" id="quotePanel" hidden><div class="quote-heading"><h3>${categories.length ? t.title : t.codeTitle}</h3><button type="button" id="closeQuote" aria-label="${t.close}">×</button></div>${categories.length ? `<p>${t.intro}</p>` : ""}<form id="quoteForm" ${categories.length ? "" : "hidden"}><label>${t.name}<input name="name" required maxlength="120" autocomplete="name"></label><label>${t.email}<input name="email" type="email" required maxlength="254" autocomplete="email"></label><label>${t.description}<textarea name="description" required maxlength="4000" rows="3"></textarea></label>${categories.map(key => `<label>${t[key]}<textarea name="${key}" required maxlength="2000" rows="3"></textarea></label>`).join('')}<button class="button button-primary" type="submit">${t.send}</button></form><div class="quote-code"><h3>${t.codeTitle}</h3><form id="codeForm"><label>${t.code}<input name="code" required maxlength="100" autocomplete="off"></label><button class="button button-secondary" type="submit">${t.apply}</button></form><p id="quoteTotal"></p></div><p id="quoteMessage" class="store-message" role="status"></p></div>`;
}
function legacySetupQuote() {
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
    data.append('_subject', 'Nueva solicitud de cotizaciÃ³n de Psideralis');
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
  $('#codeForm')?.addEventListener('submit', async event => {
    event.preventDefault(); approvedCode = ''; $('#paymentChoice').classList.remove('open'); $('#quoteTotal').textContent = '';
    const code = new FormData(event.currentTarget).get('code').trim();
    try {
      const result = await validateActivationCode(code);
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

async function validateActivationCode(code) {
  if (!PAYMENT_API_URL) throw new Error('La validación de códigos requiere configurar PAYMENT_API_URL.');
  const response = await fetch(paymentApi('/api/quotes/validate'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'El código de cotización no es válido.');
  return result;
}
function renderStoreCards(entries) {
  return entries.map((raw) => {
    const item = displayProduct(raw);
    return `<article class="store-card"><div class="store-card-top"><span class="store-icon">${item.icon}</span><small>${item.category}</small></div><h3>${item.name}</h3><p>${item.description}</p><div class="store-card-bottom"><div class="price"><strong>${formatMoney(item.price)}</strong><span>${storeText('per')} ${item.unit}</span></div><div class="qty"><button aria-label="- ${item.name}" data-store-change="-1" data-id="${item.id}">−</button><output>${cart[item.id] || 0}</output><button aria-label="+ ${item.name}" data-store-change="1" data-id="${item.id}">+</button></div></div></article>`;
  }).join('');
}
function legacyRenderStore() {
  const root = $('#storeView');
  const items = cartItems().map(displayProduct);
  const total = cartItems().reduce((sum, item) => sum + item.price * item.quantity, 0);
  const services = catalog.filter((item) => item.type !== 'product');
  const products = catalog.filter((item) => item.type === 'product');
  const paymentPanel = items.length ? `<div class="cart-total"><span>${storeText('total')}</span><strong>${formatMoney(total)}</strong></div><button class="button button-primary store-checkout" id="openPayment">${(quoteCopy[currentLanguage] || quoteCopy.es).button}</button>${quoteForm()}<div class="payment-choice" id="paymentChoice"><button data-provider="paypal"><b>PayPal</b><br><small>PayPal Checkout</small></button><button data-provider="stripe"><b>Stripe</b><br><small>Stripe Payment Page</small></button><button data-provider="bitcoin"><b>Bitcoin · Proton Wallet</b><br><small>${storeText('bitcoin')}</small></button></div><div class="bitcoin-box" id="bitcoinBox"></div><p id="storeMessage" class="store-message"></p>` : `<button class="button button-primary store-checkout" id="openPayment">${(quoteCopy[currentLanguage] || quoteCopy.es).codeTitle}</button>${quoteForm()}<div class="payment-choice" id="paymentChoice"></div><div class="bitcoin-box" id="bitcoinBox"></div><p id="storeMessage" class="store-message"></p>`;
  root.innerHTML = `<section class="store-page"><a href="#/" class="back-store" data-route="home">${storeText('back')}</a><div class="store-hero"><div><span class="section-label">${storeText('eyebrow')}</span><h1>${storeText('title')}</h1></div><p>${storeText('intro')}</p></div><div class="store-layout"><div class="store-catalog"><section class="store-catalog-section"><h2 class="store-section-title">${storeText('services')}</h2><div class="store-grid">${renderStoreCards(services)}</div></section><section class="store-catalog-section"><h2 class="store-section-title">${storeText('products')}</h2><div class="store-grid">${renderStoreCards(products)}</div></section></div><aside class="cart-box"><span class="section-label">${storeText('selection')}</span><h2>${storeText('cart')} <small>(${cartCount()})</small></h2><div>${items.length ? items.map((item) => `<div class="cart-line"><span>${item.name} × ${item.quantity}</span><strong>${formatMoney(item.price * item.quantity)}</strong></div>`).join('') : `<p class="cart-empty">${storeText('empty')}</p>`}</div>${paymentPanel}</aside></div></section>`;
  root.querySelectorAll('.store-card').forEach((card) => {
    const id = card.querySelector('[data-id]')?.dataset.id;
    const item = catalog.find((product) => product.id === id);
    if (item) card.insertAdjacentHTML('beforeend', directPaymentMarkup(displayProduct(item)));
  });
  routeLinks();
  root.querySelectorAll('[data-store-change]').forEach((button) => button.addEventListener('click', () => changeItem(button.dataset.id, Number(button.dataset.storeChange))));
  root.querySelectorAll('[data-direct-payment]').forEach((button) => button.addEventListener('click', () => directPayment(button.dataset.directPayment, button.dataset.id)));
  setupQuote();
  root.querySelectorAll('[data-provider]').forEach((button) => button.addEventListener('click', () => checkout(button.dataset.provider)));
}
function directPaymentMarkup(item) {
  return `<div class="direct-payment" aria-label="Payment options for ${item.name}"><strong>Pago directo</strong><div class="direct-payment-actions"><button type="button" data-direct-payment="stripe" data-id="${item.id}">Stripe</button><button type="button" data-direct-payment="paypal" data-id="${item.id}">PayPal</button><button type="button" data-direct-payment="bitcoin" data-id="${item.id}">Proton BTC</button></div><p class="direct-payment-message" data-direct-message="${item.id}" role="status"></p></div>`;
}

function directPaymentMessage(id, text, error = false) {
  const box = document.querySelector(`[data-direct-message="${id}"]`);
  if (!box) return;
  box.textContent = text;
  box.classList.toggle('error', error);
}

function directPayment(provider, productId) {
  const product = catalog.find((item) => item.id === productId);
  if (!product) return;
  if (provider === 'bitcoin') {
    if (!/^bc1|^[13]/i.test(PROTON_WALLET_ADDRESS)) {
      directPaymentMessage(productId, 'Proton BTC aún no está configurado.', true);
      return;
    }
    directPaymentMessage(productId, `Proton BTC: ${PROTON_WALLET_ADDRESS}. Importe: ${formatMoney(product.price)}. Coordina el importe en BTC con Psideralis.`, false);
    return;
  }
  const link = (provider === 'stripe' ? STRIPE_PAYMENT_LINKS : PAYPAL_PAYMENT_LINKS)[productId];
  if (!link) {
    directPaymentMessage(productId, `${provider === 'stripe' ? 'Stripe Payment Link' : 'PayPal Payment Link'} aún no está configurado para este elemento.`, true);
    return;
  }
  window.location.assign(link);
}
function message(text, error = false) { const box = $('#storeMessage'); if (box) { box.textContent = text; box.classList.toggle('error', error); } }
const bitcoinText = {
  es: { title: 'Direcci\u00f3n Bitcoin', instruction: 'Env\u00eda el pago desde tu billetera. Coordina con Psideralis el importe en BTC y la confirmaci\u00f3n del pago.', total: 'Total del proyecto (USD)' },
  en: { title: 'Bitcoin address', instruction: 'Send the payment from your wallet. Coordinate the BTC amount and payment confirmation with Psideralis.', total: 'Project total (USD)' },
  fr: { title: 'Adresse Bitcoin', instruction: 'Envoyez le paiement depuis votre portefeuille. Convenez du montant en BTC et de la confirmation avec Psideralis.', total: 'Total du projet (USD)' }
};
async function checkout(provider) {
  message(storeText('preparing'));
  try {
    if (!PAYMENT_API_URL) throw new Error('Configura PAYMENT_API_URL para procesar pagos desde GitHub Pages.');
    if (!approvedCode) throw new Error('Primero valida un código de cotización aprobado.');
    const items = cartItems();
    if (!items.length) throw new Error('Primero añade servicios al carrito.');
    const response = await fetch(paymentApi('/api/checkout'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ provider, code: approvedCode, items: items.map(({ id, quantity }) => ({ id, quantity })) }) });
    const payment = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payment.error || 'No se pudo iniciar el pago.');
    if (provider === 'paypal' || provider === 'stripe') { window.location.assign(payment.checkoutUrl); return; }
    const box = $('#bitcoinBox'); const text = bitcoinText[currentLanguage] || bitcoinText.es;
    box.replaceChildren();
    box.classList.add('open');

    const title = document.createElement('strong');
    title.textContent = text.title;
    const address = document.createElement('p');
    address.className = 'bitcoin-address';
    address.textContent = payment.address;
    const totalLine = document.createElement('p');
    totalLine.textContent = `${text.total}: ${formatMoney(payment.total)}`;
    const instruction = document.createElement('p');
    instruction.textContent = text.instruction;

    box.append(title, address, totalLine, instruction);
    message('');
  } catch (error) {
    message(error.message, true);
  }
}
async function handlePaymentReturn() {
  const hashQuery = window.location.hash.includes('?') ? window.location.hash.slice(window.location.hash.indexOf('?') + 1) : '';
  const params = new URLSearchParams(hashQuery || window.location.search);
  const state = params.get('payment');
  if (!state) return;
  let notice = ''; let isError = false;
  try {
    if (state === 'stripe') {
      if (!PAYMENT_API_URL) throw new Error('No se puede verificar Stripe sin PAYMENT_API_URL.');
      const response = await fetch(paymentApi(`/api/payments/stripe/verify?order=${encodeURIComponent(params.get('order') || '')}&session_id=${encodeURIComponent(params.get('session_id') || '')}`));
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'No se pudo verificar el pago con Stripe.');
      notice = `Pago verificado. Pedido ${result.orderId} confirmado.`;
    } else if (state === 'confirmed') {
      notice = `Pago verificado. Pedido ${params.get('order') || ''} confirmado.`;
    } else if (state === 'cancelled') {
      notice = 'El pago fue cancelado.'; isError = true;
    } else if (state === 'error') {
      notice = params.get('reason') || 'No se pudo confirmar el pago.'; isError = true;
    }
  } catch (error) { notice = error.message || 'No se pudo verificar el pago.'; isError = true; }
  window.history.replaceState({}, '', '#/tienda');
  await renderRoute();
  if (notice) message(notice, isError);
}
*/
const globalReachRegions = [
  { id: 'north-america', label: 'Norteamérica', reach: '1.2–2.4 M', return: '$180–$360', focus: 'SaaS B2B, plataformas y automatización' },
  { id: 'latin-america', label: 'Latinoamérica', reach: '1.0–2.1 M', return: '$150–$300', focus: 'Comercio digital, educación y servicios' },
  { id: 'europe', label: 'Europa', reach: '1.4–2.7 M', return: '$190–$380', focus: 'Productos regulados y modernización cloud' },
  { id: 'africa', label: 'África', reach: '0.7–1.5 M', return: '$120–$250', focus: 'Móvil, pagos y servicios esenciales' },
  { id: 'middle-east', label: 'Medio Oriente', reach: '0.6–1.3 M', return: '$160–$320', focus: 'Infraestructura, datos y experiencias premium' },
  { id: 'south-asia', label: 'Asia del Sur', reach: '1.5–3.0 M', return: '$110–$240', focus: 'Escala móvil, datos y soporte multilingüe' },
  { id: 'east-asia', label: 'Asia Oriental', reach: '1.3–2.8 M', return: '$170–$350', focus: 'Plataformas, IA y operaciones de alta escala' },
  { id: 'oceania', label: 'Oceanía', reach: '0.4–0.9 M', return: '$160–$320', focus: 'SaaS, servicios profesionales y cloud nativo' },
  { id: 'antarctica', label: 'Antártida', reach: 'No aplicable', return: 'No aplicable', focus: 'Región sin escenario comercial activo' }
];

const regionalPlanningValues = {
  'north-america': { audience: [1.2, 2.4], grossReturn: [180, 360] },
  'latin-america': { audience: [1.0, 2.1], grossReturn: [150, 300] },
  europe: { audience: [1.4, 2.7], grossReturn: [190, 380] },
  africa: { audience: [0.7, 1.5], grossReturn: [120, 250] },
  'middle-east': { audience: [0.6, 1.3], grossReturn: [160, 320] },
  'south-asia': { audience: [1.5, 3.0], grossReturn: [110, 240] },
  'east-asia': { audience: [1.3, 2.8], grossReturn: [170, 350] },
  oceania: { audience: [0.4, 0.9], grossReturn: [160, 320] }
};

const coverageScenarios = [
  { percentage: 5, label: 'Validar', investment: 100 },
  { percentage: 10, label: 'Optimizar', investment: 200 },
  { percentage: 25, label: 'Escalar', investment: 500 },
  { percentage: 50, label: 'Expandir', investment: 1000 }
];

function compactAudience(value) {
  const users = value * 1000000;
  return users >= 1000000 ? `${(users / 1000000).toFixed(2).replace(/\.00$/, '')} M` : `${Math.round(users / 1000)} mil`;
}

function currencyRange(minimum, maximum) {
  return `$${Math.round(minimum).toLocaleString('en-US')}–$${Math.round(maximum).toLocaleString('en-US')}`;
}

function coverageScenarioMarkup(region) {
  const values = regionalPlanningValues[region.id];
  if (!values) return '<p class="scenario-unavailable">No hay una proyecci&oacute;n comercial para esta regi&oacute;n.</p>';
  return coverageScenarios.map((scenario) => {
    const audience = values.audience.map((value) => value * scenario.percentage / 100);
    const gross = values.grossReturn.map((value) => value * scenario.investment / 100);
    const profit = gross.map((value) => value - scenario.investment);
    return `<article class="coverage-card"><div><span>${scenario.percentage}% de alcance</span><b>${scenario.label}</b></div><dl><div><dt>Usuarios</dt><dd>${compactAudience(audience[0])}–${compactAudience(audience[1])}</dd></div><div><dt>Inversi&oacute;n</dt><dd>$${scenario.investment.toLocaleString('en-US')}</dd></div><div><dt>Ganancia estimada</dt><dd>${currencyRange(profit[0], profit[1])}</dd></div></dl></article>`;
  }).join('');
}

function geographicRegion(properties) {
  const continent = properties.CONTINENT;
  const subregion = properties.SUBREGION;
  if (continent === 'Asia') {
    if (subregion === 'Southern Asia') return 'south-asia';
    if (subregion === 'Western Asia') return 'middle-east';
    return 'east-asia';
  }
  if (continent === 'South America' || subregion === 'Central America' || subregion === 'Caribbean') return 'latin-america';
  if (continent === 'North America') return 'north-america';
  if (continent === 'Europe') return 'europe';
  if (continent === 'Africa') return 'africa';
  if (continent === 'Oceania') return 'oceania';
  return 'antarctica';
}

function projectCoordinate([longitude, latitude]) {
  return [((longitude + 180) / 360 * 960).toFixed(2), ((90 - latitude) / 180 * 470).toFixed(2)];
}

function geographicPath(geometry) {
  if (!geometry) return '';
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.type === 'MultiPolygon' ? geometry.coordinates : [];
  return polygons.flatMap((polygon) => polygon.map((ring) => {
    const points = ring.map(projectCoordinate);
    return points.length ? `M${points.map((point) => point.join(',')).join('L')}Z` : '';
  })).join('');
}

function renderGeographicMap(map) {
  const paths = worldCountries.features
    .filter((feature) => feature.geometry)
    .map((feature) => {
      const region = geographicRegion(feature.properties);
      const name = String(feature.properties.NAME_ES || feature.properties.NAME_EN || feature.properties.ADMIN || 'Región');
      return `<path class="map-region map-country${region === 'north-america' ? ' active' : ''}" data-region="${region}" d="${geographicPath(feature.geometry)}"><title>${name}</title></path>`;
    }).join('');
  map.setAttribute('viewBox', '0 0 960 470');
  map.innerHTML = `${paths}<g class="map-grid"><path d="M0 78h960M0 157h960M0 235h960M0 313h960M0 392h960M160 0v470M320 0v470M480 0v470M640 0v470M800 0v470"/></g>`;
}

function renderGlobalReach() {
  const root = $('#globalReachView');
  const region = globalReachRegions[0];
  root.innerHTML = `<section class="global-page"><a href="#/" class="back-store" data-route="home">← Volver a Psideralis</a><header class="global-hero"><div><span class="section-label">ALCANCE Y CAPACIDAD DIGITAL</span><h1>Diseña para el mundo.<br><span class="gradient-text">Decide por región.</span></h1><p>Explora escenarios de mercado y la arquitectura que permite entregar productos y servicios digitales a escala global.</p></div><div class="global-disclaimer">Estimaciones de planificación por cada $100 invertidos. No son una garantía de resultados; deben validarse con audiencia, oferta, canal, costo de adquisición y conversión reales.</div></header><div class="global-overview"><div class="global-map-card glow-card"><div class="map-header"><div><span class="section-label">MAPA INTERACTIVO</span><h2>Potencial por continente y región</h2></div><span class="map-hint">Selecciona una región</span></div><svg class="world-map" viewBox="0 0 960 470" role="img" aria-label="Mapa mundial interactivo por regiones"><path class="map-region active" data-region="north-america" d="M90 85l130-38 86 45-22 65-75 25-26 70-79-14-41-68z"/><path class="map-region" data-region="latin-america" d="M245 270l58 12 27 55-16 92-38 30-29-68 10-57-32-30z"/><path class="map-region" data-region="europe" d="M438 90l76-20 55 25-17 42-80 5-45-22z"/><path class="map-region" data-region="africa" d="M462 176l82 7 40 75-34 121-74-8-34-86z"/><path class="map-region" data-region="middle-east" d="M570 155l67-6 43 38-44 47-59-13z"/><path class="map-region" data-region="south-asia" d="M647 230l84-8 42 47-36 62-70-27z"/><path class="map-region" data-region="east-asia" d="M735 110l122 11 44 85-48 65-111-30-32-69z"/><path class="map-region" data-region="oceania" d="M782 335l88-25 45 33-35 53-90-11z"/><g class="map-grid"><path d="M25 155h910M25 235h910M25 315h910M180 30v405M350 30v405M520 30v405M690 30v405M860 30v405"/></g></svg><div class="map-legend"><span><i></i> Región seleccionada</span><span><i></i> Región disponible para explorar</span></div></div><aside class="region-panel glow-card"><span class="section-label">ESCENARIO SELECCIONADO</span><h2 id="regionName">${region.label}</h2><div class="region-stat"><span>Usuarios potencialmente alcanzables</span><strong id="regionReach">${region.reach}</strong><small>Audiencia digital estimada para una campaña segmentada</small></div><div class="region-stat"><span>Retorno estimado por cada $100</span><strong id="regionReturn">${region.return}</strong><small>Rango ilustrativo de retorno bruto potencial</small></div><div class="region-focus"><span>Foco recomendado</span><p id="regionFocus">${region.focus}</p></div><a class="button button-primary" href="#contacto" data-route="home">Diseñar una estrategia <span>→</span></a></aside></div><section class="global-stack"><div class="section-heading"><div><span class="section-label">ECOSISTEMA TECNOLÓGICO</span><h2>La infraestructura detrás del <span class="gradient-text">alcance.</span></h2></div><p>Seleccionamos herramientas según objetivo, región, requisitos de datos y etapa de crecimiento.</p></div><div class="stack-grid"><article class="stack-card glow-card"><span class="stack-kicker">CLOUD</span><h3>Proveedores globales</h3><div class="provider-list"><b>AWS</b><b>Microsoft Azure</b><b>Google Cloud</b><b>Cloudflare</b></div><p>Base para aplicaciones multiplataforma, datos, seguridad, contenido y continuidad operativa.</p><small>Relacionado: arquitectura cloud, implementación web y administración.</small></article><article class="stack-card glow-card"><span class="stack-kicker">INFRAESTRUCTURA</span><h3>Entrega y operación</h3><div class="provider-list"><b>Docker</b><b>Kubernetes</b><b>Terraform</b><b>GitHub Actions</b></div><p>Automatización de despliegues, entornos reproducibles, observabilidad y escalamiento.</p><small>Relacionado: desarrollo web, modernización y soporte técnico.</small></article><article class="stack-card glow-card"><span class="stack-kicker">SOFTWARE</span><h3>Productos y datos</h3><div class="provider-list"><b>React</b><b>Node.js</b><b>PostgreSQL</b><b>Python</b></div><p>Interfaces accesibles, servicios de producto, análisis de datos e inteligencia aplicada.</p><small>Relacionado: diseño, aplicaciones, análisis y productos educativos.</small></article></div></section><section class="global-cta glow-card"><div><span class="section-label">DE SEÑAL A DECISIÓN</span><h2>Convierte un mercado potencial en una hoja de ruta medible.</h2><p>Solicita una cotización y definimos segmentos, producto, infraestructura y métricas para tu objetivo.</p></div><a href="#/tienda" data-route="store" class="button button-primary">Ver servicios y productos <span>→</span></a></section></section>`;
  root.querySelector('.world-map').innerHTML = `<path class="map-region active" data-region="north-america" d="M69 104l23-35 44-20 38 5 23 22 44 12 27 30-16 22-36-2-25 22-17 39-41 14-26-25-31-8-10-31-20-20z"/><path class="map-region" data-region="latin-america" d="M230 228l27 13 15 31 21 21 4 35-16 28 2 41-17 38-20-34-8-48-15-31 2-34-20-21 16-18z"/><path class="map-region" data-region="europe" d="M422 103l18-18 35-3 23 13-2 16-25 6-11 17-25-2-13-13z"/><path class="map-region" data-region="africa" d="M441 158l28-9 35 14 18 35-7 50-24 57-25 21-20-34-17-54 3-46-19-32z"/><path class="map-region" data-region="middle-east" d="M515 147l42-2 28 17-5 25-25 18-35-12-18-23z"/><path class="map-region" data-region="south-asia" d="M590 206l35-16 37 10 19 29-12 32-30 27-26-24-22-21z"/><path class="map-region" data-region="east-asia" d="M650 96l44-22 59 9 36 22 33 8 26 31-8 33-34 11-20 28-40 5-28-25-41 2-26-32 10-39-23-20z"/><path class="map-region" data-region="oceania" d="M756 337l32-20 43 7 15 20-22 17-44 1-24-12z"/><path class="map-region" data-region="oceania" d="M866 373l26-6 18 12-13 16-28-5z"/><path class="map-region" data-region="north-america" d="M307 139l12 4 5 13-10 10-12-9z"/><path class="map-region" data-region="east-asia" d="M871 220l10 5-2 12-11 4-7-8z"/><g class="map-grid"><path d="M25 155h910M25 235h910M25 315h910M180 30v405M350 30v405M520 30v405M690 30v405M860 30v405"/></g>`;
  renderGeographicMap(root.querySelector('.world-map'));
  const mapSource = document.createElement('p');
  mapSource.className = 'map-source';
  mapSource.textContent = 'Límites y costas: Natural Earth, escala 1:50m.';
  root.querySelector('.map-legend').after(mapSource);
  const scenarioSection = document.createElement('section');
  scenarioSection.className = 'coverage-scenarios';
  scenarioSection.setAttribute('aria-label', 'Escenarios de cobertura y ganancia estimada');
  scenarioSection.innerHTML = `<div class="coverage-heading"><div><span class="section-label">ESCENARIOS DE COBERTURA</span><h2>Del alcance a la <span class="gradient-text">ganancia estimada.</span></h2></div><p>Modelo lineal de planificaci&oacute;n para <strong id="coverageRegion">${region.label}</strong>. Cada tramo del 5% a&ntilde;ade $100 de inversi&oacute;n; la ganancia es el retorno bruto estimado menos esa inversi&oacute;n.</p></div><div class="coverage-grid" id="coverageGrid">${coverageScenarioMarkup(region)}</div><p class="coverage-disclaimer">Cifras ilustrativas, no una promesa de resultados. Antes de invertir, valida conversi&oacute;n, costo de adquisici&oacute;n, precio, canal y capacidad operativa.</p>`;
  root.querySelector('.global-overview').after(scenarioSection);
  const stackIcons = ['☁', '◈', '⌘'];
  root.querySelectorAll('.stack-card h3').forEach((heading, index) => heading.insertAdjacentHTML('afterbegin', `<span class="stack-icon" aria-hidden="true">${stackIcons[index]}</span>`));
  const updateRegion = (id) => {
    const next = globalReachRegions.find((item) => item.id === id);
    if (!next) return;
    root.querySelectorAll('.map-region').forEach((path) => path.classList.toggle('active', path.dataset.region === id));
    $('#regionName').textContent = next.label;
    $('#regionReach').textContent = next.reach;
    $('#regionReturn').textContent = next.return;
    $('#regionFocus').textContent = next.focus;
    root.querySelector('#coverageRegion').textContent = next.label;
    root.querySelector('#coverageGrid').innerHTML = coverageScenarioMarkup(next);
  };
  root.querySelectorAll('.map-region').forEach((path) => path.addEventListener('click', () => updateRegion(path.dataset.region)));
  routeLinks();
}

async function renderRoute() { const home = $('#homeView'); const store = $('#storeView'); const global = $('#globalReachView'); const footer = $('.site-footer'); document.body.classList.toggle('store-mode', isStore() || isGlobalReach()); if (isGlobalReach()) { home.hidden = true; store.hidden = true; global.hidden = false; footer.hidden = false; renderGlobalReach(); return; } if (!isStore()) { home.hidden = false; store.hidden = true; global.hidden = true; footer.hidden = false; return; } home.hidden = true; store.hidden = false; global.hidden = true; footer.hidden = true; store.innerHTML = `<section class="store-page"><p class="cart-empty">${storeText('loading')}</p></section>`; try { loadCatalog(); renderStore(); } catch (error) { store.innerHTML = `<section class="store-page"><a href="#/" class="back-store" data-route="home">${storeText('back')}</a><p class="cart-empty">${error.message}</p></section>`; routeLinks(); } }

const quoteRequestCopy = {
  es: { button: 'Solicitar cotización', title: 'Solicita tu cotización', intro: 'Indícanos el objetivo de tu proyecto. Recibiremos tu selección y nos pondremos en contacto contigo.', name: 'Nombre', email: 'Correo electrónico', description: 'Objetivo y descripción del proyecto', send: 'Enviar solicitud', sending: 'Enviando solicitud…', sent: 'Solicitud enviada. Psideralis se pondrá en contacto contigo.', close: 'Cerrar', empty: 'Añade servicios o productos para solicitar una cotización.' },
  en: { button: 'Request a quote', title: 'Request your quote', intro: 'Tell us about your project goal. We will receive your selection and contact you.', name: 'Name', email: 'Email', description: 'Project goal and description', send: 'Send request', sending: 'Sending request…', sent: 'Request sent. Psideralis will contact you.', close: 'Close', empty: 'Add services or products to request a quote.' },
  fr: { button: 'Demander un devis', title: 'Demandez votre devis', intro: 'Décrivez l’objectif de votre projet. Nous recevrons votre sélection et vous contacterons.', name: 'Nom', email: 'E-mail', description: 'Objectif et description du projet', send: 'Envoyer la demande', sending: 'Envoi de la demande…', sent: 'Demande envoyée. Psideralis vous contactera.', close: 'Fermer', empty: 'Ajoutez des services ou produits pour demander un devis.' }
};

function renderStoreCards(entries) {
  return entries.map((raw) => {
    const item = displayProduct(raw);
    return `<article class="store-card"><div class="store-card-top"><span class="store-icon">${item.icon}</span><small>${item.category}</small></div><h3>${item.name}</h3><p>${item.description}</p><div class="store-card-bottom"><div class="price"><strong>${formatMoney(item.price)}</strong><span>${storeText('per')} ${item.unit}</span></div><div class="qty"><button aria-label="- ${item.name}" data-store-change="-1" data-id="${item.id}">−</button><output>${cart[item.id] || 0}</output><button aria-label="+ ${item.name}" data-store-change="1" data-id="${item.id}">+</button></div></div></article>`;
  }).join('');
}

function changeItem(id, delta) {
  const product = catalog.find((item) => item.id === id);
  if (!product) return;
  const next = Math.max(0, Math.min(product.maxQuantity, (cart[id] || 0) + delta));
  if (next) cart[id] = next;
  else delete cart[id];
  persistCart();
  setMiniCart();
  renderStore();
}

function quoteForm() {
  const text = quoteRequestCopy[currentLanguage] || quoteRequestCopy.es;
  return `<div class="quote-panel" id="quotePanel" hidden><div class="quote-heading"><h3>${text.title}</h3><button type="button" id="closeQuote" aria-label="${text.close}">×</button></div><p>${text.intro}</p><form id="quoteForm"><label>${text.name}<input name="name" required maxlength="120" autocomplete="name"></label><label>${text.email}<input name="email" type="email" required maxlength="254" autocomplete="email"></label><label>${text.description}<textarea name="description" required maxlength="4000" rows="3"></textarea></label><button class="button button-primary" type="submit">${text.send}</button></form><p id="quoteMessage" class="store-message" role="status"></p></div>`;
}

function setupQuote() {
  const text = quoteRequestCopy[currentLanguage] || quoteRequestCopy.es;
  const panel = $('#quotePanel');
  $('#openQuote')?.addEventListener('click', () => { panel.hidden = false; panel.querySelector('input')?.focus(); });
  $('#closeQuote')?.addEventListener('click', () => { panel.hidden = true; });
  $('#quoteForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const selected = cartItems();
    const status = $('#quoteMessage');
    const button = form.querySelector('button[type="submit"]');
    const formId = FORMSPREE_QUOTE_FORM_ID;
    if (!selected.length) { status.textContent = text.empty; status.classList.add('error'); return; }
    const data = new FormData(form);
    const list = (type) => selected.filter((item) => item.type === type).map((item) => `${item.name} (${item.id}) × ${item.quantity}`).join('\n') || 'Ninguno';
    data.append('form_type', 'Solicitud de cotización');
    data.append('services', list('service'));
    data.append('products', list('product'));
    button.disabled = true;
    status.classList.remove('error');
    status.textContent = text.sending;
    try {
      if (!formId) throw new Error('missing');
      const response = await fetch(`https://formspree.io/f/${encodeURIComponent(formId)}`, { method: 'POST', headers: { Accept: 'application/json' }, body: data });
      if (!response.ok) throw new Error('request');
      form.reset();
      status.textContent = text.sent;
    } catch {
      status.textContent = 'No se pudo enviar la solicitud. Inténtalo de nuevo.';
      status.classList.add('error');
    } finally {
      button.disabled = false;
    }
  });
}

function renderStore() {
  const root = $('#storeView');
  const items = cartItems().map(displayProduct);
  const services = catalog.filter((item) => item.type === 'service');
  const products = catalog.filter((item) => item.type === 'product');
  const text = quoteRequestCopy[currentLanguage] || quoteRequestCopy.es;
  const selection = items.length
    ? items.map((item) => `<div class="cart-line"><span>${item.name} × ${item.quantity}</span></div>`).join('')
    : `<p class="cart-empty">${text.empty}</p>`;
  root.innerHTML = `<section class="store-page"><a href="#/" class="back-store" data-route="home">${storeText('back')}</a><div class="store-hero"><div><span class="section-label">${storeText('eyebrow')}</span><h1>${storeText('title')}</h1></div><p>${storeText('intro')}</p></div><div class="store-layout"><div class="store-catalog"><section class="store-catalog-section"><h2 class="store-section-title">${storeText('services')}</h2><div class="store-grid">${renderStoreCards(services)}</div></section><section class="store-catalog-section"><h2 class="store-section-title">${storeText('products')}</h2><div class="store-grid">${renderStoreCards(products)}</div></section></div><aside class="cart-box"><span class="section-label">${storeText('selection')}</span><h2>${storeText('cart')} <small>(${cartCount()})</small></h2><div>${selection}</div><button class="button button-primary store-checkout" id="openQuote" ${items.length ? '' : 'disabled'}>${text.button}</button>${quoteForm()}</aside></div></section>`;
  routeLinks();
  root.querySelectorAll('[data-store-change]').forEach((button) => button.addEventListener('click', () => changeItem(button.dataset.id, Number(button.dataset.storeChange))));
  setupQuote();
}

async function notifyVisitFormspree() {
  if (!FORMSPREE_VISIT_FORM_ID) {
    return;
  }

  try {
    const formData = new FormData();
    formData.append('message', 'Has recibido una visita.');
    formData.append('_subject', 'Nueva visita en Psideralis');
    formData.append('source', 'page-visit');
    formData.append('page', window.location.pathname || '/');
    formData.append('referrer', document.referrer || 'direct');
    formData.append('timestamp', new Date().toISOString());

    const response = await fetch(`https://formspree.io/f/${encodeURIComponent(FORMSPREE_VISIT_FORM_ID)}`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData,
    });
    if (!response.ok) throw new Error(`Formspree returned ${response.status}`);
  } catch (error) {
    console.warn('Visit notification could not be sent to Formspree:', error);
  }
}

window.addEventListener('popstate', renderRoute);
window.addEventListener('hashchange', renderRoute);
setupLanding(); routeLinks(); setMiniCart(); renderRoute();
notifyVisitFormspree();
