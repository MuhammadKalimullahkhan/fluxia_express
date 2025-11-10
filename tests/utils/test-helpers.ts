import { Request, Response } from 'express';

/**
 * Creates a mock Express request object
 */
export function createMockRequest(overrides: Partial<Request> = {}): Partial<Request> {
  return {
    method: 'GET',
    url: '/',
    originalUrl: '/',
    headers: {},
    session: {} as any,
    ...overrides,
  };
}

/**
 * Creates a mock Express response object
 */
export function createMockResponse(): Partial<Response> {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    redirect: jest.fn().mockReturnThis(),
    writeHead: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
    header: jest.fn().mockReturnThis(),
    sendStatus: jest.fn().mockReturnThis(),
  };
  return res;
}

/**
 * Waits for async operations to complete
 */
export function waitFor(ms: number = 0): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Creates a test app with Inertia middleware
 */
export function createTestApp() {
  const express = require('express');
  const session = require('express-session');
  const { inertiaFlashMiddleware, inertiaExpressMiddleware } = require('../../src/lib');

  const app = express();
  
  app.use(session({ 
    secret: 'test-secret', 
    resave: false, 
    saveUninitialized: true 
  }));
  
  app.use(inertiaFlashMiddleware());
  
  app.use(
    inertiaExpressMiddleware({
      version: '1.0',
      html: (page: any) => `<!DOCTYPE html><html><body><div id="app" data-page='${JSON.stringify(page)}'></div></body></html>`,
      flashMessages: (req: any) => req.flash?.flashAll() || {},
    })
  );

  return app;
}

