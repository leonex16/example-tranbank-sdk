import { test, expect } from '@playwright/test';

import { ServerListener } from '../../../../../dist/src/modules/server/application/server-listener';
import { NodeServer } from '../../../../../dist/src/modules/server/infrastructure/vanilla/server';
import { version } from '../../../../../package.json';

test.beforeAll(async () => {
  const server = new ServerListener(new NodeServer());
  await server.invoke();
})

test.describe('Infrastructure Server', () => {
  test('should use 3000 port by default', async ({request}) => {
    const apiResponse = await request.get('/');

    expect(apiResponse.status()).toBe(200);
    expect(apiResponse.url()).toContain(':3000');
  })

  test('should return version package.json', async ({request}) => {
    const apiResponse = await request.get('/');
    const json = await apiResponse.json();


    expect(apiResponse.status()).toBe(200);
    expect(json.version).toBe(version);
  })
})