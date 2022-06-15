import http from 'node:http';

import { Server } from '#src/modules/server/domain/server';
import { version } from '../../../../../package.json'; 
import { PaymentMethodCreator } from '#src/modules/payment-method/application/payment-method-creator';
import { PaymentMethodConfirmator } from '#src/modules/payment-method/application/payment-method-confirmator';
import { PaymentMethodDeleter } from '#src/modules/payment-method/application/payment-method-deleter';

const parseToUrl = (path = '/') => new URL(path, 'http://localhost');

export class NodeServer implements Server {
  private readonly _server: http.Server;

  constructor() {
    this._server = http.createServer(this.router);
  }

  async listen(port = 3000): Promise<void> {
    this._server.listen(port, () => this.serverUp(port));
  }

  private serverUp(port: number): void {
    console.info(`server started on port: ${port}`);
  }

  private async router(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    const { method, url: rawUrl } = req;
    const { pathname, searchParams } = parseToUrl(rawUrl);

    if (method === 'GET' && pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ version }));
      return;
    }

    if (method === 'GET' && pathname === '/payment-method/inscription') {
      const username = searchParams.get('username');
      const email = searchParams.get('email');

      if (username === null) throw new Error('Username is required');
      if (email === null) throw new Error('Email is required');

      const paymentMethodCreator = new PaymentMethodCreator();

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(await paymentMethodCreator.invoke(username, email)));
      return;
    }

    if (method === 'POST' && pathname === '/payment-method/confirm') {
      const tbkTkn = req.headers['tbk-token'];

      if (tbkTkn === undefined) throw new Error('tbk-token is required');
      if (Array.isArray(tbkTkn)) throw new Error('tbk-token is not string');

      const paymentMethodConfirmator = new PaymentMethodConfirmator();
      await paymentMethodConfirmator.invoke(tbkTkn);

      res.writeHead(204);
      res.end();
      return;
    }

    if (method === 'DELETE' && pathname === '/payment-method/delete') {
      const paymentMethodDeleter = new PaymentMethodDeleter();
      await paymentMethodDeleter.invoke();

      res.writeHead(204);
      res.end();
      return;
    }

    res.writeHead(404);
    res.end();
  }
}
