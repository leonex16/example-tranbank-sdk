/* eslint-disable max-len */
import { Container } from '#src/shared/domain/service/dependency-injection/index';
import { TransbankOneClickTransaction as DeferredTransbankOneClickTransaction } from '#src/modules/deferred/transaction/infrastructure/transbank/one-click/transaction';
import { NodeServer } from '#src/modules/server/infrastructure/vanilla/server';
import { TransbankOneClickTransaction as SimultaneousTransbankOneClickTransaction } from '#src/modules/simultaneous/transaction/infrastructure/transbank/one-click/transaction';
import { TransbankOneClickPaymentMethod } from '#src/modules/simultaneous/payment-method/insfrastructure/transbank/one-click/payment-method';

export const registerDependencies = () => {
  Container
    .register( 'PaymentMethod', new TransbankOneClickPaymentMethod() )
    .register( 'DeferredTransaction', new DeferredTransbankOneClickTransaction() )
    .register( 'SimultaneousTransaction', new SimultaneousTransbankOneClickTransaction() )
    .register( 'Server', new NodeServer() );
};
