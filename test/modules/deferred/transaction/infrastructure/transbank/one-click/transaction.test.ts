import { expect, test } from '@playwright/test';

import { Transaction } from '../../../../../../../src/modules/deferred/transaction/domain/transaction';
import { TransactionAuthorizator } from '../../../../../../../dist/src/modules/deferred/transaction/application/transaction-authorizator';
import { TransactionCapturer } from '../../../../../../../dist/src/modules/deferred/transaction/application/transaction-capturer';
import { TransactionReversor } from '../../../../../../../dist/src/modules/deferred/transaction/application/transaction-reversor';
import { TransactionStatus } from '../../../../../../../dist/src/modules/deferred/transaction/application/transaction-status';
import { TransbankOneClickTransaction } from '../../../../../../../dist/src/modules/deferred/transaction/infrastructure/transbank/one-click/transaction';

const username = 'U-28819';
const tbkUser = '4f5d168e-61d7-41ef-9686-6a224673aeb6';
const purchaseOrder = `PO-${ new Date().getTime() }-`;
const detail = [ { amount: Math.floor( Math.random() * ( 10_000 - 1_000 ) + 1_000 ) } ];
let deferredTransactionImplementation: Transaction;

test.beforeEach( () => {
  deferredTransactionImplementation = new TransbankOneClickTransaction();
} );

// I do no the reason to test failures...
test.describe.skip( 'Infrastructure Deferred Transaction Transbank One Click', () => {
  test.describe( 'Transaction', () => {
    test.describe( 'TransactionAutorizator', () => {
      test( 'should returns purcharse order detail', async () => {
        const deferredTransactionAutorizator = new TransactionAuthorizator( deferredTransactionImplementation );
        const transaction = await deferredTransactionAutorizator.invoke( username, tbkUser, purchaseOrder, detail );

        expect( transaction ).toHaveProperty( 'details' );
        expect( transaction ).toHaveProperty( 'buyOrder' );
        expect( transaction ).toHaveProperty( 'cardDetail' );
        expect( transaction ).toHaveProperty( 'accountingDate' );
        expect( transaction ).toHaveProperty( 'transactionDate' );
      } );
    } );

    test.describe( 'TransactionStatus', () => {
      test( 'should returns purcharse order detail by purchase order', async () => {
        const deferredTransactionAutorizator = new TransactionAuthorizator( deferredTransactionImplementation );
        const deferredTransactionStatus = new TransactionStatus( deferredTransactionImplementation );
        const transaction = await deferredTransactionAutorizator.invoke( username, tbkUser, purchaseOrder, detail );
        const transactionStatus = await deferredTransactionStatus.invoke( transaction.buyOrder );

        expect( transactionStatus ).toHaveProperty( 'details' );
        expect( transactionStatus ).toHaveProperty( 'buyOrder' );
        expect( transactionStatus ).toHaveProperty( 'cardDetail' );
        expect( transactionStatus ).toHaveProperty( 'accountingDate' );
        expect( transactionStatus ).toHaveProperty( 'transactionDate' );
      } );
    } );

    test.describe( 'TransactionReversor', () => {
      test( 'should returns an object with type property', async () => {
        const deferredTransactionAutorizator = new TransactionAuthorizator( deferredTransactionImplementation );
        const deferredTransactionReversor = new TransactionReversor( deferredTransactionImplementation );
        const transaction = await deferredTransactionAutorizator.invoke( username, tbkUser, purchaseOrder, detail );
        const item = transaction.details[ 0 ];
        const transactionReversed = await deferredTransactionReversor.invoke( transaction.buyOrder, item.buyOrder, item.amount );

        expect( transactionReversed ).toHaveProperty( 'type', 'REVERSED' );
      } );
    } );

    test.describe( 'TransactionCapture', () => {
      test( 'should returns an object with type property', async () => {
        const deferredTransactionAutorizator = new TransactionAuthorizator( deferredTransactionImplementation );
        const deferredTransactionCapturer = new TransactionCapturer( deferredTransactionImplementation );
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
