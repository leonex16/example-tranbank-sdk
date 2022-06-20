import { PaymentMethod } from '../../src/modules/simultaneous/payment-method/domain/payment-method';
import { PaymentMethodCreator } from '../../dist/src/modules/simultaneous/payment-method/application/payment-method-creator';

export const getDataToCardRegister = async ( paymentMethodImplementation: PaymentMethod ) => {
  const username = `U-${ Math.floor( Math.random() * 1000000 ) }`;
  const paymentMethodCreator = new PaymentMethodCreator( paymentMethodImplementation );
  const dataToCreatePaymentMethod = await paymentMethodCreator.invoke( username, `${ username }@gmail.com`, 'https://www.google.cl' );

  return {
    url: `${ dataToCreatePaymentMethod.url }?TBK_TOKEN=${ dataToCreatePaymentMethod.token }`,
    username
  };
};
