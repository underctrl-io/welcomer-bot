# Welcomer Bot

This app was built to introduce developers to full-stack development in relation to Discord bots. The API, bot, and dashboard can be worked on independently as separate projects, so each one of them has its own README. You don't have to worry about any interlinked types, or dependencies.

Before starting, make sure you have the following setup:

- Node.js
- npm
- A MongoDB instance (could be local or using atlas)
- A Redis instance (could be local or using a service like upstash)
- A Discord application

## API

The API is the core of the stack and is responsible for handling requests from both the dashboard and the bot. In this example setup, we'll assume the URL of the API is `http://localhost:3000`.

The API primarily uses:

- [Express](https://expressjs.com/) for the server
- [MongoDB](https://www.mongodb.com/) for the database
- [Mongoose](https://mongoosejs.com/) to interact with MongoDB
- [Redis](https://redis.io/) for caching
- [ioredis](https://github.com/redis/ioredis) to interact with Redis
- [Axios](https://axios-http.com/) for HTTP requests
- [JWT](https://jwt.io/) for authentication cookies
- [TypeScript](https://www.typescriptlang.org/) for type safety

To setup the API, continue reading the [API README](./api/README.md).

## Bot

The bot only handles a handful of tasks (such as listening to events), and most of the heavy lifting is handled by the API.

The bot uses:

- [Discord.js](https://discord.js.org/) to interact with Discord
- [CommandKit](https://commandkit.js.org/) to handle commands and events
- [Axios](https://axios-http.com/) for HTTP requests
- [TypeScript](https://www.typescriptlang.org/) for type safety

To setup the bot, continue reading the [Bot README](./bot/README.md).

## Dashboard

The dashboard is the main way for server managers to configure the behavior of the bot. In this example setup, we'll assume the URL of the dashboard is `http://localhost:3001`.

The dashboard uses:

- [React](https://reactjs.org/) for the frontend
- [Vite](https://vitejs.dev/) for the build tool
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [DaisyUI](https://daisyui.com/) for the UI components
- [Axios](https://axios-http.com/) for HTTP requests
- [TanStack Query](https://tanstack.com/query) for stateful data fetching
- [Jotai](https://jotai.org/) for state management
- [React Router](https://reactrouter.com/) for routing
- [React Toastify](https://github.com/fkhadra/react-toastify) for notifications
- [TypeScript](https://www.typescriptlang.org/) for type safety

To setup the dashboard, continue reading the [Dashboard README](./dashboard/README.md).

> I didn't use Next.js for this project because I wanted to avoid the constant breaking changes that it's known for, as well as the fact I wanted to show how React behaves at its core.
