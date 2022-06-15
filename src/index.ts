import { registerDependencies } from '#src/config/inyection-container';
import { NodeServer } from "#src/modules/server/infrastructure/vanilla/server";

registerDependencies();

const server = new NodeServer();

server.listen();