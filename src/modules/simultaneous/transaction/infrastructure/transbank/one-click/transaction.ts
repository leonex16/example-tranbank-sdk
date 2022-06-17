import { IntegrationApiKeys, IntegrationCommerceCodes, Oneclick, Options, TransactionDetail } from 'transbank-sdk';

import type MallTransaction from 'transbank-sdk/dist/es5/transbank/webpay/oneclick/mall_transaction';

import { Transaction } from '#src/modules/simultaneous/transaction/domain/transaction';
import { TranskbankUrlEnvironment } from '#src/modules/simultaneous/payment-method/insfrastructure/transbank/one-click/payment-method';

import type { TranbankTransaction, TransactionItem, TransbankRefound } from '#src/modules/simultaneous/transaction/infrastructure/transbank/one-click/types';

export class TransbankOneClickTransaction implements Transaction {
  private URL_ENVIRONMENT = TranskbankUrlEnvironment.DEV; // MOVE TO ENV

  private transaction: MallTransaction;

  constructor () {
    const opts = new Options( IntegrationCommerceCodes.ONECLICK_MALL, IntegrationApiKeys.WEBPAY, this.URL_ENVIRONMENT );
    this.transaction = new Oneclick.MallTransaction( opts );
  }

  async autorize ( username: string, tbkUser: string, purchaseOrder: string, detail: TransactionItem[] ) {
    const commerceCode = IntegrationCommerceCodes.ONECLICK_MALL_CHILD1;
    const purchaseOrderChildBase = this.generateChildPurchaseOrderId( purchaseOrder );
    const items = detail.map( ( item, i ) => new TransactionDetail( item.amount, commerceCode, `${ purchaseOrderChildBase }-${ ++i }`, item.installments ) );
    const transaction: TranbankTransaction = await this.transaction.authorize( username, tbkUser, `${ purchaseOrderChildBase }-0`, items );
    let successAuthorization = false;

    for ( const item of transaction.details ) {
      const statusOk = item.status === 'AUTHORIZED';
      const responseOk = item.response_code === 0;
      const shouldReject = !statusOk || !responseOk;

      successAuthorization = !shouldReject;

      if ( shouldReject ) break;
    }

    const valueToReturn = {
      'accountingDate': transaction.accounting_date,
      'buyOrder': transaction.buy_order,
      'cardDetail': { 'cardNumber': transaction.card_detail.card_number },
      'details': transaction.details.map( item => ( {
        'amount': item.amount,
        'authorizationCode': item.authorization_code,
        'buyOrder': item.buy_order,
        'commerceCode': item.commerce_code,
        'installmentsNumber': item.installments_number,
        'paymentTypeCode': item.payment_type_code,
        'responseCode': item.response_code,
        'status': item.status
      } ) ),
      'transactionDate': transaction.transaction_date
    };

    return successAuthorization ? valueToReturn : null;
  }

  async getStatus ( purchaseOrder: string ) {
    const transaction: TranbankTransaction = await this.transaction.status( purchaseOrder );

    const valueToReturn = {
      'accountingDate': transaction.accounting_date,
      'buyOrder': transaction.buy_order,
      'cardDetail': { 'cardNumber': transaction.card_detail.card_number },
      'details': transaction.details.map( item => ( {
        'amount': item.amount,
        'authorizationCode': item.authorization_code,
        'buyOrder': item.buy_order,
        'commerceCode': item.commerce_code,
        'installmentsNumber': item.installments_number,
        'paymentTypeCode': item.payment_type_code,
        'responseCode': item.response_code,
        'status': item.status
      } ) ),
      'transactionDate': transaction.transaction_date
    };

    return valueToReturn;
  }

  async reverse ( mainPurchaseOrder: string, childPurchaseOrder: string, amount: number ) {
    const commerceCode = IntegrationCommerceCodes.ONECLICK_MALL_CHILD1;
    const response: TransbankRefound = await this.transaction.refund( mainPurchaseOrder, commerceCode, childPurchaseOrder, amount );

    return response;
  }

  private generateChildPurchaseOrderId ( mainPurchaseOrder: string ): string {
    return `${ mainPurchaseOrder }XXX`;
    // return `${mainPurchaseOrder}${new Date().getTime()}`;
  }
}
