/* eslint-disable @typescript-eslint/no-unused-vars */
import { Spy } from '../../../../../__mocks__/Spy';
import { Transaction } from '../../../../../../src/modules/deferred/transaction/domain/transaction';

export class TransactionSpy extends Spy implements Transaction {
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
