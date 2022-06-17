import { expect, test } from '@playwright/test';

import { NodeServer } from '../../../../../dist/src/modules/server/infrastructure/vanilla/server';
import { ServerListener } from '../../../../../dist/src/modules/server/application/server-listener';
import { registerDependencies } from '../../../../../dist/src/config/register-dependencies';
import { version } from '../../../../../package.json';

test.beforeEach( () => {
  registerDependencies();
} );

test.beforeAll( async () => {
  const server = new ServerListener( new NodeServer() );
  await server.invoke();
} );

test.use( { baseURL: 'http://localhost:3000' } );

test.describe( 'Infrastructure NodeServer', () => {
  test( 'should use 3000 port by default', async ( { request } ) => {
    const apiResponse = await request.get( '/' );

    expect( apiResponse.status() ).toBe( 200 );
    expect( apiResponse.url() ).toContain( ':3000' );
  } );

  test( 'should return version package.json', async ( { request } ) => {
    const apiResponse = await request.get( '/' );
    const json = await apiResponse.json();

    expect( apiResponse.status() ).toBe( 200 );
    expect( json.version ).toBe( version );
  } );

  // Depend of NodeServer... I can not test this. This is a remember to test .
  test.skip( 'shoud return a status code 200 and url and token', async ( { request } ) => {
    const apiResponse = await request.get( '/simultaneous/payment-method/inscription?username=jane&email=janedoe@gmail.com' );
    const json = await apiResponse.json();

    expect( apiResponse.status() ).toBe( 200 );
    expect( json.url ).toBeDefined();
    expect( json.token ).toBeDefined();
  } );

  // Depend of NodeServer... I can not test this. This is a remember to test .
  test.skip( 'shoud return a status code 200 and tbkToken', async ( { request } ) => {
    const headers = { 'tbk-token': 'a0ece32c-8b50-45e8-9fbd-0c76fbea3dbd' };
    const apiResponse = await request.post( '/simultaneous/payment-method/confirm', { headers } );
    const json = await apiResponse.json();

    expect( apiResponse.status() ).toBe( 200 );
    expect( json.tbkTokon ).toBeDefined();
  } );
} );
