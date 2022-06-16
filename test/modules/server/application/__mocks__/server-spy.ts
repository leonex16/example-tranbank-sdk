import { Server } from '../../../../../src/modules/server/domain/server';
import { Spy } from '../../../../__mocks__/Spy';

export class SpyServer extends Spy implements Server {
  public passedPort: number | null = null;

  async listen ( port: number ) {
    this.methodCalledCounter++;
    this.passedPort = port;
  }
}
