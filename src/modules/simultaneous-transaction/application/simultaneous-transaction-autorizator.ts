import { SimultaneousTransaction } from "#src/modules/simultaneous-transaction/domain/simultaneous-transaction";

export class SimultaneousTransactionAutorizator {
  constructor(
    private _transaction?: SimultaneousTransaction
  ) { }

  async invoke(username: string, tbkUser: string, purchaseOrder: string, detail: unknown[]) {
    if ( !this._transaction ) throw new Error('TransactionAutorizator needs a transaction instance');
    if ( !username ) throw new Error('Username is required');
    if ( !tbkUser ) throw new Error('TbkUser is required');
    if ( !purchaseOrder ) throw new Error('PurchaseOrder is required');
    if ( !detail ) throw new Error('Detail is required');

    if ( purchaseOrder.slice(0, 3) !== 'PO-' ) throw new Error('PurchaseOrder must start with "PO-"');

    return this._transaction.autorize(username, tbkUser, purchaseOrder, detail as any)
  }
}