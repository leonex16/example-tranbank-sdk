import { SimultaneousTransaction } from '#src/modules/simultaneous-transaction/domain/simultaneous-transaction';

export class SimultaneousTransactionReversor {
  constructor (
    private _transaction?: SimultaneousTransaction
  ) { }

  async invoke ( mainPurchaseOrder: string, childPurchaseOrder: string, amount: number ): Promise<any> {
    if ( !this._transaction ) throw new Error( 'TransactionAutorizator needs a transaction instance' );
    if ( !mainPurchaseOrder ) throw new Error( 'MainPurchaseOrder is required' );
    if ( !childPurchaseOrder ) throw new Error( 'ChildPurchaseOrder is required' );
    if ( !amount ) throw new Error( 'Amount is required' );

    if ( mainPurchaseOrder.slice( 0, 3 ) !== 'PO-' ) throw new Error( 'MainPurchaseOrder must start with "PO-"' );
    if ( childPurchaseOrder.slice( 0, 3 ) !== 'PO-' ) throw new Error( 'ChildPurchaseOrder must start with "PO-"' );

    return this._transaction.reverse( mainPurchaseOrder, childPurchaseOrder, amount );
  }
}
