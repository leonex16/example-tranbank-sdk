/* eslint-disable @typescript-eslint/no-unused-vars */
import { SimultaneousTransaction } from '../../../../../src/modules/simultaneous-transaction/domain/simultaneous-transaction';
import { Spy } from '../../../../__mocks__/Spy';

export class SimultaneousTransactionSpy extends Spy implements SimultaneousTransaction {
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
