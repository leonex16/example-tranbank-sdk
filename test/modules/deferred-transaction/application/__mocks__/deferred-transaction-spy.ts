/* eslint-disable @typescript-eslint/no-unused-vars */
import { DeferredTransaction } from '../../../../../src/modules/deferred-transaction/domain/deferred-transaction';
import { Spy } from '../../../../__mocks__/Spy';

export class DeferredTransactionSpy extends Spy implements DeferredTransaction {
  async autorize ( username: string, tbkUser: string, purchaseOrder: string, detail: unknown[] ): Promise<any> {
    this.methodCalledCounter++;
  }

  async getStatus ( purchaseOrder: string ): Promise<any> {
    this.methodCalledCounter++;
  }

  async reverse ( mainPurchaseOrder: string, childPurchaseOrder: string, amount: number ): Promise<any> {
    this.methodCalledCounter++;
  }

  async capture ( childPurchaseOrder: string, amountToCapture: number, authorizationCode: string ): Promise<any> {
    this.methodCalledCounter++;
  }
}
