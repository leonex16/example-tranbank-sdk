import { NodeServer } from '#src/modules/server/infrastructure/vanilla/server';
import { registerDependencies } from '#src/config/register-dependencies';

registerDependencies();

const server = new NodeServer();

server.listen( 3001 );
