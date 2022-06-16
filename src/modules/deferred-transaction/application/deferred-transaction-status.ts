import { DeferredTransaction } from '#src/modules/deferred-transaction/domain/deferred-transaction';
import { Inject, InjectionTarget } from '#src/shared/domain/service/dependency-injection/index';

@InjectionTarget()
export class DeferredTransactionStatus {
  constructor (
    @Inject( 'DeferredTransaction' ) private readonly _transaction?: DeferredTransaction
  ) { }

  async invoke ( purchaseOrder: string ): Promise<any> {
    if ( !this._transaction ) throw new Error( 'TransactionAutorizator needs a transaction instance' );
    if ( !purchaseOrder ) throw new Error( 'PurchaseOrder is required' );
    if ( purchaseOrder.slice( 0, 3 ) !== 'PO-' ) throw new Error( 'PurchaseOrder must start with "PO-"' );

    return this._transaction.getStatus( purchaseOrder );
  }
}
