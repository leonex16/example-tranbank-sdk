import { PaymentMethod } from '#src/modules/payment-method/domain/payment-method';
import { Inject, InjectionTarget } from '#src/shared/domain/service/dependency-injection/index';

@InjectionTarget()
export class PaymentMethodConfirmator {
  constructor (
    @Inject( 'PaymentMethod' ) private readonly _paymentMethod?: PaymentMethod
  ) { }

  invoke ( token: string ): Promise<void> {
    if ( !this._paymentMethod ) throw new Error( 'PaymentMethod is required' );
    if ( !token ) throw new Error( 'Token is required' );

    return this._paymentMethod.confirm( token );
  }
}
