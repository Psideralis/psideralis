const crypto = require('crypto');
const express = require('express');
const path = require('path');
try {
  process.loadEnvFile(path.join(__dirname, '.env'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const app = express();
const PORT = process.env.PORT || 3001;
const currency = 'USD';

// This server-side catalog is the sole source of truth for prices; the browser never sends an amount.
const catalog = [
  { id: 'web-design', name: 'Diseño de página web', category: 'WEB', description: 'Dirección visual, estructura y prototipo de una página clara y memorable.', price: 1000, unit: 'proyecto', maxQuantity: 5, icon: '✦' },
  { id: 'web-development', name: 'Programación web', category: 'WEB', description: 'Construcción de una página web rápida, accesible y lista para crecer.', price: 2500, unit: 'proyecto', maxQuantity: 5, icon: '</>' },
  { id: 'web-launch', name: 'Implementación web', category: 'WEB', description: 'Publicación, dominio, configuración técnica y salida a producción.', price: 2000, unit: 'lanzamiento', maxQuantity: 5, icon: '↗' },
  { id: 'web-care', name: 'Administración web', category: 'CONTINUIDAD', description: 'Mantenimiento, actualizaciones y cuidado mensual de tu sitio.', price: 1000, unit: 'mes', maxQuantity: 12, icon: '◌' },
  { id: 'cross-platform', name: 'App multiplataforma', category: 'APLICACIONES', description: 'Base de desarrollo para escritorio y móvil desde un mismo producto.', price: 5000, unit: 'módulo', maxQuantity: 10, icon: '▣' },
  { id: 'licenses-distribution', name: 'Licencias y distribución', category: 'APLICACIONES', description: 'Gestión de licencias y preparación para distribuir tu aplicación de escritorio.', price: 2500, unit: 'proyecto', maxQuantity: 5, icon: '⌘' },
  { id: 'data-analysis', name: 'Análisis de datos', category: 'DATOS', description: 'Lectura, limpieza y visualización para convertir datos en decisiones.', price: 2500, unit: 'paquete', maxQuantity: 10, icon: '⌁' },
  { id: 'technical-support', name: 'Soporte técnico', category: 'SOPORTE', description: 'Bolsa de horas para resolver incidencias, ajustes y consultas técnicas.', price: 2000, unit: 'hora', maxQuantity: 40, icon: '?' }
];
app.use(express.json({ limit: '16kb' }));
app.use((error, _req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) return res.status(400).json({ error: 'El cuerpo de la solicitud no es válido.' });
  return next(error);
});
app.use(express.static(path.join(__dirname, 'public')));
app.get('/api/catalog', (_req, res) => res.json(catalog));
// The Formspree form ID identifies a public submission endpoint; it is not an API key.
function formspreeId(input) {
  const value = (input || '').trim();
  const urlMatch = value.match(/^https:\/\/formspree\.io\/f\/([a-zA-Z0-9]+)\/?$/);
  const formId = urlMatch ? urlMatch[1] : value;
  return /^[a-zA-Z0-9]+$/.test(formId) ? formId : null;
}
app.get('/api/contact-config', (_req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ formId: formspreeId(process.env.FORMSPREE_FORM_ID), quoteFormId: formspreeId(process.env.FORMSPREE_QUOTE_FORM_ID || process.env.FORMSPREE_FORM_ID) });
});

function normalizeCart(items) {
  if (!Array.isArray(items) || items.length < 1 || items.length > catalog.length) throw new Error('El carrito no es válido.');
  const seen = new Set();
  const lineItems = items.map(({ id, quantity }) => {
    if (typeof id !== 'string' || seen.has(id)) throw new Error('El carrito contiene artículos duplicados o no válidos.');
    seen.add(id);
    const product = catalog.find((service) => service.id === id);
    const qty = Number(quantity);
    if (!product || !Number.isSafeInteger(qty) || qty < 1 || qty > product.maxQuantity) throw new Error('Una de las cantidades no es válida.');
    return { id: product.id, name: product.name, quantity: qty, unitAmount: product.price, lineTotal: product.price * qty };
  });
  const total = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
  if (!Number.isSafeInteger(total) || total <= 0) throw new Error('No se pudo calcular el total.');
  return { lineItems, total };
}
// Approved codes are configured privately by Psideralis and tied to an exact cart.
function approvedQuote(code, cart) {
  let codes;
  try { codes = JSON.parse(process.env.QUOTE_CODES || '{}'); } catch { throw new Error('Los códigos de cotización no están configurados correctamente.'); }
  const quote = typeof code === 'string' && code.length <= 100 && Object.hasOwn(codes, code.trim()) ? codes[code.trim()] : null;
  if (!quote || !Array.isArray(quote.items)) throw new Error('El código de cotización no es válido.');
  const expected = normalizeCart(quote.items);
  const signature = (items) => JSON.stringify(items.map(({ id, quantity }) => ({ id, quantity })).sort((a, b) => a.id.localeCompare(b.id)));
  if (cart && signature(expected.lineItems) !== signature(cart.lineItems)) throw new Error('El código de cotización no corresponde a los servicios seleccionados.');
  return expected;
}
app.post('/api/quotes/validate', (req, res) => {
  try { const cart = approvedQuote(req.body?.code); res.json({ total: cart.total, items: cart.lineItems.map(({ id, quantity }) => ({ id, quantity })) }); }
  catch (error) { res.status(400).json({ error: error.message }); }
});
function configured(name) { return Boolean(process.env[name]); }

app.post('/api/checkout', async (req, res) => {
  try {
    const { provider, items, code } = req.body || {};
    if (provider !== 'bitcoin') throw new Error('El método de pago disponible es Bitcoin con Proton Wallet.');
    const cart = approvedQuote(code, normalizeCart(items));
    const address = (process.env.PROTON_WALLET_ADDRESS || '').trim();
    if (!address) throw new Error('La dirección de Bitcoin aún no está configurada.');
    return res.json({ address, total: cart.total });
  } catch (error) { res.status(400).json({ error: error.message || 'No fue posible iniciar el pago.' }); }
});
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.listen(PORT, () => console.log(`Psideralis storefront running at http://localhost:${PORT}`));
