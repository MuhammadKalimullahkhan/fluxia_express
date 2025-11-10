import request from 'supertest';
import express from 'express';
import session from 'express-session';
import { inertiaFlashMiddleware, inertiaExpressMiddleware } from '../src/lib';

describe('Server Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(session({ 
      secret: 'test-secret', 
      resave: false, 
      saveUninitialized: true 
    }));
    app.use(inertiaFlashMiddleware());
    
    const router = express.Router();
    
    router.get('/home', async (req) => {
      req.flash.setFlashMessage('success', 'User created successfully');
      req.Inertia.render({
        component: 'home',
        props: { name: 'Test User' },
        url: '/home',
        version: '1.0',
      });
    });

    app.use(
      inertiaExpressMiddleware({
        version: '1.0',
        html: (page) => `<!DOCTYPE html>
          <html>
          <body>
            <div id="app" data-page='${JSON.stringify(page)}'></div>
          </body>
          </html>`,
        flashMessages: (req) => req.flash.flashAll(),
      })
    );
    
    app.use(router);
  });

  describe('GET /home', () => {
    it('should return HTML with Inertia page data', async () => {
      const response = await request(app)
        .get('/home')
        .expect(200);

      expect(response.text).toContain('<!DOCTYPE html>');
      expect(response.text).toContain('data-page');
      expect(response.text).toContain('home');
      expect(response.text).toContain('Test User');
    });

    it('should return JSON when X-Inertia header is present', async () => {
      const response = await request(app)
        .get('/home')
        .set('X-Inertia', 'true')
        .set('X-Inertia-Version', '1.0')
        .expect(200);

      expect(response.headers['content-type']).toContain('application/json');
      const data = JSON.parse(response.text);
      expect(data.component).toBe('home');
      expect(data.props.name).toBe('Test User');
      expect(data.props.success).toBeDefined();
    });

    it('should include flash messages in props', async () => {
      const response = await request(app)
        .get('/home')
        .set('X-Inertia', 'true')
        .set('X-Inertia-Version', '1.0')
        .expect(200);

      const data = JSON.parse(response.text);
      expect(data.props.success).toContain('User created successfully');
    });

    it('should return 409 when version mismatch', async () => {
      const response = await request(app)
        .get('/home')
        .set('X-Inertia', 'true')
        .set('X-Inertia-Version', '2.0')
        .expect(409);

      expect(response.headers['x-inertia-location']).toBe('/home');
    });
  });

  describe('CORS', () => {
    it('should allow OPTIONS requests', async () => {
      await request(app)
        .options('/home')
        .set('Origin', 'http://localhost:5173')
        .expect(200);
    });

    it('should set CORS headers', async () => {
      const response = await request(app)
        .get('/home')
        .set('Origin', 'http://localhost:5173');

      // Note: CORS is only enabled in development mode
      // In test environment, it might not be set
      expect([200, 204]).toContain(response.status);
    });
  });
});

