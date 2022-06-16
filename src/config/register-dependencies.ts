import { Container } from '#src/shared/domain/service/dependency-injection/index';
import { NodeServer } from '#src/modules/server/infrastructure/vanilla/server';
import { TransbankOneClickPaymentMethod } from '#src/modules/payment-method/insfrastructure/transbank/one-click/payment-method';
import { TransbankOneClickTransaction } from '#src/modules/simultaneous-transaction/infrastructure/transbank/one-click/simultaneous-transaction';

export const registerDependencies = () => {
  Container
    .register( 'PaymentMethod', new TransbankOneClickPaymentMethod() )
    .register( 'SimultaneousTransaction', new TransbankOneClickTransaction() )
    .register( 'Server', new NodeServer() );
};
