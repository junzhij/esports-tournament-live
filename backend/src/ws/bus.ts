type WsClient = {
  on: (event: string, handler: (...args: any[]) => void) => void;
  send: (data: string) => void;
  readyState: number;
  OPEN: number;
};

const clients = new Set<WsClient>();

export function addClient(socket: WsClient) {
  clients.add(socket);
  socket.on('close', () => {
    clients.delete(socket);
  });
  socket.on('error', () => {
    clients.delete(socket);
  });
}

export function broadcast(message: unknown) {
  const payload = JSON.stringify(message);
  for (const client of clients) {
    if (client.readyState === client.OPEN) {
      client.send(payload);
    }
  }
}
