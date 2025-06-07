import { createServer, startServer } from './config/server';

const app = createServer();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

startServer(app, PORT);