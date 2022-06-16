import { PaymentMethod } from '../../../../../src/modules/payment-method/domain/payment-method';

export class PaymentMethodSpy implements PaymentMethod {
  public methodCalledCounter = 0;

  get cardInfo (): { type: string; number: string; } {
    throw new Error( 'Method not implemented.' );
  }

  get keysToTransaction (): any {
    throw new Error( 'Method not implemented.' );
  }

  async getUrlToAdd () {
    this.methodCalledCounter++;

    return { url: '', token: '' };
  }

  async confirm () {
    this.methodCalledCounter++;
  }

  async delete () {
    this.methodCalledCounter++;
  }

  clearSpy () {
    this.methodCalledCounter = 0;
  }
}
