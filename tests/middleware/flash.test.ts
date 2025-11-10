import { Request, Response, NextFunction } from 'express';
import { inertiaFlashMiddleware } from '../../src/lib/flash/flashMiddleware';

describe('Flash Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      session: {
        flashMessages: {},
      } as any,
    };
    
    res = {};
    next = jest.fn();
  });

  it('should throw error if session is not available', async () => {
    const middleware = inertiaFlashMiddleware();
    req.session = undefined;

    await expect(async () => {
      await middleware(req as Request, res as Response, next);
    }).rejects.toThrow('Express flash requires a session middleware to be added before');
  });

  it('should attach flash object to request', () => {
    const middleware = inertiaFlashMiddleware();
    middleware(req as Request, res as Response, next);

    expect(req.flash).toBeDefined();
    expect(req.flash.setFlashMessage).toBeDefined();
    expect(req.flash.flashAll).toBeDefined();
  });

  it('should initialize flash message types', () => {
    const middleware = inertiaFlashMiddleware({
      initialize: ['success', 'error'],
    });
    
    middleware(req as Request, res as Response, next);

    expect(req.session!.flashMessages).toBeDefined();
    expect(req.session!.flashMessages!['success']).toEqual([]);
    expect(req.session!.flashMessages!['error']).toEqual([]);
  });

  it('should call next middleware', () => {
    const middleware = inertiaFlashMiddleware();
    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  describe('Flash methods', () => {
    beforeEach(() => {
      const middleware = inertiaFlashMiddleware();
      middleware(req as Request, res as Response, next);
    });

    it('should set flash message', () => {
      const index = req.flash!.setFlashMessage('success', 'Test message');
      
      expect(index).toBe(1);
      expect(req.session!.flashMessages!['success']).toContain('Test message');
    });

    it('should set multiple flash messages', () => {
      req.flash!.setFlashMessage('success', 'Message 1');
      req.flash!.setFlashMessage('success', 'Message 2');
      
      expect(req.session!.flashMessages!['success']).toHaveLength(2);
      expect(req.session!.flashMessages!['success']).toContain('Message 1');
      expect(req.session!.flashMessages!['success']).toContain('Message 2');
    });

    it('should get flash messages', () => {
      req.flash!.setFlashMessage('success', 'Test message');
      
      const messages = req.flash!.flash('success');
      expect(messages).toContain('Test message');
    });

    it('should get all flash messages', () => {
      req.flash!.setFlashMessage('success', 'Success message');
      req.flash!.setFlashMessage('error', 'Error message');
      
      const all = req.flash!.flashAll();
      expect(all.success).toContain('Success message');
      expect(all.error).toContain('Error message');
    });

    it('should set flash messages array', () => {
      const index = req.flash!.setFlashMessages('success', ['Message 1', 'Message 2']);
      
      expect(index).toBe(2);
      expect(req.session!.flashMessages!['success']).toHaveLength(2);
    });
  });
});

