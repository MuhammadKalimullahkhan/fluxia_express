# React Frontend Setup Guide

## Project Structure

The React frontend code is located in the `src/client/` directory:

```
src/
├── client/              # React frontend code
│   ├── app.tsx         # Main Inertia.js entry point
│   ├── Pages/          # React page components
│   │   └── Home.tsx    # Example Home component
│   └── tsconfig.json   # TypeScript config for client
├── lib/                # Server-side Inertia.js library
└── server.ts           # Express server
```

## Where to Place React Components

**All React page components should be placed in `src/client/Pages/`**

- Each component file should be named to match the component name used in your server routes
- Example: If your server renders `component: "home"`, create `src/client/Pages/Home.tsx`
- The component resolver automatically maps `"home"` → `./Pages/Home.tsx`

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode (with hot reload)

Run both the Vite dev server (for React) and the Express server:
```bash
npm run dev
```

This will:
- Start Vite dev server on `http://localhost:5173` (for React HMR)
- Start Express server on `http://localhost:3000`

### Development Mode (separate terminals)

If you prefer to run them separately:

Terminal 1 (React/Vite):
```bash
npm run dev:client
```

Terminal 2 (Express server):
```bash
npm run dev:server
```

### Production Build

Build the React frontend:
```bash
npm run build:client
```

Build everything (client + server):
```bash
npm run build
```

## How It Works

1. **Server-side (Express)**: 
   - Routes in `src/server.ts` render Inertia pages
   - The HTML template includes a `<div id="app">` with page data
   - The template loads the React bundle from `/build/app.js`

2. **Client-side (React)**:
   - `src/client/app.tsx` initializes Inertia.js
   - It reads the page data from the `#app` element
   - It resolves and renders the appropriate React component from `src/client/Pages/`

3. **Component Resolution**:
   - When server renders `component: "home"`, Inertia looks for `src/client/Pages/Home.tsx`
   - The component must export a default React component

## Adding New Pages

1. Create a new component in `src/client/Pages/`:
   ```tsx
   // src/client/Pages/About.tsx
   import React from 'react';
   import { Head } from '@inertiajs/react';
   
   export default function About() {
     return (
       <>
         <Head title="About" />
         <h1>About Page</h1>
       </>
     );
   }
   ```

2. Add a route in `src/server.ts`:
   ```typescript
   router.get("/about", async (req) => {
     req.Inertia.render({
       component: "about",  // Matches About.tsx
       props: {},
       url: "/about",
       version: "1.0",
     });
   });
   ```

## Important Notes

- The component name in `req.Inertia.render()` must match the file name (case-sensitive)
- All page components must be in `src/client/Pages/`
- Components must export a default React component
- Use `@inertiajs/react` for Inertia-specific features like `<Head>`, `usePage()`, etc.

