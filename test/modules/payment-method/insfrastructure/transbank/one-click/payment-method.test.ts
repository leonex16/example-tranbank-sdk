import { expect, test } from '@playwright/test';

import type { Page } from '@playwright/test';

import { PaymentMethod } from '../../../../../../src/modules/payment-method/domain/payment-method';
import { PaymentMethodConfirmator } from '../../../../../../dist/src/modules/payment-method/application/payment-method-confirmator';
import { PaymentMethodCreator } from '../../../../../../dist/src/modules/payment-method/application/payment-method-creator';
import { PaymentMethodDeleter } from '../../../../../../dist/src/modules/payment-method/application/payment-method-deleter';
import { TransbankOneClickPaymentMethod } from '../../../../../../dist/src/modules/payment-method/insfrastructure/transbank/one-click/payment-method';

let paymentMethodImplementation: PaymentMethod;

const getUrlToCardRegister = async () => {
  const username = `U-${ Math.floor( Math.random() * 1000000 ) }`;
  const paymentMethodCreator = new PaymentMethodCreator( paymentMethodImplementation );
  const dataToCreatePaymentMethod = await paymentMethodCreator.invoke( username, `${ username }@gmail.com` );
  return `${ dataToCreatePaymentMethod.url }?TBK_TOKEN=${ dataToCreatePaymentMethod.token }`;
};

const getTokenAfterCardRegister = async ( page: Page, url:string ): Promise<string | null> => {
  const delay = Math.floor( Math.random() * ( 400 - 200 ) + 200 );

  await page.goto( url );

  // Fill transbank form
  await page.locator( 'button:has-text("Crédito")' ).click();

  await page.locator( '[placeholder="XXXX XXXX XXXX XXXX"]' ).click();
  await page.locator( '[placeholder="XXXX XXXX XXXX XXXX"]' ).type( '4051 8856 0044 6623', { delay } );

  await page.locator( '[placeholder="MM\\/AA"]' ).click();
  await page.locator( '[placeholder="MM\\/AA"]' ).type( '1212', { delay } );

  await page.locator( '[placeholder="・・・"]' ).click();
  await page.locator( '[placeholder="・・・"]' ).type( '123', { delay } );

  await page.locator( 'span:has-text("Es mi correo")' ).click();

  await page.locator( 'text=Inscribir mi tarjeta' ).click();

  // Confirm transaction
  await page.locator( 'input[name="rutClient"]' ).click();
  await page.locator( 'input[name="rutClient"]' ).fill( '111111111' );

  await page.locator( 'input[name="passwordClient"]' ).click();
  await page.locator( 'input[name="passwordClient"]' ).fill( '123' );

  await page.locator( 'text=Aceptar' ).click();

  await Promise.all( [
    page.waitForNavigation(),
    page.locator( 'text=Continuar' ).click()
  ] );

  // Extract token
  const pageUrl = new URL( page.url() );
  const tbkToken = pageUrl.searchParams.get( 'TBK_TOKEN' );

  await page.waitForTimeout( delay );
  await page.close();

  return tbkToken;
};

test.beforeEach( () => {
  paymentMethodImplementation = new TransbankOneClickPaymentMethod();
} );

test.describe( 'Infrastructure Payment Method Transbank One Click', () => {
  test.describe( 'PaymentMethod', () => {
    test.describe( 'PaymentMethodCreator', () => {
      test( 'should returns url and token', async () => {
        const TBK_URL = 'https://webpay3gint.transbank.cl/webpayserver/bp_multicode_inscription.cgi';
        const paymentMethodCreator = new PaymentMethodCreator( paymentMethodImplementation );
        const dataToCreatePaymentMethod = await paymentMethodCreator.invoke( 'jane', 'janedoe@gmail.com' );

        expect( dataToCreatePaymentMethod.url ).toBe( TBK_URL );
        expect( dataToCreatePaymentMethod.token ).toBeDefined();
      } );
    } );

    test.describe( 'PaymentMethodConfirmator', () => {
      test( 'should returns keys to transaction', async ( { page } ) => {
        const url = await getUrlToCardRegister();
        const tbkToken = await getTokenAfterCardRegister( page, url );

        const paymentMethodConfirmator = new PaymentMethodConfirmator( paymentMethodImplementation );

        await expect( paymentMethodConfirmator.invoke( tbkToken ) ).resolves.toHaveProperty( 'card', { 'number': 'XXXXXXXXXXXX6623', 'type': 'Visa' } );
      } );
    } );

    test.describe( 'PaymentMethodDeleter', () => {
      test( 'should delete payment method', async ( { page } ) => {
        const paymentMethodConfirmator = new PaymentMethodConfirmator( paymentMethodImplementation );
        const paymentMethodDeleter = new PaymentMethodDeleter( paymentMethodImplementation );
        const url = await getUrlToCardRegister();
        const tbkToken = await getTokenAfterCardRegister( page, url );

        await paymentMethodConfirmator.invoke( tbkToken );

        await expect( paymentMethodDeleter.invoke() ).resolves.toBeUndefined();
      } );
    } );
  } );
} );
