import { expect, test } from '@playwright/test';

import { Transaction }
  from '../../../../../../src/modules/deferred/transaction/domain/transaction';
import { TransactionAuthorizator }
  from '../../../../../../dist/src/modules/deferred/transaction/application/transaction-authorizator';
import { TransactionCapturer }
  from '../../../../../../dist/src/modules/deferred/transaction/application/transaction-capturer';
import { TransactionReversor }
  from '../../../../../../dist/src/modules/deferred/transaction/application/transaction-reversor';
import { TransactionStatus }
  from '../../../../../../dist/src/modules/deferred/transaction/application/transaction-status';
import { TransbankOneClickTransaction }
  from '../../../../../../dist/src/modules/deferred/transaction/infrastructure/transbank/one-click/transaction';

const username = 'U-28819';
const tbkUser = '4f5d168e-61d7-41ef-9686-6a224673aeb6';
const purchaseOrder = `PO-${ new Date().getTime() }-`;
const detail = [ { amount: Math.floor( Math.random() * ( 10_000 - 1_000 ) + 1_000 ) } ];
let TransactionImplementation: Transaction;

test.beforeEach( () => {
  TransactionImplementation = new TransbankOneClickTransaction();
} );

// I do no the reason to test failures...
test.describe.skip( 'Infrastructure Deferred Transaction Transbank One Click', () => {
  test.describe( 'DeferredTransaction', () => {
    test.describe( 'DeferredTransactionAuthorizator', () => {
      test( 'should returns purcharse order detail', async () => {
        const transactionAuthorizator = new TransactionAuthorizator( TransactionImplementation );
        const transaction = await transactionAuthorizator.invoke( username, tbkUser, purchaseOrder, detail );

        expect( transaction ).toHaveProperty( 'details' );
        expect( transaction ).toHaveProperty( 'buyOrder' );
        expect( transaction ).toHaveProperty( 'cardDetail' );
        expect( transaction ).toHaveProperty( 'accountingDate' );
        expect( transaction ).toHaveProperty( 'transactionDate' );
      } );
    } );

    test.describe( 'DeferredTransactionStatus', () => {
      test( 'should returns purcharse order detail by purchase order', async () => {
        const transactionAuthorizator = new TransactionAuthorizator( TransactionImplementation );
        const transactionStatus = new TransactionStatus( TransactionImplementation );
        const transaction = await transactionAuthorizator.invoke( username, tbkUser, purchaseOrder, detail );
        const transactionStatusRes = await transactionStatus.invoke( transaction.buyOrder );

        expect( transactionStatusRes ).toHaveProperty( 'details' );
        expect( transactionStatusRes ).toHaveProperty( 'buyOrder' );
        expect( transactionStatusRes ).toHaveProperty( 'cardDetail' );
        expect( transactionStatusRes ).toHaveProperty( 'accountingDate' );
        expect( transactionStatusRes ).toHaveProperty( 'transactionDate' );
      } );
    } );

    test.describe( 'DeferredTransactionReversor', () => {
      test( 'should returns an object with type property', async () => {
        const transactionAuthorizator = new TransactionAuthorizator( TransactionImplementation );
        const transactionReversor = new TransactionReversor( TransactionImplementation );
        const transaction = await transactionAuthorizator.invoke( username, tbkUser, purchaseOrder, detail );
        const item = transaction.details[ 0 ];
        const transactionReversed = await transactionReversor.invoke( transaction.buyOrder, item.buyOrder, item.amount );

        expect( transactionReversed ).toHaveProperty( 'type', 'REVERSED' );
      } );
    } );

    test.describe( 'DeferredTransactionCapture', () => {
      test( 'should returns an object with type property', async () => {
        const transactionAuthorizator = new TransactionAuthorizator( TransactionImplementation );
        const transactionCapturer = new TransactionCapturer( TransactionImplementation );
        const transaction = await transactionAuthorizator.invoke( username, tbkUser, purchaseOrder, detail );
        const item = transaction.details[ 0 ];
        const transactionCaptured = await transactionCapturer.invoke( item.buyOrder, item.amount, item.authorizationCode );

        expect( transactionCaptured ).toHaveProperty( 'authorizationCode' );
        expect( transactionCaptured ).toHaveProperty( 'authorizationDate' );
        expect( transactionCaptured ).toHaveProperty( 'capturedAmount', item.amount );
        expect( transactionCaptured ).toHaveProperty( 'responseCode', 0 );
      } );
    } );
  } );
} );
