export interface SimultaneousTransaction {
  autorize( username: string, tbkUser: string, purchaseOrder: string, detail: unknown[] ): Promise<any>;
  getStatus( purchaseOrder: string ): Promise<any>;
  reverse( mainPurchaseOrder: string, childPurchaseOrder: string, amount: number ): Promise<any>;
  // deferredCapture(purchaseOrder: string, amountToCapture: number, authorizationCode: string): Promise<any>;
}

// export class TransactionDeferredCapture {
//   constructor(
//     private _transaction?: Transaction
//   ) { }

//   async invoke(purchaseOrder: string, amountToCapture: number, authorizationCode: string): Promise<any> {
//     if ( !this._transaction ) throw new Error('TransactionAutorizator needs a transaction instance');
//     if ( !purchaseOrder ) throw new Error('PurchaseOrder is required');
//     if ( !amountToCapture ) throw new Error('AmountToCapture is required');
//     if ( !authorizationCode ) throw new Error('AuthorizationCode is required');

//     if ( purchaseOrder.slice(0, 3) !== 'PO-' ) throw new Error('PurchaseOrder must start with "PO-"');

//     return this._transaction.deferredCapture(purchaseOrder, amountToCapture, authorizationCode)
//   }
// }
