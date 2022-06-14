import { TransbankOneClickPaymentMethod } from "./modules/payment-method/insfrastructure/transbank/one-click/payment-method";
import { NodeServer } from "./modules/server/infrastructure/vanilla/server";
import { Container } from "./shared/domain/service/dependency-injection/dependency-injection";

Container
  .register('PaymentMethod', new TransbankOneClickPaymentMethod())
  .register('Server', new NodeServer())

const server = new NodeServer();

server.listen(3000);