import { Inject, InjectionTarget } from '../../../shared/domain/service/dependency-injection/dependency-injection';
import { Server } from '../domain/server';

@InjectionTarget()
export class ServerListener {
  constructor (
    @Inject('Server') private readonly _server: Server
  ) {}

  invoke ( port: number ): Promise<void> {
    return this._server.listen( port );
  }
}
