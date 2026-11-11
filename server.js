const express = require('express');
const path = require('path');

const app = express();
const configuredPort = process.env.PORT ? Number(process.env.PORT) : null;
const localPortCandidates = configuredPort ? [configuredPort] : [3001, 3002, 3003, 3004];

// Forms are sent directly to Formspree from the static app. This server only
// serves the SPA for local development and compatible hosts.
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

function startServer(index = 0) {
  const port = localPortCandidates[index];
  const server = app.listen(port, () => {
    console.log(`Psideralis website running at http://localhost:${port}`);
  });

  server.once('error', (error) => {
    if (['EADDRINUSE', 'EACCES'].includes(error.code) && !configuredPort && index + 1 < localPortCandidates.length) {
      console.warn(`Port ${port} is unavailable; trying port ${localPortCandidates[index + 1]}.`);
      startServer(index + 1);
      return;
    }
    console.error(`Unable to start Psideralis website on port ${port}.`, error);
    process.exitCode = 1;
  });
}

startServer();
