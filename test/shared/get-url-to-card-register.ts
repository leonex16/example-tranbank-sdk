import { PaymentMethod } from '../../src/modules/payment-method/domain/payment-method';
import { PaymentMethodCreator } from '../../dist/src/modules/payment-method/application/payment-method-creator';

export const getUrlToCardRegister = async ( paymentMethodImplementation: PaymentMethod ) => {
  const username = `U-${ Math.floor( Math.random() * 1000000 ) }`;
  const paymentMethodCreator = new PaymentMethodCreator( paymentMethodImplementation );
  const dataToCreatePaymentMethod = await paymentMethodCreator.invoke( username, `${ username }@gmail.com` );

  return `${ dataToCreatePaymentMethod.url }?TBK_TOKEN=${ dataToCreatePaymentMethod.token }`;
};
