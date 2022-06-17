import { expect, test } from '@playwright/test';

import { TransactionAuthorizator } from '../../../../../dist/src/modules/simultaneous/transaction/application/transaction-authorizator';
import { TransactionReversor } from '../../../../../dist/src/modules/simultaneous/transaction/application/transaction-reversor';
import { TransactionSpy } from './__mocks__/transaction-spy';
import { TransactionStatus } from '../../../../../dist/src/modules/simultaneous/transaction/application/transaction-status';
import { registerDependencies } from '../../../../../dist/src/config/register-dependencies';

const username = 'U-92424';
const tbkUser = 'a0ece32c-8b50-45e8-9fbd-0c76fbea3dbd';
const purchaseOrder = `PO-${ new Date().getTime() }-`;
const detail = [ { amount: Math.floor( Math.random() * ( 10_000 - 1_000 ) + 1_000 ) } ];

test.describe( 'Application  Transaction', () => {
  test.describe( 'TransactionAutorizator', () => {
    test( 'should called invoke method', async () => {
      const simultaneousTransactionSpy = new TransactionSpy();
      const simultaneousTransactionAutorizator = new TransactionAuthorizator( simultaneousTransactionSpy );
      await simultaneousTransactionAutorizator.invoke( 'USERNAME', 'TBK_USER', 'PO-1234', [] );

      expect( simultaneousTransactionSpy.methodCalledCounter ).toBe( 1 );
    } );

    test( 'should inyject automatically its dependecy', async () => {
      registerDependencies();
      const simultaneousTransactionAutorizator = new TransactionAuthorizator();

      await expect( simultaneousTransactionAutorizator.invoke( username, tbkUser, purchaseOrder, detail ) ).resolves.toBeTruthy();
    } );
  } );

  test.describe( 'TransactionStatus', () => {
    test( 'should called invoke method', async () => {
      const simultaneousTransactionSpy = new TransactionSpy();
      const simultaneousTransactionStatus = new TransactionStatus( simultaneousTransactionSpy );
      await simultaneousTransactionStatus.invoke( 'PO-1234' );

      expect( simultaneousTransactionSpy.methodCalledCounter ).toBe( 1 );
    } );

    test( 'should inyject automatically its dependecy', async () => {
      registerDependencies();
      const simultaneousTransactionAutorizator = new TransactionAuthorizator();
      const simultaneousTransactionStatus = new TransactionStatus();
      const transaction = await simultaneousTransactionAutorizator.invoke( username, tbkUser, purchaseOrder, detail );

      await expect( simultaneousTransactionStatus.invoke( transaction.buyOrder ) ).resolves.toBeTruthy();
    } );
  } );

  test.describe( 'TransactionReversor', () => {
    test( 'should called invoke method', async () => {
      const simultaneousTransactionSpy = new TransactionSpy();
      const simultaneousTransactionReversor = new TransactionReversor( simultaneousTransactionSpy );
      await simultaneousTransactionReversor.invoke( 'PO-XXX-0', 'PO-XXX-1', 5000 );

      expect( simultaneousTransactionSpy.methodCalledCounter ).toBe( 1 );
    } );

    test( 'should inyject automatically its dependecy', async () => {
      registerDependencies();
      const simultaneousTransactionAutorizator = new TransactionAuthorizator();
      const simultaneousTransactionReversor = new TransactionReversor();
      const transaction = await simultaneousTransactionAutorizator.invoke( username, tbkUser, purchaseOrder, detail );
      const item = transaction.details[ 0 ];

      await expect( simultaneousTransactionReversor.invoke( transaction.buyOrder, item.buyOrder, item.amount ) ).resolves.toBeTruthy();
    } );
  } );
} );
