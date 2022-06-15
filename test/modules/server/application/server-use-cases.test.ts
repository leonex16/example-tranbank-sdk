import { test, expect } from '@playwright/test';

import { ServerListener } from '../../../../dist/src/modules/server/application/server-listener';
import { registerDependencies } from '../../../../dist/src/config/inyection-container';
import { SpyServer } from './__mocks__/server-spy'

test.describe('Application Server', () => {
  test('should called listen method', async () => {
    const spyServer = new SpyServer();
    const server = new ServerListener(spyServer);
    await server.invoke(8080);

    expect(spyServer.methodCalled).toBe(true);
    expect(spyServer.passedPort).toBe(8080);
  })

  test('should inyject automatically its dependecy', async () => {
    registerDependencies();
    const server = new ServerListener();
  
    await expect(server.invoke()).resolves.toBeUndefined();
  })
})