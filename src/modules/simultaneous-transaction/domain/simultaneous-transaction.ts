export interface SimultaneousTransaction {
  autorize( username: string, tbkUser: string, purchaseOrder: string, detail: unknown[] ): Promise<any>;
  getStatus( purchaseOrder: string ): Promise<any>;
  reverse( mainPurchaseOrder: string, childPurchaseOrder: string, amount: number ): Promise<any>;
}
