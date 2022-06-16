import { SimultaneousTransaction } from '#src/modules/simultaneous-transaction/domain/simultaneous-transaction';

export class SimultaneousTransactionStatus {
  constructor (
    private _transaction?: SimultaneousTransaction
  ) { }

  async invoke ( purchaseOrder: string ): Promise<any> {
    if ( !this._transaction ) throw new Error( 'TransactionAutorizator needs a transaction instance' );
    if ( !purchaseOrder ) throw new Error( 'PurchaseOrder is required' );
    if ( purchaseOrder.slice( 0, 3 ) !== 'PO-' ) throw new Error( 'PurchaseOrder must start with "PO-"' );

    return this._transaction.getStatus( purchaseOrder );
  }
}
