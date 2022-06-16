import { expect, test } from '@playwright/test';

import { SimultaneousTransaction }
  from '../../../../../../src/modules/simultaneous-transaction/domain/simultaneous-transaction';
import { SimultaneousTransactionAutorizator }
  from '../../../../../../dist/src/modules/simultaneous-transaction/application/simultaneous-transaction-autorizator';
import { SimultaneousTransactionReversor }
  from '../../../../../../dist/src/modules/simultaneous-transaction/application/simultaneous-transaction-reversor';
import { SimultaneousTransactionStatus }
  from '../../../../../../dist/src/modules/simultaneous-transaction/application/simultaneous-transaction-status';
import { SimultaneousTransbankOneClickTransaction }
  from '../../../../../../dist/src/modules/simultaneous-transaction/infrastructure/transbank/one-click/simultaneous-transaction';

const username = 'U-92424';
const tbkUser = 'a0ece32c-8b50-45e8-9fbd-0c76fbea3dbd';
const purchaseOrder = `PO-${ new Date().getTime() }-`;
const detail = [ { amount: Math.floor( Math.random() * ( 10_000 - 1_000 ) + 1_000 ) } ];
let simultaneousTransactionImplementation: SimultaneousTransaction;

test.beforeEach( () => {
  simultaneousTransactionImplementation = new SimultaneousTransbankOneClickTransaction();
} );

test.describe( 'Infrastructure Simultaneous Transaction Transbank One Click', () => {
  test.describe( 'SimultaneousTransaction', () => {
    test.describe( 'SimultaneousTransactionAutorizator', () => {
      test( 'should returns purcharse order detail', async () => {
        const simultaneousTransactionAutorizator = new SimultaneousTransactionAutorizator( simultaneousTransactionImplementation );
        const transaction = await simultaneousTransactionAutorizator.invoke( username, tbkUser, purchaseOrder, detail );

        expect( transaction ).toHaveProperty( 'details' );
        expect( transaction ).toHaveProperty( 'buyOrder' );
        expect( transaction ).toHaveProperty( 'cardDetail' );
        expect( transaction ).toHaveProperty( 'accountingDate' );
        expect( transaction ).toHaveProperty( 'transactionDate' );
      } );
    } );

    test.describe( 'SimultaneousTransactionStatus', () => {
      test( 'should returns purcharse order detail by purchase order', async () => {
        const simultaneousTransactionAutorizator = new SimultaneousTransactionAutorizator( simultaneousTransactionImplementation );
        const simultaneousTransactionStatus = new SimultaneousTransactionStatus( simultaneousTransactionImplementation );
        const transaction = await simultaneousTransactionAutorizator.invoke( username, tbkUser, purchaseOrder, detail );
        const transactionStatus = await simultaneousTransactionStatus.invoke( transaction.buyOrder );

        expect( transactionStatus ).toHaveProperty( 'details' );
        expect( transactionStatus ).toHaveProperty( 'buyOrder' );
        expect( transactionStatus ).toHaveProperty( 'cardDetail' );
        expect( transactionStatus ).toHaveProperty( 'accountingDate' );
        expect( transactionStatus ).toHaveProperty( 'transactionDate' );
      } );
    } );

    test.describe( 'SimultaneousTransactionReversor', () => {
      test( 'should returns an object with type property', async () => {
        const simultaneousTransactionAutorizator = new SimultaneousTransactionAutorizator( simultaneousTransactionImplementation );
        const simultaneousTransactionReversor = new SimultaneousTransactionReversor( simultaneousTransactionImplementation );
        const transaction = await simultaneousTransactionAutorizator.invoke( username, tbkUser, purchaseOrder, detail );
        const item = transaction.details[ 0 ];
        const transactionReversed = await simultaneousTransactionReversor.invoke( transaction.buyOrder, item.buyOrder, item.amount );

        expect( transactionReversed ).toHaveProperty( 'type', 'REVERSED' );
      } );
    } );
  } );
} );
