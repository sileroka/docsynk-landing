import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { config } from 'dotenv';
import { handleContactSubmission } from './api/contact.handler';

// Load environment variables from .env file
config();

// Log SendGrid configuration status (without exposing sensitive data)
console.log('=== SendGrid Configuration ===');
console.log('API Key:', process.env['SENDGRID_API_KEY'] ? '✓ SET' : '✗ NOT SET');
console.log('From Email:', process.env['SENDGRID_FROM_EMAIL'] || '✗ NOT SET');
console.log('To Email:', process.env['SENDGRID_TO_EMAIL'] || '✗ NOT SET');
console.log('Environment:', process.env['NODE_ENV'] || 'development');
console.log('==============================\n');

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * API endpoints
 */

// Contact form endpoint
app.post('/api/contact', handleContactSubmission);

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
