export interface Transaction {
  autorize( username: string, tbkUser: string, purchaseOrder: string, detail: unknown[] ): Promise<any>;
  getStatus( purchaseOrder: string ): Promise<any>;
  reverse( mainPurchaseOrder: string, childPurchaseOrder: string, amount: number ): Promise<any>;
  capture( childPurchaseOrder: string, amountToCapture: number, authorizationCode: string ): Promise<any>;
}
