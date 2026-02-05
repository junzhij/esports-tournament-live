import fastify from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { initDb } from './db';
import { buildState } from './db/state';
import { addClient, broadcast } from './ws/bus';
import { registerApiRoutes } from './routes/api';

const app = fastify({ logger: true });
const db = initDb();

app.register(cors, { origin: true });

function resolveWebSocket(connection: any) {
  const candidates = [connection?.socket, connection?.websocket, connection];
  for (const candidate of candidates) {
    if (candidate && typeof candidate.send === 'function' && typeof candidate.on === 'function') {
      return candidate;
    }
  }
  return null;
}

app.register(async (fastify) => {
  await fastify.register(websocket);
  fastify.get('/ws', { websocket: true }, (connection) => {
    const socket = resolveWebSocket(connection);
    if (!socket) {
      fastify.log.error({ connectionType: typeof connection }, 'Invalid websocket connection object');
      return;
    }
    addClient(socket as any);
    const state = buildState(db, false);
    socket.send(JSON.stringify({ type: 'init', payload: state }));
  });
});

registerApiRoutes(app).then(() => {
  const publicRoot = path.resolve(__dirname, '..', '..', 'public');
  app.register(fastifyStatic, {
    root: publicRoot,
    prefix: '/'
  });

  const port = Number(process.env.PORT ?? 3001);
  const host = process.env.HOST ?? '0.0.0.0';

  app.listen({ port, host }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    app.log.info(`Backend listening on ${address}`);
    broadcast({ type: 'match_update', payload: buildState(db, false) });
  });
});
