import { Request, Response, NextFunction } from 'express';
import { createInertiaMiddleware } from '../../src/lib/inertia/inertia';
import { headers } from '../../src/lib/inertia/headers';

describe('Inertia Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      method: 'GET',
      url: '/test',
      originalUrl: '/test',
      headers: {},
      session: {} as any,
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      writeHead: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
      redirect: jest.fn().mockReturnThis(),
    };
    
    next = jest.fn();
  });

  describe('Version mismatch handling', () => {
    it('should return 409 when version does not match', () => {
      const middleware = createInertiaMiddleware({
        version: '1.0',
        html: () => '<html></html>',
      });

      req.headers![headers.xInertia] = 'true';
      req.headers![headers.xInertiaVersion] = '2.0';

      middleware(req as Request, res as Response, next);

      expect(res.writeHead).toHaveBeenCalledWith(409, expect.objectContaining({
        [headers.xInertiaLocation]: '/test',
      }));
      expect(res.end).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should proceed when version matches', () => {
      const middleware = createInertiaMiddleware({
        version: '1.0',
        html: () => '<html></html>',
      });

      req.headers![headers.xInertia] = 'true';
      req.headers![headers.xInertiaVersion] = '1.0';

      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('Inertia.render', () => {
    it('should render HTML when X-Inertia header is not present', async () => {
      const middleware = createInertiaMiddleware({
        version: '1.0',
        html: (page) => `<html><body>${page.component}</body></html>`,
      });

      middleware(req as Request, res as Response, next);

      expect(req.Inertia).toBeDefined();
      
      await req.Inertia!.render({
        component: 'test',
        props: { name: 'Test' },
        url: '/test',
        version: '1.0',
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.set).toHaveBeenCalledWith(
        expect.objectContaining({
          'Content-Type': 'text/html',
        })
      );
      expect(res.send).toHaveBeenCalledWith(expect.stringContaining('test'));
    });

    it('should render JSON when X-Inertia header is present', async () => {
      const middleware = createInertiaMiddleware({
        version: '1.0',
        html: () => '<html></html>',
      });

      req.headers![headers.xInertia] = 'true';
      req.headers![headers.xInertiaVersion] = '1.0';

      await new Promise<void>((resolve) => {
        middleware(req as Request, res as Response, () => {
          resolve();
        });
      });

      await req.Inertia!.render({
        component: 'test',
        props: { name: 'Test' },
        url: '/test',
        version: '1.0',
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.set).toHaveBeenCalledWith(
        expect.objectContaining({
          'Content-Type': 'application/json',
          [headers.xInertia]: 'true',
        })
      );
      
      const sendCall = (res.send as jest.Mock).mock.calls[0][0];
      const data = JSON.parse(sendCall);
      expect(data.component).toBe('test');
      expect(data.props.name).toBe('Test');
    });

    it('should include flash messages when provided', async () => {
      const middleware = createInertiaMiddleware({
        version: '1.0',
        html: () => '<html></html>',
        flashMessages: () => ({ success: ['Message'] }),
      });

      req.headers![headers.xInertia] = 'true';
      req.headers![headers.xInertiaVersion] = '1.0';

      await new Promise<void>((resolve) => {
        middleware(req as Request, res as Response, () => {
          resolve();
        });
      });

      await req.Inertia!.render({
        component: 'test',
        props: {},
        url: '/test',
        version: '1.0',
      });

      const sendCall = (res.send as jest.Mock).mock.calls[0][0];
      const data = JSON.parse(sendCall);
      expect(data.props.success).toEqual(['Message']);
    });

    it('should handle async props', async () => {
      const middleware = createInertiaMiddleware({
        version: '1.0',
        html: () => '<html></html>',
      });

      req.headers![headers.xInertia] = 'true';
      req.headers![headers.xInertiaVersion] = '1.0';

      await new Promise<void>((resolve) => {
        middleware(req as Request, res as Response, () => {
          resolve();
        });
      });

      await req.Inertia!.render({
        component: 'test',
        props: {
          sync: 'value',
          async: async () => 'async-value',
        },
        url: '/test',
        version: '1.0',
      });

      const sendCall = (res.send as jest.Mock).mock.calls[0][0];
      const data = JSON.parse(sendCall);
      expect(data.props.sync).toBe('value');
      expect(data.props.async).toBe('async-value');
    });
  });

  describe('Inertia.redirect', () => {
    it('should redirect with 302 for GET requests', () => {
      const middleware = createInertiaMiddleware({
        version: '1.0',
        html: () => '<html></html>',
      });

      req.method = 'GET';
      middleware(req as Request, res as Response, next);

      req.Inertia!.redirect('/new-url');

      expect(res.redirect).toHaveBeenCalledWith(302, '/new-url');
    });

    it('should redirect with 303 for PUT/PATCH/DELETE requests', () => {
      const middleware = createInertiaMiddleware({
        version: '1.0',
        html: () => '<html></html>',
      });

      req.method = 'PUT';
      middleware(req as Request, res as Response, next);

      req.Inertia!.redirect('/new-url');

      expect(res.redirect).toHaveBeenCalledWith(303, '/new-url');
    });
  });

  describe('Shared props', () => {
    it('should merge shared props with component props', async () => {
      const middleware = createInertiaMiddleware({
        version: '1.0',
        html: () => '<html></html>',
      });

      req.headers![headers.xInertia] = 'true';
      req.headers![headers.xInertiaVersion] = '1.0';

      await new Promise<void>((resolve) => {
        middleware(req as Request, res as Response, () => {
          resolve();
        });
      });

      req.Inertia!.shareProps({ shared: 'value' });
      
      await req.Inertia!.render({
        component: 'test',
        props: { local: 'value' },
        url: '/test',
        version: '1.0',
      });

      const sendCall = (res.send as jest.Mock).mock.calls[0][0];
      const data = JSON.parse(sendCall);
      expect(data.props.shared).toBe('value');
      expect(data.props.local).toBe('value');
    });
  });
});

