import { DeferredTransaction } from '#src/modules/deferred-transaction/domain/deferred-transaction';
import { Inject, InjectionTarget } from '#src/shared/domain/service/dependency-injection/index';

@InjectionTarget()
export class DeferredTransactionCapturer {
  constructor (
    @Inject( 'DeferredTransaction' ) private readonly _transaction?: DeferredTransaction
  ) { }

  async invoke ( childPurchaseOrder: string, amountToCapture: number, authorizationCode: string ): Promise<any> {
    if ( !this._transaction ) throw new Error( 'TransactionAutorizator needs a transaction instance' );
    if ( !childPurchaseOrder ) throw new Error( 'ChildPurchaseOrder is required' );
    if ( !amountToCapture ) throw new Error( 'AmountToCapture is required' );
    if ( !authorizationCode ) throw new Error( 'AuthorizationCode is required' );

    if ( childPurchaseOrder.slice( 0, 3 ) !== 'PO-' ) throw new Error( 'PurchaseOrder must start with "PO-"' );

    return this._transaction.capture( childPurchaseOrder, amountToCapture, authorizationCode );
  }
}
