import { Inject, InjectionTarget } from '../../../shared/domain/service/dependency-injection/dependency-injection';
import { PaymentMethod } from '../domain/payment-method';

@InjectionTarget()
export class PaymentMethodCreator {
  constructor (
    @Inject('PaymentMethod') private readonly _paymentMethod?: PaymentMethod,
  ) { }

  invoke ( username: string, email: string ): Promise<{ url: string; token: string; }> {
    if ( !this._paymentMethod ) throw new Error( 'PaymentMethod is required' );

    return this._paymentMethod.getUrlToAdd(username, email);
  }
}
