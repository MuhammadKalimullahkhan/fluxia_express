# Test Suite

This directory contains comprehensive tests for the Express + React + Inertia.js project.

## Test Structure

```
tests/
├── setup.ts                    # Jest setup and global mocks
├── server.test.ts              # Server route tests
├── components/                 # React component tests
│   └── Home.test.tsx
├── middleware/                 # Middleware tests
│   ├── inertia.test.ts
│   └── flash.test.ts
├── integration/                # Integration tests
│   └── app.test.ts
└── utils/                      # Test utilities
    └── test-helpers.ts
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:coverage
```

## Test Coverage

### Server Tests (`server.test.ts`)
- ✅ Route handling (GET /home)
- ✅ HTML response generation
- ✅ JSON response for Inertia requests
- ✅ Flash message inclusion
- ✅ Version mismatch handling
- ✅ CORS configuration

### Component Tests (`components/Home.test.tsx`)
- ✅ Component rendering
- ✅ Props handling
- ✅ Flash message display
- ✅ Interactive elements (buttons, state)
- ✅ User interactions

### Middleware Tests

#### Inertia Middleware (`middleware/inertia.test.ts`)
- ✅ Version mismatch detection
- ✅ HTML rendering
- ✅ JSON rendering for Inertia requests
- ✅ Flash message integration
- ✅ Async props handling
- ✅ Redirect functionality
- ✅ Shared props merging

#### Flash Middleware (`middleware/flash.test.ts`)
- ✅ Session requirement validation
- ✅ Flash object attachment
- ✅ Flash message types initialization
- ✅ Setting and getting flash messages
- ✅ Flash message arrays

### Integration Tests (`integration/app.test.ts`)
- ✅ Complete request flow (HTML → JSON)
- ✅ Session persistence
- ✅ Redirect handling
- ✅ Error handling
- ✅ Flash message persistence

## Writing New Tests

### Server Route Test Example
```typescript
import request from 'supertest';
import { createTestApp } from '../utils/test-helpers';

describe('My Route', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
    // Add your route
  });

  it('should handle request', async () => {
    const response = await request(app)
      .get('/my-route')
      .expect(200);
    
    expect(response.text).toContain('expected content');
  });
});
```

### Component Test Example
```typescript
import { render, screen } from '@testing-library/react';
import MyComponent from '../../src/client/Pages/MyComponent';

describe('MyComponent', () => {
  it('should render', () => {
    render(<MyComponent prop="value" />);
    expect(screen.getByText('expected text')).toBeInTheDocument();
  });
});
```

## Test Utilities

The `utils/test-helpers.ts` file provides helper functions:
- `createMockRequest()` - Creates mock Express request
- `createMockResponse()` - Creates mock Express response
- `createTestApp()` - Creates Express app with Inertia middleware
- `waitFor()` - Utility for async operations

## Notes

- Tests use `jsdom` environment for React component testing
- Server tests use `supertest` for HTTP testing
- All tests are isolated and don't affect each other
- Mock data is reset between tests

