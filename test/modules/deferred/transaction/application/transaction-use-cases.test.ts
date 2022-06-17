import { expect, test } from '@playwright/test';

import { TransactionAuthorizator } from '../../../../../dist/src/modules/deferred/transaction/application/transaction-authorizator';
import { TransactionCapturer } from '../../../../../dist/src/modules/deferred/transaction/application/transaction-capturer';
import { TransactionReversor } from '../../../../../dist/src/modules/deferred/transaction/application/transaction-reversor';
import { TransactionSpy } from './__mocks__/transaction-spy';
import { TransactionStatus } from '../../../../../dist/src/modules/deferred/transaction/application/transaction-status';
import { registerDependencies } from '../../../../../dist/src/config/register-dependencies';

const username = 'U-27805';
const tbkUser = 'd5603435-51c4-47c1-9806-b141d3a8ddab';
const purchaseOrder = `PO-${ new Date().getTime() }-`;
const detail = [ { amount: Math.floor( Math.random() * ( 10_000 - 1_000 ) + 1_000 ) }, { amount: Math.floor( Math.random() * ( 10_000 - 1_000 ) + 1_000 ) } ];

// I do no the reason to test failures...
test.describe.skip( 'Application Deferred Transaction', () => {
  test.describe( 'TransactionAutorizator', () => {
    test( 'should called invoke method', async () => {
      const deferredTransactionSpy = new TransactionSpy();
      const deferredTransactionAutorizator = new TransactionAuthorizator( deferredTransactionSpy );
      await deferredTransactionAutorizator.invoke( 'USERNAME', 'TBK_USER', 'PO-1234', [] );

      expect( deferredTransactionSpy.methodCalledCounter ).toBe( 1 );
    } );

    test( 'should inyject automatically its dependecy', async () => {
      registerDependencies();
      const deferredTransactionAutorizator = new TransactionAuthorizator();

      await expect( deferredTransactionAutorizator.invoke( username, tbkUser, purchaseOrder, detail ) ).resolves.toBeTruthy();
    } );
  } );

  test.describe( 'TransactionStatus', () => {
    test( 'should called invoke method', async () => {
      const deferredTransactionSpy = new TransactionSpy();
      const deferredTransactionStatus = new TransactionStatus( deferredTransactionSpy );
      await deferredTransactionStatus.invoke( 'PO-1234' );

      expect( deferredTransactionSpy.methodCalledCounter ).toBe( 1 );
    } );

    test( 'should inyject automatically its dependecy', async () => {
      registerDependencies();
      const deferredTransactionAutorizator = new TransactionAuthorizator();
      const deferredTransactionStatus = new TransactionStatus();
      const transaction = await deferredTransactionAutorizator.invoke( username, tbkUser, purchaseOrder, detail );

      await expect( deferredTransactionStatus.invoke( transaction.buyOrder ) ).resolves.toBeTruthy();
    } );
  } );

  test.describe( 'TransactionReversor', () => {
    test( 'should called invoke method', async () => {
      const deferredTransactionSpy = new TransactionSpy();
      const deferredTransactionReversor = new TransactionReversor( deferredTransactionSpy );
      await deferredTransactionReversor.invoke( 'PO-XXX-0', 'PO-XXX-1', 5000 );

      expect( deferredTransactionSpy.methodCalledCounter ).toBe( 1 );
    } );

    test( 'should inyject automatically its dependecy', async () => {
      registerDependencies();
      const deferredTransactionAutorizator = new TransactionAuthorizator();
      const deferredTransactionReversor = new TransactionReversor();
      const transaction = await deferredTransactionAutorizator.invoke( username, tbkUser, purchaseOrder, detail );
      const item = transaction.details[ 0 ];

      await expect( deferredTransactionReversor.invoke( transaction.buyOrder, item.buyOrder, item.amount ) ).resolves.toBeTruthy();
    } );
  } );

  test.describe( 'TransactionCapturer', () => {
    test( 'should called invoke method', async () => {
      const deferredTransactionSpy = new TransactionSpy();
      const deferredTransactionCapturer = new TransactionCapturer( deferredTransactionSpy );
      await deferredTransactionCapturer.invoke( 'PO-XXX-1', 5000, '1234' );

      expect( deferredTransactionSpy.methodCalledCounter ).toBe( 1 );
    } );

    test( 'should inyject automatically its dependecy', async () => {
      registerDependencies();
      const deferredTransactionAutorizator = new TransactionAuthorizator();
      const deferredTransactionCapturer = new TransactionCapturer();
      const transaction = await deferredTransactionAutorizator.invoke( username, tbkUser, purchaseOrder, detail );
      const item = transaction.details[ 1 ];

      await expect( deferredTransactionCapturer.invoke( item.buyOrder, item.amount, item.authorizationCode ) ).resolves.toBeTruthy();
    } );
  } );
} );
