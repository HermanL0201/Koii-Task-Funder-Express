import Server from './server';

const port = parseInt(process.env.PORT || '3000', 10);
const server = new Server(port);
server.start();