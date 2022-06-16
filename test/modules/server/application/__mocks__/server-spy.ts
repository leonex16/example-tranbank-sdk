import { Server } from '../../../../../src/modules/server/domain/server';

export class SpyServer implements Server {
  public methodCalled = false;
  public passedPort: number | null = null;

  async listen ( port: number ) {
    this.methodCalled = true;
    this.passedPort = port;
  }
}
