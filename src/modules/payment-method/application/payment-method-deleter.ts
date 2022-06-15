import { Inject, InjectionTarget } from "#src/shared/domain/service/dependency-injection/index";
import { PaymentMethod } from "#src/modules/payment-method/domain/payment-method";

@InjectionTarget()
export class PaymentMethodDeleter {
  constructor (
    @Inject('PaymentMethod') private readonly _paymentMethod?: PaymentMethod
  ) { }

  async invoke (): Promise<void> {
    if ( !this._paymentMethod ) throw new Error( 'PaymentMethod is required' );

    return this._paymentMethod.delete();
  }
}