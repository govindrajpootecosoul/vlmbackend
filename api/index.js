import { createApp } from '../src/app.js';

let app;

try {
  app = createApp();
} catch (err) {
  console.error('Failed to create app:', err);
  throw err;
}

export default app;
