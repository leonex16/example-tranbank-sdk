import { expect, test } from '@playwright/test';

import { Transaction } from '../../../../../../../src/modules/simultaneous/transaction/domain/transaction';
import { TransactionAuthorizator } from '../../../../../../../dist/src/modules/simultaneous/transaction/application/transaction-authorizator';
import { TransactionReversor } from '../../../../../../../dist/src/modules/simultaneous/transaction/application/transaction-reversor';
import { TransactionStatus } from '../../../../../../../dist/src/modules/simultaneous/transaction/application/transaction-status';
import { TransbankOneClickTransaction } from '../../../../../../../dist/src/modules/simultaneous/transaction/infrastructure/transbank/one-click/transaction';

const username = 'U-92424';
const tbkUser = 'a0ece32c-8b50-45e8-9fbd-0c76fbea3dbd';
const purchaseOrder = `PO-${ new Date().getTime() }-`;
const detail = [ { amount: Math.floor( Math.random() * ( 10_000 - 1_000 ) + 1_000 ) } ];
let simultaneousTransactionImplementation: Transaction;

test.beforeEach( () => {
  simultaneousTransactionImplementation = new TransbankOneClickTransaction();
} );

test.describe( 'Infrastructure  Transaction Transbank One Click', () => {
  test.describe( 'Transaction', () => {
    test.describe( 'TransactionAutorizator', () => {
      test( 'should returns purcharse order detail', async () => {
        const simultaneousTransactionAutorizator = new TransactionAuthorizator( simultaneousTransactionImplementation );
        const transaction = await simultaneousTransactionAutorizator.invoke( username, tbkUser, purchaseOrder, detail );

        expect( transaction ).toHaveProperty( 'details' );
        expect( transaction ).toHaveProperty( 'buyOrder' );
        expect( transaction ).toHaveProperty( 'cardDetail' );
        expect( transaction ).toHaveProperty( 'accountingDate' );
        expect( transaction ).toHaveProperty( 'transactionDate' );
      } );
    } );

    test.describe( 'TransactionStatus', () => {
      test( 'should returns purcharse order detail by purchase order', async () => {
        const simultaneousTransactionAutorizator = new TransactionAuthorizator( simultaneousTransactionImplementation );
        const simultaneousTransactionStatus = new TransactionStatus( simultaneousTransactionImplementation );
        const transaction = await simultaneousTransactionAutorizator.invoke( username, tbkUser, purchaseOrder, detail );
        const transactionStatus = await simultaneousTransactionStatus.invoke( transaction.buyOrder );

        expect( transactionStatus ).toHaveProperty( 'details' );
        expect( transactionStatus ).toHaveProperty( 'buyOrder' );
        expect( transactionStatus ).toHaveProperty( 'cardDetail' );
        expect( transactionStatus ).toHaveProperty( 'accountingDate' );
        expect( transactionStatus ).toHaveProperty( 'transactionDate' );
      } );
    } );

    test.describe( 'TransactionReversor', () => {
      test( 'should returns an object with type property', async () => {
        const simultaneousTransactionAutorizator = new TransactionAuthorizator( simultaneousTransactionImplementation );
        const simultaneousTransactionReversor = new TransactionReversor( simultaneousTransactionImplementation );
        const transaction = await simultaneousTransactionAutorizator.invoke( username, tbkUser, purchaseOrder, detail );
        const item = transaction.details[ 0 ];
        const transactionReversed = await simultaneousTransactionReversor.invoke( transaction.buyOrder, item.buyOrder, item.amount );

        expect( transactionReversed ).toHaveProperty( 'type', 'REVERSED' );
      } );
    } );
  } );
} );
