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

El archivo `.env` se versiona porque contiene únicamente IDs públicos de Formspree. GitHub Actions lo obtiene con el repositorio, Webpack lo importa durante el build y publica `public/` al hacer `push` a `main`. No añadas claves privadas, tokens ni contraseñas a este archivo. En **Settings → Pages**, selecciona **GitHub Actions** como fuente de publicación.

## Desarrollo local

```bash
npm ci
npm run dev       # Webpack en modo desarrollo + node server.js
```

Para generar el mismo artefacto estático que usa GitHub Pages:

```bash
npm run build
npm start
```

`node server.js` solo entrega el sitio estático en desarrollo o en un hosting Node; GitHub Pages no ejecuta procesos Node. El directorio `public/` se conserva en el repositorio como artefacto publicado. Los envíos van directamente y por HTTPS a Formspree.
