# Inertia.js + Node.js + Express + React

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-5.1-green.svg)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A full-stack implementation of [Inertia.js](https://inertiajs.com) for Node.js using Express and React. Build modern single-page applications with classic server-side routing and controllers, without the complexity of building an API.

> **Note:** This project is based on [henriquealbert/inertiajs-node-express](https://github.com/henriquealbert/inertiajs-node-express) with significant enhancements including React support, hot module replacement, testing suite, and improved developer experience.

## ✨ Features

- 🚀 **Full Inertia.js Support** - Complete implementation of Inertia.js protocol for Node.js/Express
- ⚛️ **React Integration** - Built-in React support with component-based architecture
- 🔥 **Hot Module Replacement (HMR)** - Instant updates during development with Vite
- 💬 **Flash Messages** - Built-in flash message system for user notifications
- 🔄 **Live Updates** - Automatic page reloads when server props change
- 📦 **TypeScript** - Full TypeScript support for type safety
- 🧪 **Testing Suite** - Comprehensive test coverage with Jest and React Testing Library
- ⚙️ **Environment Configuration** - Easy configuration via `.env` files
- 🎨 **Modern Tooling** - Vite for fast builds and development experience

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **bun** (package manager)
- **Git** (for cloning the repository)

## 🚀 Quick Start

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd inertiajs-node-express
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update the configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   SESSION_SECRET=your-secret-key-change-this-in-production
   VITE_PORT=5173
   VITE_HOST=localhost
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000/home` to see the application in action.

## 📁 Project Structure

```
inertiajs-node-express/
├── src/
│   ├── client/              # React frontend
│   │   ├── app.tsx         # Inertia.js entry point
│   │   ├── Pages/          # React page components
│   │   │   └── Home.tsx    # Example component
│   │   └── tsconfig.json   # TypeScript config
│   ├── lib/                # Inertia.js library
│   │   ├── flash/          # Flash message system
│   │   ├── inertia/        # Core Inertia middleware
│   │   └── types/          # TypeScript definitions
│   └── server.ts           # Express server entry point
├── tests/                  # Test suite
│   ├── components/         # React component tests
│   ├── integration/        # Integration tests
│   ├── middleware/         # Middleware tests
│   └── utils/              # Test utilities
├── public/                 # Static assets
│   └── build/              # Production builds
├── .env                    # Environment variables (gitignored)
├── .env.example            # Environment template
├── vite.config.ts          # Vite configuration
├── jest.config.js          # Jest configuration
└── package.json            # Project dependencies
```

## 🛠️ Usage

### Creating a Route

Define routes in `src/server.ts`:

```typescript
router.get("/home", async (req) => {
  // Set flash messages
  req.flash.setFlashMessage("success", "User created successfully");

  // Render Inertia component
  req.Inertia.render({
    component: "home",
    props: { name: "John Doe" },
    url: "/home",
    version: appVersion,
  });
});
```

### Creating a React Component

Create components in `src/client/Pages/`:

```typescript
// src/client/Pages/Home.tsx
import React from 'react';
import { Head } from '@inertiajs/react';

interface Props {
  name: string;
  success?: string[];
}

export default function Home({ name, success }: Props) {
  return (
    <>
      <Head title="Home" />
      <div>
        <h1>Welcome, {name}!</h1>
        {success && success.length > 0 && (
          <div className="alert alert-success">
            {success[0]}
          </div>
        )}
      </div>
    </>
  );
}
```

### Flash Messages

Flash messages are automatically included in component props:

```typescript
// Set flash message
req.flash.setFlashMessage("success", "Operation successful");
req.flash.setFlashMessage("error", "Something went wrong");

// Access in component
const { success, error } = usePage().props;
```

### Redirects

Use Inertia's redirect method:

```typescript
router.post("/users", async (req) => {
  // Create user logic...
  req.Inertia.redirect("/home");
});
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test
# or
bun test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Structure

- **Unit Tests** - Test individual components and functions
- **Integration Tests** - Test full request/response cycles
- **Component Tests** - Test React components with React Testing Library

See [tests/README.md](tests/README.md) for detailed testing documentation.

## 🏗️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start both Vite and Express servers
npm run dev:server       # Start only Express server
npm run dev:client       # Start only Vite dev server

# Building
npm run build            # Build both client and server
npm run build:client     # Build only React client

# Production
npm start                # Start production server

# Testing
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

### Development Workflow

1. **Start development servers**
   ```bash
   npm run dev
   ```
   This starts both the Express server (port 3000) and Vite dev server (port 5173).

2. **Make changes**
   - React components: Edit files in `src/client/Pages/` - changes appear instantly
   - Server routes: Edit `src/server.ts` - server restarts automatically

3. **Hot Module Replacement**
   - React changes: Instant updates without page reload
   - Server changes: Automatic page reload with new props

## 🔧 Configuration

### Environment Variables

Configure your application using the `.env` file:

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Express server port | `3000` |
| `HOST` | Server hostname | `localhost` |
| `SESSION_SECRET` | Session encryption secret | `secret` |
| `VITE_PORT` | Vite dev server port | `5173` |
| `VITE_HOST` | Vite dev server host | `localhost` |

**⚠️ Security Note:** Always change `SESSION_SECRET` in production. Generate a secure secret:

```bash
openssl rand -base64 32
```

## 📚 Documentation

- [Setup Guide](SETUP.md) - Detailed setup and configuration instructions
- [Test Documentation](tests/README.md) - Testing guide and examples
- [Inertia.js Documentation](https://inertiajs.com) - Official Inertia.js docs

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests** for new functionality
5. **Ensure all tests pass**
   ```bash
   npm test
   ```
6. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
7. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
8. **Open a Pull Request**

### Code Style

- Use TypeScript for all new code
- Follow existing code style and patterns
- Write tests for new features
- Update documentation as needed

## 📝 Roadmap

- [x] React.js support
- [x] Hot Module Replacement (HMR)
- [x] Comprehensive test suite
- [x] Environment variable configuration
- [x] Flash message system
- [x] Template engine support (EJS)
- [ ] Vue.js support
- [ ] Svelte support
- [ ] Additional examples and documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Original Implementation** - Based on [henriquealbert/inertiajs-node-express](https://github.com/henriquealbert/inertiajs-node-express)
- **Inertia.js** - Created by [Jonathan Reinink](https://github.com/reinink) and the Inertia.js community
- **Express.js** - Fast, unopinionated web framework for Node.js
- **React** - A JavaScript library for building user interfaces
- **Vite** - Next generation frontend tooling

## 📞 Support

- **Issues** - [GitHub Issues](https://github.com/your-username/inertiajs-node-express/issues)
- **Discussions** - [GitHub Discussions](https://github.com/your-username/inertiajs-node-express/discussions)

## ⭐ Show Your Support

If you find this project helpful, please consider giving it a star on GitHub!

---

