import { PaymentMethod } from '#src/modules/simultaneous/payment-method/domain/payment-method';
import { Inject, InjectionTarget } from '#src/shared/domain/service/dependency-injection/index';

@InjectionTarget()
export class PaymentMethodCreator {
  constructor (
    @Inject( 'PaymentMethod' ) private readonly _paymentMethod?: PaymentMethod
  ) { }

  invoke ( username: string, email: string, urlToRedirect: string ): Promise<{ url: string; token: string; }> {
    if ( !this._paymentMethod ) throw new Error( 'PaymentMethod is required' );
    if ( !username ) throw new Error( 'Username is required' );
    if ( !email ) throw new Error( 'Email is required' );
    if ( !urlToRedirect ) throw new Error( 'UrlToRedirect is required' );

    return this._paymentMethod.getUrlToAdd( username, email, urlToRedirect );
  }
}
