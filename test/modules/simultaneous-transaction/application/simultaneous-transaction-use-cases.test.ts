import { expect, test } from '@playwright/test';

import { SimultaneousTransactionAuthorizator } from '../../../../dist/src/modules/simultaneous-transaction/application/simultaneous-transaction-authorizator';
import { SimultaneousTransactionReversor } from '../../../../dist/src/modules/simultaneous-transaction/application/simultaneous-transaction-reversor';
import { SimultaneousTransactionSpy } from './__mocks__/simultaneous-transaction-spy';
import { SimultaneousTransactionStatus } from '../../../../dist/src/modules/simultaneous-transaction/application/simultaneous-transaction-status';
import { registerDependencies } from '../../../../dist/src/config/register-dependencies';

const username = 'U-92424';
const tbkUser = 'a0ece32c-8b50-45e8-9fbd-0c76fbea3dbd';
const purchaseOrder = `PO-${ new Date().getTime() }-`;
const detail = [ { amount: Math.floor( Math.random() * ( 10_000 - 1_000 ) + 1_000 ) } ];

test.describe( 'Application Simultaneous Transaction', () => {
  test.describe( 'SimultaneousTransactionAutorizator', () => {
    test( 'should called invoke method', async () => {
      const simultaneousTransactionSpy = new SimultaneousTransactionSpy();
      const simultaneousTransactionAutorizator = new SimultaneousTransactionAuthorizator( simultaneousTransactionSpy );
      await simultaneousTransactionAutorizator.invoke( 'USERNAME', 'TBK_USER', 'PO-1234', [] );

      expect( simultaneousTransactionSpy.methodCalledCounter ).toBe( 1 );
    } );

    test( 'should inyject automatically its dependecy', async () => {
      registerDependencies();
      const simultaneousTransactionAutorizator = new SimultaneousTransactionAuthorizator();

      await expect( simultaneousTransactionAutorizator.invoke( username, tbkUser, purchaseOrder, detail ) ).resolves.toBeTruthy();
    } );
  } );

  test.describe( 'SimultaneousTransactionStatus', () => {
    test( 'should called invoke method', async () => {
      const simultaneousTransactionSpy = new SimultaneousTransactionSpy();
      const simultaneousTransactionStatus = new SimultaneousTransactionStatus( simultaneousTransactionSpy );
      await simultaneousTransactionStatus.invoke( 'PO-1234' );

      expect( simultaneousTransactionSpy.methodCalledCounter ).toBe( 1 );
    } );

    test( 'should inyject automatically its dependecy', async () => {
      registerDependencies();
      const simultaneousTransactionAutorizator = new SimultaneousTransactionAuthorizator();
      const simultaneousTransactionStatus = new SimultaneousTransactionStatus();
      const transaction = await simultaneousTransactionAutorizator.invoke( username, tbkUser, purchaseOrder, detail );

      await expect( simultaneousTransactionStatus.invoke( transaction.buyOrder ) ).resolves.toBeTruthy();
    } );
  } );

  test.describe( 'SimultaneousTransactionReversor', () => {
    test( 'should called invoke method', async () => {
      const simultaneousTransactionSpy = new SimultaneousTransactionSpy();
      const simultaneousTransactionReversor = new SimultaneousTransactionReversor( simultaneousTransactionSpy );
      await simultaneousTransactionReversor.invoke( 'PO-XXX-0', 'PO-XXX-1', 5000 );

      expect( simultaneousTransactionSpy.methodCalledCounter ).toBe( 1 );
    } );

    test( 'should inyject automatically its dependecy', async () => {
      registerDependencies();
      const simultaneousTransactionAutorizator = new SimultaneousTransactionAuthorizator();
      const simultaneousTransactionReversor = new SimultaneousTransactionReversor();
      const transaction = await simultaneousTransactionAutorizator.invoke( username, tbkUser, purchaseOrder, detail );
      const item = transaction.details[ 0 ];

      await expect( simultaneousTransactionReversor.invoke( transaction.buyOrder, item.buyOrder, item.amount ) ).resolves.toBeTruthy();
    } );
  } );
} );
