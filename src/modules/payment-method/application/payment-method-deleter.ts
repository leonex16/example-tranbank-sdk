import { Inject, InjectionTarget } from "../../../shared/domain/service/dependency-injection/dependency-injection";
import { PaymentMethod } from "../domain/payment-method";

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