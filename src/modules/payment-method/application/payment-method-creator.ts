import { Inject, InjectionTarget } from '#src/shared/domain/service/dependency-injection/index';
import { PaymentMethod } from '#src/modules/payment-method/domain/payment-method';

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
