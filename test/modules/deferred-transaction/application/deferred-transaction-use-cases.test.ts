import { expect, test } from '@playwright/test';

import { DeferredTransactionAuthorizator } from '../../../../dist/src/modules/deferred-transaction/application/deferred-transaction-authorizator';
import { DeferredTransactionCapturer } from '../../../../dist/src/modules/deferred-transaction/application/deferred-transaction-capturer';
import { DeferredTransactionReversor } from '../../../../dist/src/modules/deferred-transaction/application/deferred-transaction-reversor';
import { DeferredTransactionSpy } from './__mocks__/deferred-transaction-spy';
import { DeferredTransactionStatus } from '../../../../dist/src/modules/deferred-transaction/application/deferred-transaction-status';
import { registerDependencies } from '../../../../dist/src/config/register-dependencies';

const username = 'U-27805';
const tbkUser = 'd5603435-51c4-47c1-9806-b141d3a8ddab';
const purchaseOrder = `PO-${ new Date().getTime() }-`;
const detail = [ { amount: Math.floor( Math.random() * ( 10_000 - 1_000 ) + 1_000 ) }, { amount: Math.floor( Math.random() * ( 10_000 - 1_000 ) + 1_000 ) } ];

test.describe( 'Application Deferred Transaction', () => {
  test.describe( 'DeferredTransactionAutorizator', () => {
    test( 'should called invoke method', async () => {
      const deferredTransactionSpy = new DeferredTransactionSpy();
      const deferredTransactionAutorizator = new DeferredTransactionAuthorizator( deferredTransactionSpy );
      await deferredTransactionAutorizator.invoke( 'USERNAME', 'TBK_USER', 'PO-1234', [] );

      expect( deferredTransactionSpy.methodCalledCounter ).toBe( 1 );
    } );

    test( 'should inyject automatically its dependecy', async () => {
      registerDependencies();
      const deferredTransactionAutorizator = new DeferredTransactionAuthorizator();

      await expect( deferredTransactionAutorizator.invoke( username, tbkUser, purchaseOrder, detail ) ).resolves.toBeTruthy();
    } );
  } );

  test.describe( 'DeferredTransactionStatus', () => {
    test( 'should called invoke method', async () => {
      const deferredTransactionSpy = new DeferredTransactionSpy();
      const deferredTransactionStatus = new DeferredTransactionStatus( deferredTransactionSpy );
      await deferredTransactionStatus.invoke( 'PO-1234' );

      expect( deferredTransactionSpy.methodCalledCounter ).toBe( 1 );
    } );

    test( 'should inyject automatically its dependecy', async () => {
      registerDependencies();
      const deferredTransactionAutorizator = new DeferredTransactionAuthorizator();
      const deferredTransactionStatus = new DeferredTransactionStatus();
      const transaction = await deferredTransactionAutorizator.invoke( username, tbkUser, purchaseOrder, detail );

      await expect( deferredTransactionStatus.invoke( transaction.buyOrder ) ).resolves.toBeTruthy();
    } );
  } );

  test.describe( 'DeferredTransactionReversor', () => {
    test( 'should called invoke method', async () => {
      const deferredTransactionSpy = new DeferredTransactionSpy();
      const deferredTransactionReversor = new DeferredTransactionReversor( deferredTransactionSpy );
      await deferredTransactionReversor.invoke( 'PO-XXX-0', 'PO-XXX-1', 5000 );

      expect( deferredTransactionSpy.methodCalledCounter ).toBe( 1 );
    } );

    test( 'should inyject automatically its dependecy', async () => {
      registerDependencies();
      const deferredTransactionAutorizator = new DeferredTransactionAuthorizator();
      const deferredTransactionReversor = new DeferredTransactionReversor();
      const transaction = await deferredTransactionAutorizator.invoke( username, tbkUser, purchaseOrder, detail );
      const item = transaction.details[ 0 ];

      await expect( deferredTransactionReversor.invoke( transaction.buyOrder, item.buyOrder, item.amount ) ).resolves.toBeTruthy();
    } );
  } );

  test.describe( 'DeferredTransactionCapturer', () => {
    test( 'should called invoke method', async () => {
      const deferredTransactionSpy = new DeferredTransactionSpy();
      const deferredTransactionCapturer = new DeferredTransactionCapturer( deferredTransactionSpy );
      await deferredTransactionCapturer.invoke( 'PO-XXX-1', 5000, '1234' );

      expect( deferredTransactionSpy.methodCalledCounter ).toBe( 1 );
    } );

    test( 'should inyject automatically its dependecy', async () => {
      registerDependencies();
      const deferredTransactionAutorizator = new DeferredTransactionAuthorizator();
      const deferredTransactionCapturer = new DeferredTransactionCapturer();
      const transaction = await deferredTransactionAutorizator.invoke( username, tbkUser, purchaseOrder, detail );
      const item = transaction.details[ 1 ];

      await expect( deferredTransactionCapturer.invoke( item.buyOrder, item.amount, item.authorizationCode ) ).resolves.toBeTruthy();
    } );
  } );
} );
