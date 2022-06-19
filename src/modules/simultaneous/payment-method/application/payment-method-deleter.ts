import { PaymentMethod } from '#src/modules/simultaneous/payment-method/domain/payment-method';
import { Inject, InjectionTarget } from '#src/shared/domain/service/dependency-injection/index';

@InjectionTarget()
export class PaymentMethodDeleter {
  constructor (
    @Inject( 'PaymentMethod' ) private readonly _paymentMethod?: PaymentMethod
  ) { }

  async invoke ( token: string, username: string ): Promise<void> {
    if ( !this._paymentMethod ) throw new Error( 'PaymentMethod is required' );
    if ( !token ) throw new Error( 'Token is required' );
    if ( !username ) throw new Error( 'Username is required' );

    return this._paymentMethod.delete( token, username );
  }
}
