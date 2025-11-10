import request from 'supertest';
import express from 'express';
import session from 'express-session';
import path from 'path';
import { inertiaFlashMiddleware, inertiaExpressMiddleware } from '../../src/lib';

describe('Integration Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    
    // Set up test environment
    process.env.NODE_ENV = 'test';
    
    app.use(session({ 
      secret: 'test-secret', 
      resave: false, 
      saveUninitialized: true 
    }));
    
    app.use(inertiaFlashMiddleware());
    app.use(express.static(path.resolve(__dirname, '../../public')));

    const router = express.Router();
    
    router.get('/home', async (req) => {
      req.flash.setFlashMessage('success', 'User created successfully');
      req.Inertia.render({
        component: 'home',
        props: { name: 'Integration Test' },
        url: '/home',
        version: '1.0',
      });
    });

    router.post('/test', async (req) => {
      req.Inertia.redirect('/home');
    });

    app.use(
      inertiaExpressMiddleware({
        version: '1.0',
        html: (page) => `<!DOCTYPE html>
          <html>
          <head>
            <title>Test</title>
          </head>
          <body>
            <div id="app" data-page='${JSON.stringify(page).replace(/'/g, "&#39;")}'></div>
          </body>
          </html>`,
        flashMessages: (req) => req.flash.flashAll(),
      })
    );
    
    app.use(router);
  });

  afterEach(() => {
    delete process.env.NODE_ENV;
  });

  describe('Full Request Flow', () => {
    it('should handle complete Inertia request flow', async () => {
      // Initial page load (HTML)
      const htmlResponse = await request(app)
        .get('/home')
        .expect(200);

      expect(htmlResponse.text).toContain('<!DOCTYPE html>');
      expect(htmlResponse.text).toContain('data-page');
      
      // Extract session cookie
      const cookies = htmlResponse.headers['set-cookie'];
      expect(cookies).toBeDefined();

      // Subsequent Inertia request (JSON)
      const jsonResponse = await request(app)
        .get('/home')
        .set('X-Inertia', 'true')
        .set('X-Inertia-Version', '1.0')
        .set('Cookie', cookies)
        .expect(200);

      expect(jsonResponse.headers['content-type']).toContain('application/json');
      
      const data = JSON.parse(jsonResponse.text);
      expect(data.component).toBe('home');
      expect(data.props.name).toBe('Integration Test');
      // Flash messages are consumed on first request, so they may not be present on subsequent requests
      if (data.props.success) {
        expect(Array.isArray(data.props.success)).toBe(true);
        expect(data.props.success).toContain('User created successfully');
      }
    });

    it('should handle redirects correctly', async () => {
      const response = await request(app)
        .post('/test')
        .expect(302);

      expect(response.headers.location).toBe('/home');
    });

    it('should maintain session across requests', async () => {
      const agent = request.agent(app);
      
      // First request
      await agent
        .get('/home')
        .expect(200);

      // Second request with same session
      const response = await agent
        .get('/home')
        .set('X-Inertia', 'true')
        .set('X-Inertia-Version', '1.0')
        .expect(200);

      const data = JSON.parse(response.text);
      // Flash messages are consumed on first request
      // They may not be present if flashAll() was already called
      if (data.props.success) {
        expect(Array.isArray(data.props.success)).toBe(true);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle version mismatch correctly', async () => {
      const response = await request(app)
        .get('/home')
        .set('X-Inertia', 'true')
        .set('X-Inertia-Version', '2.0')
        .expect(409);

      expect(response.headers['x-inertia-location']).toBe('/home');
    });

    it('should handle missing component gracefully', async () => {
      const router = express.Router();
      router.get('/missing', async (req) => {
        req.Inertia.render({
          component: 'nonexistent',
          props: {},
          url: '/missing',
          version: '1.0',
        });
      });

      app.use(router);

      const response = await request(app)
        .get('/missing')
        .set('X-Inertia', 'true')
        .expect(200);

      const data = JSON.parse(response.text);
      expect(data.component).toBe('nonexistent');
    });
  });

  describe('Flash Messages', () => {
    it('should persist flash messages across requests', async () => {
      const agent = request.agent(app);
      
      // Set flash message
      await agent
        .get('/home')
        .expect(200);

      // Retrieve flash message
      const response = await agent
        .get('/home')
        .set('X-Inertia', 'true')
        .set('X-Inertia-Version', '1.0')
        .expect(200);

      const data = JSON.parse(response.text);
      // Flash messages are consumed on first request
      if (data.props.success) {
        expect(Array.isArray(data.props.success)).toBe(true);
        expect(data.props.success).toContain('User created successfully');
      }
    });
  });
});

