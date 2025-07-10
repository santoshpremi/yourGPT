# DeinGPT - AI Productivity Platform

A modern AI-powered productivity platform similar to DeinGPT, built with React, TypeScript, and Node.js.

## 🚀 Features

- **Multi-Model AI Chat** - Support for GPT-4o, Claude, Gemini, and Perplexity
- **AI Tools Suite** - Image generation, research assistant, meeting tools, tech support, and translation
- **Workflow Automation** - Create custom multi-step AI workflows
- **Learning Platform** - Built-in academy with gamification
- **Organization Management** - Team collaboration and role-based access
- **Modern UI** - Beautiful, responsive design with Tailwind CSS

## 📁 Project Structure

```
DeinGPT/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   └── ...
│   ├── package.json
│   └── vite.config.ts
├── backend/            # Node.js backend with tRPC
│   ├── src/
│   │   ├── trpc/
│   │   └── server.ts
│   └── package.json
├── shared/             # Shared types and utilities
│   ├── apiTypes/
│   └── package.json
└── package.json        # Root package.json
```

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd DeinGPT
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

## 🏃‍♂️ Running the Application

### Development Mode

Start both frontend and backend simultaneously:

```bash
pnpm run dev
```

This will start:

- Frontend at `http://localhost:5173`
- Backend at `http://localhost:3001`

### Individual Services

Run frontend only:

```bash
pnpm run dev:frontend
```

Run backend only:

```bash
pnpm run dev:backend
```

## 🔧 Technology Stack

### Frontend

- **React 18** - User interface library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **tRPC** - End-to-end typesafe APIs
- **React Router** - Client-side routing
- **Tanstack Query** - Server state management

### Backend

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **tRPC** - Type-safe API layer
- **TypeScript** - Type-safe JavaScript
- **Zod** - Schema validation

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Concurrently** - Run multiple commands

## 🎯 API Endpoints

The backend provides a tRPC API with the following main routes:

- `user.*` - User management
- `organization.*` - Organization data
- `chat.*` - Chat functionality
- `workflow.*` - Workflow management
- `tools.*` - AI tools configuration
- `modelConfig.*` - AI model configuration
- `productConfig.*` - Product features
- `academy.*` - Learning platform

## 🧪 Mock Data

The current implementation uses mock data for development. All API endpoints return realistic mock responses to demonstrate the platform's capabilities.

## 🔮 Future Enhancements

- Connect to real AI APIs (OpenAI, Anthropic, etc.)
- Add user authentication
- Implement real database
- Add file upload capabilities
- Implement real-time chat
- Add advanced workflow builder
- Implement payment system

## 📝 Available Scripts

```bash
# Development
pnpm run dev              # Start both frontend and backend
pnpm run dev:frontend     # Start frontend only
pnpm run dev:backend      # Start backend only

# Building
pnpm run build           # Build both frontend and backend
pnpm run build:frontend  # Build frontend only
pnpm run build:backend   # Build backend only

# Production
pnpm start              # Start backend in production mode

# Setup
pnpm install           # Install all dependencies
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Related Links

- [DeinGPT](https://deingpt.com/en/) - Original inspiration
- [tRPC Documentation](https://trpc.io/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
