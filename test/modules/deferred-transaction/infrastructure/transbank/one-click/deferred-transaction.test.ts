import { expect, test } from '@playwright/test';

import { DeferredTransaction }
  from '../../../../../../src/modules/deferred-transaction/domain/deferred-transaction';
import { DeferredTransactionAutorizator }
  from '../../../../../../dist/src/modules/deferred-transaction/application/deferred-transaction-autorizator';
import { DeferredTransactionCapturer }
  from '../../../../../../dist/src/modules/deferred-transaction/application/deferred-transaction-capturer';
import { DeferredTransactionReversor }
  from '../../../../../../dist/src/modules/deferred-transaction/application/deferred-transaction-reversor';
import { DeferredTransactionStatus }
  from '../../../../../../dist/src/modules/deferred-transaction/application/deferred-transaction-status';
import { DeferredTransbankOneClickTransaction }
  from '../../../../../../dist/src/modules/deferred-transaction/infrastructure/transbank/one-click/deferred-transaction';

const username = 'U-28819';
const tbkUser = '4f5d168e-61d7-41ef-9686-6a224673aeb6';
const purchaseOrder = `PO-${ new Date().getTime() }-`;
const detail = [ { amount: Math.floor( Math.random() * ( 10_000 - 1_000 ) + 1_000 ) } ];
let deferredTransactionImplementation: DeferredTransaction;

test.beforeEach( () => {
  deferredTransactionImplementation = new DeferredTransbankOneClickTransaction();
} );

// I do no the reason to test failures...
test.describe.skip( 'Infrastructure Deferred Transaction Transbank One Click', () => {
  test.describe( 'DeferredTransaction', () => {
    test.describe( 'DeferredTransactionAutorizator', () => {
      test( 'should returns purcharse order detail', async () => {
        const deferredTransactionAutorizator = new DeferredTransactionAutorizator( deferredTransactionImplementation );
        const transaction = await deferredTransactionAutorizator.invoke( username, tbkUser, purchaseOrder, detail );

        expect( transaction ).toHaveProperty( 'details' );
        expect( transaction ).toHaveProperty( 'buyOrder' );
        expect( transaction ).toHaveProperty( 'cardDetail' );
        expect( transaction ).toHaveProperty( 'accountingDate' );
        expect( transaction ).toHaveProperty( 'transactionDate' );
      } );
    } );

    test.describe( 'DeferredTransactionStatus', () => {
      test( 'should returns purcharse order detail by purchase order', async () => {
        const deferredTransactionAutorizator = new DeferredTransactionAutorizator( deferredTransactionImplementation );
        const deferredTransactionStatus = new DeferredTransactionStatus( deferredTransactionImplementation );
        const transaction = await deferredTransactionAutorizator.invoke( username, tbkUser, purchaseOrder, detail );
        const transactionStatus = await deferredTransactionStatus.invoke( transaction.buyOrder );

        expect( transactionStatus ).toHaveProperty( 'details' );
        expect( transactionStatus ).toHaveProperty( 'buyOrder' );
        expect( transactionStatus ).toHaveProperty( 'cardDetail' );
        expect( transactionStatus ).toHaveProperty( 'accountingDate' );
        expect( transactionStatus ).toHaveProperty( 'transactionDate' );
      } );
    } );

    test.describe( 'DeferredTransactionReversor', () => {
      test( 'should returns an object with type property', async () => {
        const deferredTransactionAutorizator = new DeferredTransactionAutorizator( deferredTransactionImplementation );
        const deferredTransactionReversor = new DeferredTransactionReversor( deferredTransactionImplementation );
        const transaction = await deferredTransactionAutorizator.invoke( username, tbkUser, purchaseOrder, detail );
        const item = transaction.details[ 0 ];
        const transactionReversed = await deferredTransactionReversor.invoke( transaction.buyOrder, item.buyOrder, item.amount );

        expect( transactionReversed ).toHaveProperty( 'type', 'REVERSED' );
      } );
    } );

    test.describe( 'DeferredTransactionCapture', () => {
      test( 'should returns an object with type property', async () => {
        const deferredTransactionAutorizator = new DeferredTransactionAutorizator( deferredTransactionImplementation );
        const deferredTransactionCapturer = new DeferredTransactionCapturer( deferredTransactionImplementation );
        const transaction = await deferredTransactionAutorizator.invoke( username, tbkUser, purchaseOrder, detail );
        const item = transaction.details[ 0 ];
        const transactionCaptured = await deferredTransactionCapturer.invoke( item.buyOrder, item.amount, item.authorizationCode );

        expect( transactionCaptured ).toHaveProperty( 'authorizationCode' );
        expect( transactionCaptured ).toHaveProperty( 'authorizationDate' );
        expect( transactionCaptured ).toHaveProperty( 'capturedAmount', item.amount );
        expect( transactionCaptured ).toHaveProperty( 'responseCode', 0 );
      } );
    } );
  } );
} );
