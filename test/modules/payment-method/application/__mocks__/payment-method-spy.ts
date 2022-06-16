import { PaymentMethod } from '../../../../../src/modules/payment-method/domain/payment-method';
import { Spy } from '../../../../__mocks__/Spy';

export class PaymentMethodSpy extends Spy implements PaymentMethod {
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
}
