import { registerDependencies } from '#/src/config/register-dependencies';
import { NodeServer } from "#src/modules/server/infrastructure/vanilla/server";

registerDependencies();

const server = new NodeServer();

server.listen();