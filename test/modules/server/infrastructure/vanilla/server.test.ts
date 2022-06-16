import { expect, test } from '@playwright/test';

import { NodeServer } from '../../../../../dist/src/modules/server/infrastructure/vanilla/server';
import { ServerListener } from '../../../../../dist/src/modules/server/application/server-listener';
import { registerDependencies } from '../../../../../dist/src/config/inyection-container';
import { version } from '../../../../../package.json';

test.beforeEach( () => {
  registerDependencies();
} );

test.beforeAll( async () => {
  const server = new ServerListener( new NodeServer() );
  await server.invoke();
} );

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

  test( 'shoud get url and token', async ( { request } ) => {
    const apiResponse = await request.get( '/payment-method/inscription?username=jane&email=janedoe@gmail.com' );
    const json = await apiResponse.json();

    expect( apiResponse.status() ).toBe( 200 );
    expect( json.url ).toBeDefined();
    expect( json.token ).toBeDefined();
  } );

  test.skip( 'shoud return 204 when the payment method was confirmed', async ( { request } ) => {
    const headers = { 'tbk-token': '123456789' };
    const apiResponse = await request.post( '/payment-method/confirm', { headers } );
    const json = await apiResponse.json();

    expect( apiResponse.status() ).toBe( 204 );
    expect( json.url ).toBeDefined();
    expect( json.token ).toBeDefined();
  } );
} );
