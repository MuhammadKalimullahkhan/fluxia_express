import express from "express";
import session from "express-session";
import path from "path";
import { inertiaFlashMiddleware, inertiaExpressMiddleware } from "./lib";

// Load environment variables from .env file
// Bun has built-in .env support, but we'll use dotenv for compatibility
import dotenv from "dotenv";
dotenv.config();

const app = express();

const isDevelopment = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || "secret";
const VITE_PORT = process.env.VITE_PORT || 5173;
const VITE_HOST = process.env.VITE_HOST || "localhost";

// Dynamic version that changes on server restart (for prop updates)
// In development, use timestamp to force updates when server restarts
const appVersion = isDevelopment 
  ? `dev-${Date.now()}` 
  : "1.0";

// Enable CORS for development (allow both Express and Vite origins)
if (isDevelopment) {
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    // Allow requests from Vite dev server or Express server
    const viteOrigin = `http://${VITE_HOST}:${VITE_PORT}`;
    const serverOrigin = `http://${process.env.HOST || "localhost"}:${PORT}`;
    if (origin === viteOrigin || origin === serverOrigin || !origin) {
      res.header("Access-Control-Allow-Origin", origin || "*");
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      res.header("Access-Control-Allow-Headers", "Content-Type, X-Inertia, X-Inertia-Version, X-Requested-With");
      res.header("Access-Control-Allow-Credentials", "true");
    }
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });
}

// Serve static files from public directory (for production build)
app.use(express.static(path.resolve(__dirname, "../public")));

// Configuring Express session.
// In this example, we are using the express-session session middleware.
// The secret is used to sign the session ID. This can be any string value.
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: true }));

// Initializing the Flash middleware.
app.use(inertiaFlashMiddleware());

const router = express.Router();

// Defining a GET route for '/home'.
// This route will respond with a JSON object when accessed with a GET method.
router.get("/home", async (req) => {
  // If the flash middleware was added, you can set a flash message.
  // Here we are setting a success flash message.
  req.flash.setFlashMessage("success", "User created successfully");

  // Using the Inertia middleware to render an Inertia component.
  // The object passed to the render method includes the component name, props, URL, and version.
  req.Inertia.render({
    component: "home",
    props: { name: "Kalimullah" },
    url: "/home",
    version: appVersion,
  });
});

// Using the Inertia middleware.
// An object of configuration is passed to the middleware.
// This object includes the version, a method to generate the HTML, and a method to retrieve all flash messages.
app.use(
  inertiaExpressMiddleware({
    version: appVersion,
    html: (page) => {
      // In development, load from Vite dev server
      // In production, load from built files
      const viteUrl = `http://${VITE_HOST}:${VITE_PORT}`;
      const scriptSrc = isDevelopment 
        ? `${viteUrl}/src/client/app.tsx` 
        : "/build/app.js";
      
      // Vite client for HMR (required for hot module replacement)
      const viteClientScript = isDevelopment
        ? `<script type="module" src="${viteUrl}/@vite/client"></script>`
        : '';
      
      // React Refresh runtime for development (required for HMR)
      const reactRefreshScript = isDevelopment
        ? `<script type="module">
  import RefreshRuntime from '${viteUrl}/@react-refresh';
  RefreshRuntime.injectIntoGlobalHook(window);
  window.$RefreshReg$ = () => {};
  window.$RefreshSig$ = () => (type) => type;
  window.__vite_plugin_react_preamble_installed__ = true;
</script>`
        : '';
      
      return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Inertia.js + React + Express</title>
        ${viteClientScript}
        ${reactRefreshScript}
        <script type="module" src="${scriptSrc}"></script>
      </head>
      <body>
        <div id="app" data-page='${JSON.stringify(page).replace(/'/g, "&#39;")}'></div>
      </body>
      </html>`;
    },
    flashMessages: (req) => req.flash.flashAll(),
  })
);

// Using the Express router.
// This should be done after all middlewares have been defined.
app.use(router);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://${process.env.HOST || "localhost"}:${PORT}`);
  if (isDevelopment) {
    console.log(`Vite dev server should be running at http://${VITE_HOST}:${VITE_PORT}`);
  }
});
