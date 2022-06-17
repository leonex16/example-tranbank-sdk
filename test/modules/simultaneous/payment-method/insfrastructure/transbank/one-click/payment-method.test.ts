/* eslint-disable max-len */
import { expect, test } from '@playwright/test';

import { PaymentMethod } from '../../../../../../../src/modules/simultaneous/payment-method/domain/payment-method';
import { PaymentMethodConfirmator } from '../../../../../../../dist/src/modules/simultaneous/payment-method/application/payment-method-confirmator';
import { PaymentMethodCreator } from '../../../../../../../dist/src/modules/simultaneous/payment-method/application/payment-method-creator';
import { PaymentMethodDeleter } from '../../../../../../../dist/src/modules/simultaneous/payment-method/application/payment-method-deleter';
import { TransbankOneClickPaymentMethod } from '../../../../../../../dist/src/modules/simultaneous/payment-method/insfrastructure/transbank/one-click/payment-method';

import { getTokenAfterCardRegister } from '../../../../../../shared/get-token-after-card-register';
import { getUrlToCardRegister } from '../../../../../../shared/get-url-to-card-register';

let paymentMethodImplementation: PaymentMethod;

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
        const url = await getUrlToCardRegister( paymentMethodImplementation );
        const tbkToken = await getTokenAfterCardRegister( page, url );

        const paymentMethodConfirmator = new PaymentMethodConfirmator( paymentMethodImplementation );

        await expect( paymentMethodConfirmator.invoke( tbkToken ) ).resolves.toHaveProperty( 'card', { 'number': 'XXXXXXXXXXXX6623', 'type': 'Visa' } );
      } );
    } );

    test.describe( 'PaymentMethodDeleter', () => {
      test( 'should delete payment method', async ( { page } ) => {
        const paymentMethodConfirmator = new PaymentMethodConfirmator( paymentMethodImplementation );
        const paymentMethodDeleter = new PaymentMethodDeleter( paymentMethodImplementation );
        const url = await getUrlToCardRegister( paymentMethodImplementation );
        const tbkToken = await getTokenAfterCardRegister( page, url );

        await paymentMethodConfirmator.invoke( tbkToken );

        await expect( paymentMethodDeleter.invoke() ).resolves.toBeUndefined();
      } );
    } );
  } );
} );
