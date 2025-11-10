import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

// Get the initial page data from the server
const pageElement = document.getElementById('app');
if (!pageElement) {
  throw new Error('Missing #app element');
}

const pageData = pageElement.getAttribute('data-page');
if (!pageData) {
  throw new Error('Missing data-page attribute');
}

const initialPage = JSON.parse(pageData);

// Component resolver - using lazy loading for HMR support
async function resolveComponent(name: string) {
  // Use lazy loading (not eager) for HMR to work properly
  const pages = import.meta.glob('./Pages/**/*.tsx');
  
  // Convert component name to PascalCase file name
  const componentName = name.charAt(0).toUpperCase() + name.slice(1);
  const componentPath = `./Pages/${componentName}.tsx`;
  
  // Try exact match first
  if (pages[componentPath]) {
    const module = await pages[componentPath]() as { default: React.ComponentType<any> };
    return module.default;
  }
  
  // Try with original name
  const altPath = `./Pages/${name}.tsx`;
  if (pages[altPath]) {
    const module = await pages[altPath]() as { default: React.ComponentType<any> };
    return module.default;
  }
  
  // Search for any matching file
  for (const [path, loader] of Object.entries(pages)) {
    if (path.toLowerCase().includes(name.toLowerCase())) {
      const module = await loader() as { default: React.ComponentType<any> };
      return module.default;
    }
  }
  
  throw new Error(`Component ${name} not found. Tried: ${componentPath}, ${altPath}`);
}

// Create root once and reuse it for HMR
let root: ReturnType<typeof createRoot> | null = null;

createInertiaApp({
  resolve: resolveComponent,
  setup({ el, App, props }) {
    // Reuse root if it exists (for HMR)
    if (!root) {
      root = createRoot(el);
    }
    root.render(<App {...props} />);
  },
  page: initialPage,
  // Enable progress indicator for better UX during updates
  progress: {
    delay: 250,
    color: '#4B5563',
    includeCSS: true,
    showSpinner: true,
  },
});

