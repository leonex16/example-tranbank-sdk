import { test, expect } from '@playwright/test';

import { ServerListener } from '../../../../dist/src/modules/server/application/server-listener';
import { SpyServer } from '../__mocks__/SpyServer'

test.describe('Application Server', () => {
  test('should called listen method', async () => {
    const spyServer = new SpyServer();
    const server = new ServerListener(spyServer);
    await server.invoke(8080);

    expect(spyServer.methodCalled).toBe(true);
    expect(spyServer.passedPort).toBe(8080);
  })
})