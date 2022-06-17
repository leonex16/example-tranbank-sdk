/* eslint-disable @typescript-eslint/no-unused-vars */
import { Spy } from '../../../../../__mocks__/Spy';
import { Transaction } from '../../../../../../src/modules/simultaneous/transaction/domain/transaction';

export class TransactionSpy extends Spy implements Transaction {
  async autorize ( username: string, tbkUser: string, purchaseOrder: string, detail: unknown[] ) {
    this.methodCalledCounter++;
  }

  async getStatus ( purchaseOrder: string ) {
    this.methodCalledCounter++;
  }

  async reverse ( mainPurchaseOrder: string, childPurchaseOrder: string, amount: number ) {
    this.methodCalledCounter++;
  }
}
