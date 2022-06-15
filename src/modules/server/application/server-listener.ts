import { Inject, InjectionTarget } from '#src/shared/domain/service/dependency-injection/index';
import { Server } from '#src/modules/server/domain/server';

@InjectionTarget()
export class ServerListener {
  constructor (
    @Inject('Server') private readonly _server: Server
  ) {}

  invoke ( port: number ): Promise<void> {
    return this._server.listen( port );
  }
}
