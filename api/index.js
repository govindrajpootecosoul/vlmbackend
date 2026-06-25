import serverless from 'serverless-http';

let handler;

async function getHandler() {
  if (!handler) {
    const { createApp } = await import('../src/app.js');
    const app = createApp();
    handler = serverless(app, {
      binary: ['image/*', 'video/*', 'audio/*', 'application/pdf'],
    });
  }
  return handler;
}

export default async function vercelHandler(req, res) {
  try {
    const fn = await getHandler();
    return fn(req, res);
  } catch (error) {
    console.error('Vercel cold start error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'VLM Academy Backend failed to start',
        error: error.message,
      });
    }
  }
}
