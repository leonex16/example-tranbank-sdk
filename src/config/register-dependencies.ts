import { Container } from '#src/shared/domain/service/dependency-injection/index';
import { DeferredTransbankOneClickTransaction } from '#src/modules/deferred-transaction/infrastructure/transbank/one-click/deferred-transaction';
import { NodeServer } from '#src/modules/server/infrastructure/vanilla/server';
import { SimultaneousTransbankOneClickTransaction } from '#src/modules/simultaneous-transaction/infrastructure/transbank/one-click/simultaneous-transaction';
import { TransbankOneClickPaymentMethod } from '#src/modules/payment-method/insfrastructure/transbank/one-click/payment-method';

export const registerDependencies = () => {
  Container
    .register( 'PaymentMethod', new TransbankOneClickPaymentMethod() )
    .register( 'DeferredTransaction', new DeferredTransbankOneClickTransaction() )
    .register( 'SimultaneousTransaction', new SimultaneousTransbankOneClickTransaction() )
    .register( 'Server', new NodeServer() );
};
