# Psideralis Website

Sitio estático Webpack con navegación CSR. La tienda en `#/tienda` recoge solicitudes de cotización; no procesa pagos, códigos de aprobación ni datos de tarjeta.

## Formspree

Configura tres formularios en Formspree y establece `psideralis@gmail.com` como destinatario en el panel de Formspree. Copia [`.env.example`](.env.example) como `.env` para desarrollo local e introduce los identificadores reales:

```text
FORMSPREE_FORM_ID=identificador_del_formulario_de_contacto
FORMSPREE_QUOTE_FORM_ID=identificador_del_formulario_de_cotizacion
FORMSPREE_VISIT_FORM_ID=identificador_del_formulario_de_visitas
```

- Contacto: recibe el mensaje del formulario principal.
- Cotización: incluye los campos `services` y `products` con nombre, identificador y cantidad.
- Visitas: registra una notificación de visita por carga de página.

Los identificadores de Formspree son públicos al estar incluidos en el bundle; no añadas secretos a estas variables.

Para GitHub Pages, crea las mismas tres variables en **Settings → Environments → github-pages → Environment variables**. El workflow las inyecta al compilar y publica `public/` al hacer `push` a `main`.

## Desarrollo local

```bash
npm ci
npm run build
npm start
```

El servidor Node solo entrega el sitio estático. Los envíos van directamente y por HTTPS a Formspree.
