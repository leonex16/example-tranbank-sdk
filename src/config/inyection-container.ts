import { TransbankOneClickPaymentMethod } from "../modules/payment-method/insfrastructure/transbank/one-click/payment-method";
import { NodeServer } from "../modules/server/infrastructure/vanilla/server";
import { Container } from "../shared/domain/service/dependency-injection/dependency-injection";

export const registerDependencies = () => {
  Container
    .register('PaymentMethod', new TransbankOneClickPaymentMethod())
    .register('Server', new NodeServer())
}